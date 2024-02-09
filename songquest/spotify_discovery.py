import base64
import os
import requests
from dotenv import load_dotenv
from time import time

load_dotenv()

client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

start_time = time()


def get_access_token():
    # Encode the client ID and client secret as base64
    encoded_credentials = base64.b64encode(
        f"{client_id}:{client_secret}".encode()).decode()

    # Set the headers and payload for the token request
    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    # Make the token request
    response = requests.post(
        "https://accounts.spotify.com/api/token", headers=headers, data=payload)

    if response.status_code == 200:
        # Parse the response to retrieve the access token and expiration time
        token_data = response.json()
        access_token = token_data["access_token"]
        expires_in = token_data["expires_in"]

        return access_token, expires_in
    else:
        # Handle the error response
        print(f"Error: {response.status_code} - {response.text}")
        return None, None


def format_spotify_url(parameters):
    base_url = 'https://api.spotify.com/v1/recommendations?'
    query_params = []

    def add_param(param_name, param_value):
        if param_value is not None:
            query_params.append(f'{param_name}={param_value}')

    limit = parameters.get('limit')
    market = parameters.get('market')
    performers = parameters.get('performers')
    performers_string = '%2C'.join(performers) if performers else None
    genres = parameters.get('genres')
    genres_string = '%2C'.join(genres) if genres else None
    songs = parameters.get('songs')
    songs_string = '%2C'.join(songs) if songs else None
    min_acousticness = parameters.get('acousticness')['min']
    max_acousticness = parameters.get('acousticness')['max']
    target_acousticness = parameters.get('acousticness')['target']
    min_danceability = parameters.get('danceability')['min']
    max_danceability = parameters.get('danceability')['max']
    target_danceability = parameters.get('danceability')['target']
    min_duration_ms = parameters.get('duration_ms')['min']
    max_duration_ms = parameters.get('duration_ms')['max']
    target_duration_ms = parameters.get('duration_ms')['target']
    min_energy = parameters.get('energy')['min']
    max_energy = parameters.get('energy')['max']
    target_energy = parameters.get('energy')['target']
    min_instrumentalness = parameters.get('instrumentalness')['min']
    max_instrumentalness = parameters.get('instrumentalness')['max']
    target_instrumentalness = parameters.get('instrumentalness')['target']
    min_key = parameters.get('key')['min']
    max_key = parameters.get('key')['max']
    target_key = parameters.get('key')['target']
    min_liveness = parameters.get('liveness')['min']
    max_liveness = parameters.get('liveness')['max']
    target_liveness = parameters.get('liveness')['target']
    min_loudness = parameters.get('loudness')['min']
    max_loudness = parameters.get('loudness')['max']
    target_loudness = parameters.get('loudness')['target']
    min_mode = parameters.get('mode')['min']
    max_mode = parameters.get('mode')['max']
    target_mode = parameters.get('mode')['target']
    min_popularity = parameters.get('popularity')['min']
    max_popularity = parameters.get('popularity')['max']
    target_popularity = parameters.get('popularity')['target']
    min_speechiness = parameters.get('speechiness')['min']
    max_speechiness = parameters.get('speechiness')['max']
    target_speechiness = parameters.get('speechiness')['target']
    min_tempo = parameters.get('tempo')['min']
    max_tempo = parameters.get('tempo')['max']
    target_tempo = parameters.get('tempo')['target']
    min_time_signature = parameters.get('time_signature')['min']
    max_time_signature = parameters.get('time_signature')['max']
    target_time_signature = parameters.get('time_signature')['target']
    min_valence = parameters.get('valence')['min']
    max_valence = parameters.get('valence')['max']
    target_valence = parameters.get('valence')['target']

    add_param('limit', limit) if limit else None
    add_param('market', market) if market else None
    add_param('seed_artists', performers_string) if performers else None
    add_param('seed_genres', genres_string) if genres else None
    add_param('seed_tracks', songs_string) if songs else None

    add_param('min_acousticness', min_acousticness) if min_acousticness else None
    add_param('max_acousticness', max_acousticness) if max_acousticness else None
    add_param('target_acousticness',
              target_acousticness) if target_acousticness else None

    add_param('min_danceability', min_danceability) if min_danceability else None
    add_param('max_danceability', max_danceability) if max_danceability else None
    add_param('target_danceability',
              target_danceability) if target_danceability else None

    add_param('min_duration_ms', min_duration_ms) if min_duration_ms else None
    add_param('max_duration_ms', max_duration_ms) if max_duration_ms else None
    add_param('target_duration_ms',
              target_duration_ms) if target_duration_ms else None

    add_param('min_energy', min_energy) if min_energy else None
    add_param('max_energy', max_energy) if max_energy else None
    add_param('target_energy',
              target_energy) if target_energy else None

    add_param('min_instrumentalness',
              min_instrumentalness) if min_instrumentalness else None
    add_param('max_instrumentalness',
              max_instrumentalness) if max_instrumentalness else None
    add_param('target_instrumentalness',
              target_instrumentalness) if target_instrumentalness else None

    add_param('min_key', min_key) if min_key else None
    add_param('max_key', max_key) if max_key else None
    add_param('target_key',
              target_key) if target_key else None

    add_param('min_liveness', min_liveness) if min_liveness else None
    add_param('max_liveness', max_liveness) if max_liveness else None
    add_param('target_liveness',
              target_liveness) if target_liveness else None

    add_param('min_loudness', min_loudness) if min_loudness else None
    add_param('max_loudness', max_loudness) if max_loudness else None
    add_param('target_loudness',
              target_loudness) if target_loudness else None

    add_param('min_mode', min_mode) if min_mode else None
    add_param('max_mode', max_mode) if max_mode else None
    add_param('target_mode',
              target_mode) if target_mode else None

    add_param('min_popularity', min_popularity) if min_popularity else None
    add_param('max_popularity', max_popularity) if max_popularity else None
    add_param('target_popularity',
              target_popularity) if target_popularity else None

    add_param('min_speechiness', min_speechiness) if min_speechiness else None
    add_param('max_speechiness', max_speechiness) if max_speechiness else None
    add_param('target_speechiness',
              target_speechiness) if target_speechiness else None

    add_param('min_tempo', min_tempo) if min_tempo else None
    add_param('max_tempo', max_tempo) if max_tempo else None
    add_param('target_tempo',
              target_tempo) if target_tempo else None

    add_param('min_time_signature',
              min_time_signature) if min_time_signature else None
    add_param('max_time_signature',
              max_time_signature) if max_time_signature else None
    add_param('target_time_signature',
              target_time_signature) if target_time_signature else None

    add_param('min_valence', min_valence) if min_valence else None
    add_param('max_valence', max_valence) if max_valence else None
    add_param('target_valence',
              target_valence) if target_valence else None

    formatted_url = base_url + '&'.join(query_params)

    return formatted_url


def get_recommendations(parameters):
    start_time = time()

    try:
        # Get the initial access token
        access_token, expires_in = get_access_token()

        if access_token:
            # Use the access token in your API requests
            headers = {
                "Authorization": f"Bearer {access_token}",
            }
            # Make your API request with the headers

            # Check if the access token has expired
            if expires_in <= 0:
                # Access token has expired, get a new one
                access_token, expires_in = get_access_token()

                if access_token:
                    # Update the headers with the new access token
                    headers["Authorization"] = f"Bearer {access_token}"
                    # Make your API request with the updated headers
        else:
            # Handle the error case
            print("Failed to obtain access token.")

        separator = "%2C+"

        url = format_spotify_url(parameters)

        response = requests.get(url, headers=headers)
        print('get recc response: ', response)

        if response.status_code == 200:
            data = response.json()

            return data

        else:
            print(
                f'Request failed with status code: {response.status_code}')
    except Exception as e:
        print('Spotify Discovery Error: ', e)

    # end_time = time()

    # elapsed_time = end_time - start_time

    print(f"Spotify elapsed run time: {elapsed_time} seconds")
