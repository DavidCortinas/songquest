from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from songquest import views
from songquest.payments import views as paymentViews
from .songs.views import SongUploadView
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

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
    path('payments/', include('songquest.payments.urls')),
    path('api/get-access-token/', views.get_access_token_view,
         name='get-access-token'),
    path('request-authorization/', views.request_authorization,
         name='request-authorization'),
    path('auth/spotify/callback/', views.handle_spotify_callback,
         name='spotify-auth-callback'),
    path('redirect/', views.spotify_redirect, name='spotify-redirect'),
    path('refresh-token/', views.refresh_access_token, name='refresh-token'),
    path('create-playlist/<int:user_id>/',
         views.create_playlist, name='create-playlist'),
     path('create-payment-intent/', 
          paymentViews.create_payment, name='create-payment'),
    path('<path>', TemplateView.as_view(
        template_name='index.html'), name='catch-all'),
#     path('add-to-spotify/', views.add_to_spotify, name='add-to-spotify'),
#     path('check-users-tracks/', views.check_users_tracks,
#          name='check-users-tracks'),
#     path('remove-users-tracks/', views.remove_users_tracks,
#          name='remove-users-tracks'),
#     path('search-lyrics/', views.search_lyrics, name='search-lyrics'),
     # path('get-openai-initial-response/', views.get_openai_initial_response),
     # path('get-openai-subsequent-response/', views.get_openai_subsequent_response),
]

# urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
