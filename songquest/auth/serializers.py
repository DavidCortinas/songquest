from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from songquest.user.serializers import UserSerializer
from songquest.utilities.email_utlities import send_password_reset_email

User = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError(
                "Email and password do not match! Please confirm your password and try again."
            )

        user_data = UserSerializer(
            user, context={"request": self.context.get("request")}
        ).data

        token_pair = self.get_token(user)

        return {
            "refresh": str(token_pair),
            "access": str(token_pair.access_token),
            "user": user_data,
        }

    def get_token(self, user):
        return super().get_token(user)


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, write_only=True, max_length=128)
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ["email", "password"]

    def create(self, validated_data):
        # Check if a user with this email already exists
        if User.objects.filter(email=validated_data["email"]).exists():
            raise serializers.ValidationError(
                {"email": "A user with that email already exists."}
            )

        # Create the user
        user = User.objects.create_user(
            email=validated_data["email"], password=validated_data["password"]
        )

        return user


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self):
        email = self.validated_data["email"]
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        # Send the password reset email
        send_password_reset_email(user.email, uid, token)
