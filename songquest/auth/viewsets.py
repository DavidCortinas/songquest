from django.contrib.auth import get_user_model
from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.views import TokenRefreshView

from songquest.auth.serializers import LoginSerializer, RegisterSerializer
from songquest.user.models import User
from songquest.user.serializers import UserSerializer
from songquest.views import request_authorization


class LoginViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        print('CREATE')

        # Check if a Spotify access token is provided in the request data
        spotify_access_token = request.data.get('spotify_access_token')
        spotify_refresh_token = request.data.get('spotify_refresh_token')
        spotify_expires_at = request.data.get('spotify_expires_at')
        print('spotify_access: ', spotify_access_token)
        print('spotify_refresh: ', spotify_refresh_token)
        print('spotify_expires_at: ', spotify_expires_at)

        if spotify_access_token:
            # Handle Spotify authentication
            email = request.data.get('email')
            user = get_user_model().objects.get(email=email)
            print('login user: ', user)
            if user:
                # Log the user in without requiring a password
                serializer = LoginSerializer()

                token = serializer.get_token(user)
                token_data = {
                    'user': UserSerializer(user).data,
                    'refresh': str(token),
                    'access': str(token.access_token),
                    'spotify_access': spotify_access_token,
                    'spotify_refresh': spotify_refresh_token,
                    'spotify_expires_at': spotify_expires_at,
                }

                return Response(token_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Spotify authentication failed"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # If no Spotify access token is provided, proceed with regular login
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print('register request: ', request)
        print('register serializer: ', serializer)

        if not serializer.is_valid():
            print('Validation Errors:', serializer.errors)
            # Raise exception for validation errors
            serializer.is_valid(raise_exception=True)

        # Check if a password is provided in the request data
        password = request.data.get('password')
        spotify_auth = request.data.get('spotify_auth')

        if not spotify_auth and not password:
            # Registration without a password when spotify_auth is False
            return Response(
                {"password": [
                    "This field is required when spotify_auth is False."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"],
        }, status=status.HTTP_201_CREATED)


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
