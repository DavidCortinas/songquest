from rest_framework.routers import SimpleRouter
from songquest.user.viewsets import UserViewSet
from songquest.songs.views import SongViewSet
from songquest.auth.viewsets import (
    LoginViewSet,
    PasswordResetConfirmViewSet,
    PasswordResetViewSet,
    RegistrationViewSet,
    RefreshViewSet,
)


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r"auth/login", LoginViewSet, basename="auth-login")
routes.register(r"auth/register", RegistrationViewSet, basename="auth-register")
routes.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")
routes.register(r"auth/password-reset", PasswordResetViewSet, basename="password-reset")
routes.register(
    r"auth/password-reset-confirm",
    PasswordResetConfirmViewSet,
    basename="password-reset-confirm",
)

# USER
routes.register(r"user", UserViewSet, basename="user")

# SONG
routes.register(r"songs", SongViewSet, basename="song")

urlpatterns = [*routes.urls]
