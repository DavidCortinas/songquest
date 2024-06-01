# context_processors.py
from django.conf import settings


def spotify_client_id(request):
    return {"SPOTIFY_CLIENT_ID": settings.SPOTIFY_CLIENT_ID}
