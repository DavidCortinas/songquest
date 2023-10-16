import base64
import os
import requests
import spotipy
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from time import time

# curl - -request GET \
#     - -url 'https://api.spotify.com/v1/recommendations?seed_artists=0oK5D6uPhGu4Jk2dbZfodU&seed_genres=funk%2C+soul&seed_tracks=3W4xqKFMKBauuU517t8NIb&min_acousticness=0&max_acousticness=1&target_acousticness=5&min_danceability=0&max_danceability=1&target_danceability=.9&min_duration_ms=0&max_duration_ms=1800000&target_duration_ms=180000&min_energy=0&max_energy=1&target_energy=9&min_instrumentalness=0&max_instrumentalness=1&target_instrumentalness=7&min_key=0&max_key=11&target_key=7&min_liveness=0&max_liveness=1&target_liveness=9&min_loudness=-60&max_loudness=0&target_loudness=-5&min_mode=0&max_mode=1&target_mode=7&min_popularity=0&max_popularity=100&target_popularity=10&min_speechiness=0&max_speechiness=1&target_speechiness=6&min_tempo=0&max_tempo=300&target_tempo=110&min_time_signature=0&max_time_signature=11&target_time_signature=4&min_valence=0&max_valence=1&target_valence=9' \
#     - -header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'

load_dotenv()

client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

client_credentials_manager = SpotifyClientCredentials(
    client_id=client_id, client_secret=client_secret)

sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

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


def check_access_token():
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
        return access_token
    except Exception as e:
        print('Spotify API AccessError: ', e)



def get_spotify_rights(song, performer):
    start_time = time()
    try:
        try:
            if performer:
                query = f'track:{song} artist:{performer}'
            else:
                query = song

            results = sp.search(q=query, type='track', limit=1)

            if len(results['tracks']['items']) > 0:
                album_id = results['tracks']['items'][0]['album']['id']

        except Exception as e:
            print('Spotipy Album ID Error: ', e)

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

            song_query = song.replace("'", "%2527").replace(" ", "%2B")
            performer_query = performer.replace(
                "'", "%2527").replace(" ", "%2520")

            url = f'https://api.spotify.com/v1/search?q={song_query}%2520artist%3A{performer_query}&type=track'

            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                tracks = data['tracks']['items']

                target_track = None
                for track in tracks:
                    if (
                        track['name'].lower() == song.lower(
                        ) and track['artists'][0]['name'].lower() == performer.lower()
                    ):
                        target_track = track
                        break

                if target_track:
                    album_id = target_track['album']['id']

                    album = sp.album(album_id=album_id)

                    copyrights = album['copyrights']
                    label = album['label']

                    copyrights_list = []
                    for copyright in copyrights:
                        copyrights_list.append(copyright['text'])

                    data = {
                        'copyrights': [copyrights_list],
                        'label': [[label]]
                    }
                else:
                    print('Track not found')

            else:
                print(
                    f'Request failed with status code: {response.status_code}')
        except Exception as e:
            print('Spotify API Album ID Error: ', e)

    except Exception as e:
        print('Spotify Get Album ID Error: ', e)

    end_time = time()

    elapsed_time = end_time - start_time

    print(f"Spotify elapsed run time: {elapsed_time} seconds")

    return data
