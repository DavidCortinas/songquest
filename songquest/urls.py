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
    path('update-username/<int:user_id>/',
         views.update_username, name='update-username'),
    path('get-csrf-token/', views.get_csrf_token, name='get-csrf-token'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/upload/', SongUploadView.as_view(), name='song-upload'),
    path('api/', include(('songquest.routers', 'songquest'), namespace='songquest-api')),
    path('api/get-access-token/', views.get_access_token_view,
         name='get-access-token'),
    path('request-authorization/', views.request_authorization,
         name='request-authorization'),
    path('spotify-callback/', views.handle_spotify_callback, name='spotify-callback'),
    path('redirect/', views.spotify_redirect, name='spotify-redirect'),
    path('refresh-token/', views.refresh_access_token, name='refresh-token'),
    path('add-to-spotify/', views.add_to_spotify, name='add-to-spotify'),
    path('check-users-tracks/', views.check_users_tracks, name='check-users-tracks'),
    path('remove-users-tracks/', views.remove_users_tracks, name='remove-users-tracks'),
    path('create-playlist/<int:user_id>/', views.create_playlist, name='create-playlist'),
    path('search-lyrics/', views.search_lyrics, name='search-lyrics'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
