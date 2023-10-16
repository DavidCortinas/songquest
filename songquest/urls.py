from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from songquest import views
from .songs.views import SongUploadView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path("search/", views.search_song, name='search-song'),
    path('api/discover/', views.discover_song, name='discover-song'),
    path("user/", views.get_user, name='user'),
    path('get-csrf-token/', views.get_csrf_token, name='get-csrf-token'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/upload/', SongUploadView.as_view(), name='song-upload'),
    path('api/', include(('songquest.routers', 'songquest'), namespace='songquest-api')),
    path('api/get-access-token/', views.get_access_token_view,
         name='get-access-token'),
    path('request-authorization/', views.request_authorization,
         name='request-authorization'),
    path('callback/', views.handle_callback, name='callback'),
    path('redirect/', views.spotify_redirect, name='spotify-redirect'),
    path('refresh-token/', views.refresh_access_token, name='refresh-token'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
