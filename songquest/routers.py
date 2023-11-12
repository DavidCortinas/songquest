from rest_framework.routers import SimpleRouter
from songquest.user.viewsets import UserViewSet
from songquest.songs.views import SongViewSet
from songquest.auth.viewsets import LoginViewSet, RegistrationViewSet, RefreshViewSet


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'auth/login', LoginViewSet, basename='auth-login')
routes.register(r'auth/register', RegistrationViewSet,
                basename='auth-register')
routes.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'user', UserViewSet, basename='user')

# SONG
routes.register(r'songs', SongViewSet, basename='song')

urlpatterns = [
    *routes.urls
]
