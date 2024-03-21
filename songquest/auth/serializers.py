from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login

from songquest.user.models import User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

class LoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Authenticate using email as username
        user = authenticate(request=self.context.get('request'), username=email, password=password)
        
        if not user:
            raise serializers.ValidationError('No active account found with the given credentials')

        # Generate token pair for the user
        token_pair = self.get_token(user)

        # Include user data in the response
        return {
            'refresh': str(token_pair),
            'access': str(token_pair.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                # Add other user fields as needed
            }
        }

    def get_token(self, user):
        return super().get_token(user)

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

