from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist

from songquest.user.serializers import UserSerializer
from songquest.user.models import User


class LoginSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')

        if (email or username) and password:
            print(email)
            print(username)
            print(password)
            user = authenticate(request=self.context.get('request'), 
                                username=username, email=email, password=password)

            if not user:
                raise serializers.ValidationError('No active account found with the given credentials')

            data = super().validate(attrs)
            data.update({'user': UserSerializer(user).data})  # assuming UserSerializer is your user model serializer

            return data


class RegisterSerializer(UserSerializer):
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True, required=False)
    email = serializers.EmailField(
        required=True, write_only=True, max_length=128)

    class Meta:
        model = User
        fields = ['email', 'password', 'username', 'spotify_auth']

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
