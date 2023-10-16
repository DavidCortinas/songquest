from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist

from songquest.user.serializers import UserSerializer
from songquest.user.models import User


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        print('VALIDATE')
        # Check if 'spotify_access_token' is present in the request data
        spotify_access_token = self.context['request'].data.get(
            'spotify_access_token')
        if spotify_access_token:
            # Handle Spotify authentication without requiring a password
            user = User.objects.get(email=attrs['email'])
            refresh = self.get_token(user)
            refresh_token = str(refresh)

            if api_settings.UPDATE_LAST_LOGIN:
                update_last_login(None, user)

            # Customize the data you want to return in the response
            data = {
                'user': UserSerializer(user).data,
                'refresh': refresh_token,
                'access': str(refresh.access_token),
            }
        else:
            # Perform regular login validation
            data = super().validate(attrs)
            user = User.objects.get(email=attrs['email'])
            refresh = self.get_token(user)
            refresh_token = str(refresh)
            data['user'] = UserSerializer(user).data
            data['refresh'] = refresh_token
            data['access'] = str(refresh.access_token)

        return data


class RegisterSerializer(UserSerializer):
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True, required=False)
    email = serializers.EmailField(
        required=True, write_only=True, max_length=128)

    class Meta:
        model = User
        fields = ['email', 'password', 'spotify_email', 'spotify_auth']

    def create(self, validated_data):
        spotify_auth = validated_data.get('spotify_auth', False)

        if not spotify_auth:
            # If not using Spotify Auth, require the password
            password = validated_data.get('password')
            if not password:
                raise serializers.ValidationError(
                    "Password is required for non-Spotify authentication.")

        try:
            user = User.objects.get(email=validated_data['email'])
        except ObjectDoesNotExist:
            # Exclude the password field when creating the user
            validated_data.pop('password', None)
            user = User.objects.create_user(**validated_data)

        return user
