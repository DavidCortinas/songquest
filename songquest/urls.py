from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from songquest import views
from songquest.auth.views import ResendVerificationEmail, verify_email
from songquest.payments import views as paymentViews
from .songs.views import SongUploadView
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    # path("search/", views.search_song, name="search-song"),
    # path("silly-little-test/", views.silly_little_test, name="silly-little-test"),
    path("api/discover/", views.discover_song, name="discover-song"),
    path("api/user/", views.get_user, name="user"),
    path("api/update-display-name/", views.update_display_name, name="update-display-name"),
    path("api/update-birthday/", views.update_birthday, name="update-birthday"),
    path(
        "api/update-preferred-genres/",
        views.update_preferred_genres,
        name="update-preferred-genres",
    ),
    path("api/update-user-type/", views.update_user_type, name="update-user-type"),
    path(
        "api/update-user-profession/",
        views.update_user_profession,
        name="update-user-profession",
    ),
    path(
        "api/update-profile-image/", views.update_profile_image, name="update-profile-image"
    ),
    path("api/update-user-profile/", views.update_user_profile, name="update-user-profile"),
    path("api/get-user-profile/", views.get_user_profile, name="get-user-profile"),
    path("api/get-csrf-token/", views.get_csrf_token, name="get-csrf-token"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("api/upload/", SongUploadView.as_view(), name="song-upload"),
    path(
        "api/auth/spotify/callback/",
        views.handle_spotify_callback,
        name="spotify-auth-callback",
    ),
    path(
        "api/auth/", include(("songquest.routers", "songquest"), namespace="songquest-api")
    ),
    path("api/payments/", include("songquest.payments.urls")),
    path("api/get-access-token/", views.get_access_token_view, name="get-access-token"),
    path(
        "api/request-authorization/",
        views.request_authorization,
        name="request-authorization",
    ),
    path("api/refresh-token/", views.refresh_access_token, name="refresh-token"),
    path("api/get-user-playlists/", views.get_user_playlists, name="get-user-playlists"),
    path("api/create-playlist/", views.create_playlist, name="create-playlist"),
    path("api/delete-playlist/", views.delete_playlist, name="delete-playlist"),
    path(
        "api/add-to-playlist/<str:playlist_id>/",
        views.add_to_playlist,
        name="add-to-playlist",
    ),
    path(
        "api/remove-from-playlist/<str:playlist_id>/",
        views.remove_from_playlist,
        name="remove-from-playlist",
    ),
    path(
        "api/update-playlist-items/<str:playlist_id>/",
        views.update_playlist_items,
        name="update-playlist-items",
    ),
    path("api/create-payment-intent/", paymentViews.create_payment, name="create-payment"),
    path("webhooks/stripe/", paymentViews.stripe_webhook, name="stripe-webhook"),
    path("api/get-spotify-tracks/", views.get_spotify_tracks, name="get-spotify-tracks"),
    path("api/get-spotify-artists/", views.get_spotify_artists, name="get-spotify-artists"),
    path(
        "api/save-request-parameters/",
        views.save_request_parameters,
        name="save-request-parameters",
    ),
    path(
        "api/delete-request-parameters/",
        views.delete_request_parameters,
        name="delete-request-parameters",
    ),
    path("api/get-user-requests/", views.get_user_requests, name="get-user-requests"),
    path("api/get-user-tokens/", views.get_user_tokens, name="get-user-tokens"),
    path("api/get-pricing/", paymentViews.get_all_pricing_packages, name="get-pricing"),
    path("api/verify/<str:token>/", verify_email, name="verify_email"),
    path(
        "api/resend-verification-email/",
        ResendVerificationEmail.as_view(),
        name="resend-verification_email",
    ),
    path("api/add-to-spotify/", views.add_to_spotify, name="add-to-spotify"),
    path("api/check-users-tracks/", views.check_users_tracks, name="check-users-tracks"),
    path(
        "api/remove-users-tracks/", views.remove_users_tracks, name="remove-users-tracks"
    ),
    path("api/follow-artists/", views.follow_artists_on_spotify, name="follow-artists"),
    path("api/unfollow-artists/", views.unfollow_artists, name="unfollow-artists"),
    path(
        "api/user-follows-artists/",
        views.check_if_user_follows_artists,
        name="user-follows-artist",
    ),
    path("", include("frontend.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns.append(
    path(
        "<path:path>",
        TemplateView.as_view(template_name="index.html"),
        name="catch-all",
    )
)
