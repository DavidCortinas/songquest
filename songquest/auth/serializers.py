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
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Authenticate primarily using email
        user = authenticate(request=self.context.get('request'), 
                            username=email, password=password)

        if not user:
            raise serializers.ValidationError('No active account found with the given credentials')

        # Assuming UserSerializer is your user model serializer
        data = super().validate(attrs)
        data.update({'user': UserSerializer(user).data})

        return data


from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, write_only=True, max_length=128)
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True)
    username = serializers.CharField(
        required=True, max_length=150)

    class Meta:
        model = User
        fields = ['email', 'password', 'username']

    def create(self, validated_data):
        # Check if a user with this email already exists
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError(
                {"email": "A user with that email already exists."})

        # Create the user
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )

        return user

