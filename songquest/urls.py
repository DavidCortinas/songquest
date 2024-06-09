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
    path("search/", views.search_song, name="search-song"),
    path("silly-little-test/", views.silly_little_test, name="silly-little-test"),
    path("api/discover/", views.discover_song, name="discover-song"),
    path("user/", views.get_user, name="user"),
    path("update-display-name/", views.update_display_name, name="update-display-name"),
    path("update-birthday/", views.update_birthday, name="update-birthday"),
    path(
        "update-preferred-genres/",
        views.update_preferred_genres,
        name="update-preferred-genres",
    ),
    path("update-user-type/", views.update_user_type, name="update-user-type"),
    path(
        "update-user-profession/",
        views.update_user_profession,
        name="update-user-profession",
    ),
    path(
        "update-profile-image/", views.update_profile_image, name="update-profile-image"
    ),
    path("update-user-profile/", views.update_user_profile, name="update-user-profile"),
    path("get-user-profile/", views.get_user_profile, name="get-user-profile"),
    path("get-csrf-token/", views.get_csrf_token, name="get-csrf-token"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("api/upload/", SongUploadView.as_view(), name="song-upload"),
    path(
        "auth/spotify/callback/",
        views.handle_spotify_callback,
        name="spotify-auth-callback",
    ),
    path(
        "api/", include(("songquest.routers", "songquest"), namespace="songquest-api")
    ),
    path("payments/", include("songquest.payments.urls")),
    path("api/get-access-token/", views.get_access_token_view, name="get-access-token"),
    path(
        "request-authorization/",
        views.request_authorization,
        name="request-authorization",
    ),
    path("refresh-token/", views.refresh_access_token, name="refresh-token"),
    path("get-user-playlists/", views.get_user_playlists, name="get-user-playlists"),
    path("create-playlist/", views.create_playlist, name="create-playlist"),
    path("delete-playlist/", views.delete_playlist, name="delete-playlist"),
    path(
        "add-to-playlist/<str:playlist_id>/",
        views.add_to_playlist,
        name="add-to-playlist",
    ),
    path(
        "remove-from-playlist/<str:playlist_id>/",
        views.remove_from_playlist,
        name="remove-from-playlist",
    ),
    path(
        "update-playlist-items/<str:playlist_id>/",
        views.update_playlist_items,
        name="update-playlist-items",
    ),
    path("create-payment-intent/", paymentViews.create_payment, name="create-payment"),
    path("webhooks/stripe/", paymentViews.stripe_webhook, name="stripe-webhook"),
    path("get-spotify-tracks/", views.get_spotify_tracks, name="get-spotify-tracks"),
    path("get-spotify-artists/", views.get_spotify_artists, name="get-spotify-artists"),
    path(
        "save-request-parameters/",
        views.save_request_parameters,
        name="save-request-parameters",
    ),
    path(
        "delete-request-parameters/",
        views.delete_request_parameters,
        name="delete-request-parameters",
    ),
    path("get-user-requests/", views.get_user_requests, name="get-user-requests"),
    path("get-user-tokens/", views.get_user_tokens, name="get-user-tokens"),
    path("get-pricing/", paymentViews.get_all_pricing_packages, name="get-pricing"),
    path("verify/<str:token>/", verify_email, name="verify_email"),
    path(
        "resend-verification-email/",
        ResendVerificationEmail.as_view(),
        name="resend-verification_email",
    ),
    path("add-to-spotify/", views.add_to_spotify, name="add-to-spotify"),
    path("check-users-tracks/", views.check_users_tracks, name="check-users-tracks"),
    path(
        "remove-users-tracks/", views.remove_users_tracks, name="remove-users-tracks"
    ),
    path("follow-artists/", views.follow_artists_on_spotify, name="follow-artists"),
    path("unfollow-artists/", views.unfollow_artists, name="unfollow-artists"),
    path(
        "user-follows-artists/",
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
