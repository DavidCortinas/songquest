from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.views import TokenRefreshView

from songquest.auth.serializers import (
    LoginSerializer,
    PasswordResetSerializer,
    RegisterSerializer,
)
from songquest.user.models import User
from songquest.user.serializers import UserSerializer
from songquest.utilities.email_utlities import send_verification_email


class LoginViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Generate verification token and save it to the user model
        verification_token = RefreshToken.for_user(user).access_token
        user.email_verification_token = verification_token
        user.save()

        send_verification_email(user.email, verification_token)

        refresh = RefreshToken.for_user(user)
        res = {"refresh": str(refresh), "access": str(refresh.access_token)}

        return Response(
            {
                "user": serializer.data,
                "refresh": res["refresh"],
                "token": res["access"],
            },
            status=status.HTTP_201_CREATED,
        )


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class PasswordResetViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "detail": "Password reset e-mail has been sent! Check your email and follow the instructions to reset your password."
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response(
                {"detail": "Password has been reset! Navigating back to login..."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": "Invalid token or user ID."},
                status=status.HTTP_400_BAD_REQUEST,
            )
