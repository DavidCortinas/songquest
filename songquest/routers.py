from rest_framework.routers import SimpleRouter
from songquest.user.viewsets import UserViewSet
from songquest.songs.views import SongViewSet
from songquest.auth.viewsets import (
    LoginViewSet,
    LogoutViewSet,
    PasswordResetConfirmViewSet,
    PasswordResetViewSet,
    RegistrationViewSet,
    RefreshViewSet,
)


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r"login", LoginViewSet, basename="auth-login")
routes.register(r"register", RegistrationViewSet, basename="auth-register")
routes.register(r"refresh", RefreshViewSet, basename="auth-refresh")
routes.register(r"password-reset", PasswordResetViewSet, basename="password-reset")
routes.register(
    r"password-reset-confirm",
    PasswordResetConfirmViewSet,
    basename="password-reset-confirm",
)
routes.register(r"logout", LogoutViewSet, basename="logout")
# USER
routes.register(r"user", UserViewSet, basename="user")

# SONG
routes.register(r"songs", SongViewSet, basename="song")

urlpatterns = [*routes.urls]
