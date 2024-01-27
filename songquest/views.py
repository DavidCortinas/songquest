import base64
from urllib.parse import urlencode
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
import json
import concurrent.futures
import os
from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
import urllib.parse
from time import time
from .openai.playlistGenerator import initial_request, subsequent_requests
from .chatgpt import ChatGPT
from rest_framework import status

import requests

from songquest.user.models import User
from .spotify_discovery import get_access_token, get_recommendations
from . import spotify_api
from .scrapers import ascap_scraper, bmi_scraper

import secrets
import string
import logging

logger = logging.getLogger(__name__)


def generate_random_string(length):
    """Generate a random string of the specified length."""
    characters = string.ascii_letters + string.digits
    random_string = ''.join(secrets.choice(characters) for _ in range(length))
    return random_string


@ensure_csrf_cookie
def get_csrf_token(request):
    print('get-csrf-token')
    # Get the CSRF token
    token = get_token(request)

    # Log the token for debugging
    logger.debug(f'Debug - CSRF Token: {token}')

    # Return it in the response
    return JsonResponse(
        {'csrfToken': token},
        status=200,
        headers={'Access-Control-Allow-Origin': '*'}
    )


@csrf_exempt
def search_song(request):
    data = json.loads(request.body)
    song = data.get('song')
    performer = data.get('performer')

    start_time = time()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Initialize variables to hold the results
        ascap_data = {}
        bmi_data = {}
        spotify_data = {}

        try:
            # Submit the ASCAP scraper function to the executor
            ascap_future = executor.submit(
                ascap_scraper.get_ascap_results, song, performer)
        except Exception as e:
            print('ASCAP Error:', e)

        bmi_future = executor.submit(
            bmi_scraper.get_bmi_results, song, performer)
        spotify_future = executor.submit(
            spotify_api.get_spotify_rights, song, performer)

        # Wait for the futures to complete and retrieve the results
        futures = [ascap_future, bmi_future, spotify_future]
        for future in concurrent.futures.as_completed(futures):
            try:
                if future == ascap_future:
                    ascap_data = future.result()
                elif future == bmi_future:
                    bmi_data = future.result()
                elif future == spotify_future:
                    spotify_data = future.result()
            except Exception as e:
                print('Error:', e)

    ascap_data.update(spotify_data) if ascap_data else None
    bmi_data.update(spotify_data) if bmi_data else None

    if not ascap_data and not bmi_data:
        raise ValueError('No search results')

    response_data = {
        "ascap_results": ascap_data,
        "bmi_results": bmi_data
    }

    end_time = time()
    elapsed_time = end_time - start_time
    print(f"Total elapsed run time: {elapsed_time} seconds")

    return JsonResponse(
        response_data,
        status=200,
        headers={'Access-Control-Allow-Origin': '*'}
    )


@csrf_exempt
def get_user(request):
    data = json.loads(request.body)
    user = data['email']
    username = User.objects.get(email=user).username

    users = list(User.objects.values_list("email", flat=True))
    try:
        if user in users:
            response_data = {
                "email": user,
                "username": username,
                "isRegistered": True,
            }
            return JsonResponse(
                response_data,
                status=200,
                headers={'Access-Control-Allow-Origin': '*'}
            )
        else:
            response_data = {
                "email": user,
                "isRegistered": False,
            }
            return JsonResponse(
                response_data,
                status=200,
                headers={'Access-Control-Allow-Origin': '*'}
            )

    except ValueError:
        print("ValueError: ", ValueError)


@csrf_exempt
def login_user():
    pass


@csrf_exempt
def update_username(request, user_id):
    if request.method == 'PATCH':
        try:
            # Retrieve the user
            user = User.objects.get(pk=user_id)

            # Get the new username from the JSON request body
            data = json.loads(request.body.decode('utf-8'))
            new_username = data.get('newUsername')

            # Update the username
            user.username = new_username

            # Save the user object to update the username
            user.save()

            # Return a success response
            return JsonResponse({'message': 'Username updated successfully'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def discover_song(request):
    data = json.loads(request.body)
    print('discover data: ', data)

    response = get_recommendations(data)
    print('discover response: ', response)

    return JsonResponse(
        response,
        status=200,
        headers={'Access-Control-Allow-Origin': '*'}
    )


@csrf_exempt
def get_access_token_view(request):
    # Get the initial access token
    access_token, expires_in = get_access_token()

    expires_at = time() + expires_in

    if access_token:
        if token_expired(expires_at):
            access_token, expires_in = get_access_token()
        # # Use the access token in your API requests
        # headers = {
        #     "Authorization": f"Bearer {access_token}",
        # }
        # # Make your API request with the headers

        # # Check if the access token has expired
        # if expires_at <= time():
        #     # Access token has expired, get a new one
        #     access_token, expires_in = get_access_token()

        #     if access_token:
        #         # Update the headers with the new access token
        #         headers["Authorization"] = f"Bearer {access_token}"
        #         # Make your API request with the updated headers
        return JsonResponse({'access_token': access_token, 'expires_at': expires_at})
    else:
        return JsonResponse({'error': 'Failed to obtain access token'}, status=500)


client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')


@csrf_exempt
def request_authorization(request):
    # Generate a state and store it in the session for later verification
    state = generate_random_string(16)
    request.session['spotify_state'] = state

    # Spotify API authorization URL
    authorization_url = (
        'https://accounts.spotify.com/authorize/?'
        'client_id={}&response_type=code&redirect_uri={}&scope=user-library-read%20user-library-modify%20user-read-email%20playlist-modify-public%20playlist-modify-private&state={}'
    ).format(client_id, redirect_uri, state)

    return redirect(authorization_url)


def check_user_exists(email):
    try:
        user = User.objects.get(email=email)

        return user
    except User.DoesNotExist:
        return None


def authenticate_spotify(request, spotify_access_token):
    # Make a request to the Spotify Web API to get user information
    spotify_user_info = get_spotify_user_data(spotify_access_token)

    if spotify_user_info:
        # Extract the user's email (or any other unique identifier)
        spotify_email = spotify_user_info.get('email')

        if spotify_email:
            # Check if a user with this Spotify email exists in your database
            User = get_user_model()
            try:
                user = User.objects.get(spotify_email=spotify_email)
                return user
            except User.DoesNotExist:
                # User with this Spotify email does not exist, you can choose to register the user here
                return None
    return None


def get_spotify_user_data(access_token):
    # Define the URL for the Spotify API's current user profile endpoint
    spotify_url = 'https://api.spotify.com/v1/me'

    # Set up the headers with the access token
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    try:
        # Make a GET request to the Spotify API
        response = requests.get(spotify_url, headers=headers)

        # Check if the response status code is 200 (OK)
        if response.status_code == 200:
            # Parse the JSON response to get the user's user_name
            user_data = response.json()

            # Check if the user_data exists
            if user_data:
                return user_data
            else:
                return None  # Email not available

        else:
            return None  # Request failed

    except Exception as e:
        print(f"Error fetching Spotify user email: {str(e)}")
        return None


def get_spotify_user_email(access_token):
    user_data = get_spotify_user_data(access_token)
    email = user_data.get('email')

    # Check if the email field exists
    if email:
        return email
    else:
        return None  # Email not available


def get_spotify_user_display_name(access_token):
    user_data = get_spotify_user_data(access_token)
    display_name = user_data.get('display_name')

    # Check if the display_name field exists
    if display_name:
        return display_name
    else:
        return None  # Email not available


def spotify_redirect(request):
    # Extract any necessary data from the original request
    email = request.GET.get('email')
    user = User.objects.get(email=email)

    spotify_access = request.GET.get('spotify_access_token')
    spotify_refresh = request.GET.get('spotify_refresh_token')
    spotify_expires_at = request.GET.get('spotify_expires_at')

    user.spotify_access = spotify_access
    user.spotify_refresh = spotify_refresh
    user.spotify_expires_at = spotify_expires_at
    user.save()

    spotify_connection = bool(user.spotify_refresh)

    # Define the target URL where you want to redirect
    target_url = f'http://localhost:3000/?spotify_connection={spotify_connection}'

    # Redirect the user's browser to the target URL
    return HttpResponseRedirect(target_url)


def get_spotify_token_info(request):
    logging.info('Get Spotify Token: {request}')
    code = request.GET.get('code', None)
    state = request.GET.get('state', None)

    if state is None:
        # Redirect with an error message
        error_params = {'error': 'state_mismatch'}
        return HttpResponseRedirect(reverse('your_redirect_view_name') + '?' + urlencode(error_params))
    else:
        # Define your Spotify API credentials
        client_id = os.environ.get('SPOTIFY_CLIENT_ID')
        logging.info(f'Client ID: {client_id}')
        client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
        logging.info(f'Client Secret: {client_secret}')
        redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')
        logging.info(f'Redirect URI: {redirect_uri}')

        # Prepare the data to send to the Spotify API to obtain an access token
        token_data = {
            'code': code,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }

        # Encode the client_id and client_secret in base64
        credentials = f'{client_id}:{client_secret}'.encode('utf-8')
        encoded_credentials = base64.b64encode(credentials).decode('utf-8')
        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        # Make a POST request to Spotify API to obtain the access token
        token_response = requests.post(
            'https://accounts.spotify.com/api/token', data=token_data, headers=headers)

        if token_response.status_code == 200:
            # Successfully obtained access token
            token_info = token_response.json()
            return token_info

        else:
            # Handle the error, possibly by redirecting to an error page
            error_message = 'Failed to obtain access token from Spotify API.'
            return render(request, 'error.html', {'error_message': error_message})


def handle_spotify_callback(request):
    token_info = get_spotify_token_info(request)
    if token_info is not None:
        access_token = token_info.get('access_token')
        # Rest of your code...
    else:
        logging.warning('Token info is None in handle_spotify_callback')
    access_token = token_info.get('access_token')
    refresh_token = token_info.get('refresh_token')
    expires_at = time() + token_info.get('expires_in', 0)

    spotify_email = get_spotify_user_email(access_token)
    spotify_display_name = get_spotify_user_display_name(access_token)
    existing_user = check_user_exists(spotify_email)

    if existing_user:
        token_request_data = {
            'spotify_access_token': access_token,
            'spotify_refresh_token': refresh_token,
            'spotify_expires_at': expires_at,
        }

        # Check if the user is logged in
        if request.user.is_authenticated:
            print('isAuth')
            print(request.user)
            user_data = {
                'email': request.user.email,
                'username': request.user.username,
                'spotify_access_token': access_token,
                'spotify_refresh_token': refresh_token,
                'spotify_expires_at': expires_at,
            }

            query_string = urllib.parse.urlencode(user_data)

            redirect_url = f'/redirect/?{query_string}'

            return redirect(redirect_url)

        else:
            # User is not logged in
            print('User is not logged in')

        # Build a query string with user data
        user_data_query = '&'.join(
            [f"{key}={value}" for key, value in token_request_data.items()])

        # Redirect to your frontend with user data as query parameters
        redirect_url = f'http://localhost:3000/?{user_data_query}'

        return redirect(redirect_url)

    else:
        # password = secrets.token_hex(16)
        user_data = {
            'email': spotify_email,
            'spotify_email': spotify_email,
            'spotify_auth': True,
        }
        json_data = json.dumps(user_data)

        api_url = os.environ.get('REACT_APP_API_URL')

        registration_response = requests.post(
            f'{api_url}/auth/register/',
            data=json_data,
            headers={'Content-Type': 'application/json'}
        )

        if registration_response.status_code == 201:
            user_data = {
                'email': spotify_email,
                'username': spotify_display_name,
                'spotify_access_token': access_token,
                'spotify_refresh_token': refresh_token,
                'spotify_expires_at': expires_at,
            }

    # Build a query string with user data
    user_data_query = '&'.join(
        [f"{key}={value}" for key, value in user_data.items()])

    # Redirect to your frontend with user data as query parameters
    redirect_url = f'/?{user_data_query}'
    return redirect(redirect_url)


def token_expired(expiration_time):
    current_time = time()

    # Convert the expiration_time to a floating-point number
    expiration_time = float(expiration_time)

    return (expiration_time < current_time)


def refresh_spotify_access(refresh_token):
    print('refresh')
    client_id = os.environ.get('SPOTIFY_CLIENT_ID')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

    # Prepare the data to send to the Spotify API to refresh the access token
    token_data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    print('token_data: ', token_data)

    # Encode the client_id and client_secret in base64
    credentials = f'{client_id}:{client_secret}'.encode('utf-8')
    encoded_credentials = base64.b64encode(credentials).decode('utf-8')
    headers = {
        'Authorization': f'Basic {encoded_credentials}'
    }

    # Make a POST request to Spotify API to refresh the access token
    token_response = requests.post(
        'https://accounts.spotify.com/api/token',
        data=token_data,
        headers=headers
    )

    if token_response.status_code == 200:
        # Successfully obtained refreshed access token
        token_info = token_response.json()
        access_token = token_info.get('access_token')
        print('access_token: ', access_token)

        # You can now use the refreshed access_token for Spotify API requests

        # Return the refreshed access token in the response
        return token_info

    # Handle errors or return an appropriate response if the refresh token is missing or invalid
    print(token_response.status_code)
    print(token_response.text)
    return JsonResponse({'error': 'Failed to refresh access token'}, status=400)


def refresh_access_token(request):
    print('refresh')
    # # Retrieve the refresh token from the request
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    refresh_token = data['refresh_token']

    if refresh_token:
        client_id = os.environ.get('SPOTIFY_CLIENT_ID')
        client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

        # Prepare the data to send to the Spotify API to refresh the access token
        token_data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        print('token_data: ', token_data)

        # Encode the client_id and client_secret in base64
        credentials = f'{client_id}:{client_secret}'.encode('utf-8')
        encoded_credentials = base64.b64encode(credentials).decode('utf-8')
        headers = {
            'Authorization': f'Basic {encoded_credentials}'
        }

        # Make a POST request to Spotify API to refresh the access token
        token_response = requests.post(
            'https://accounts.spotify.com/api/token',
            data=token_data,
            headers=headers
        )

        if token_response.status_code == 200:
            # Successfully obtained refreshed access token
            token_info = token_response.json()
            access_token = token_info.get('access_token')

            # You can now use the refreshed access_token for Spotify API requests

            # Return the refreshed access token in the response
            return JsonResponse(token_info, status=200)

        # Handle errors or return an appropriate response if the refresh token is missing or invalid
        print(token_response.status_code)
        print(token_response.text)
    return JsonResponse({'error': 'Failed to refresh access token'}, status=400)


@csrf_exempt
def get_users_playlists(request):
    if request.method == 'GET':
        data = json.loads(request.body.decode('utf-8'))

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def create_playlist(request, user_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body.decode('utf-8'))
        print('create data: ', data)
        user = User.objects.get(id=user_id)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            print('token_info: ', token_info)
            if token_info:
                spotify_access = token_info['access_token']
                spotify_expires_at = time() + token_info['expires_in']
                print('refreshed spotify_access: ', spotify_access)
                print('refreshed spotify_expires_at: ', spotify_expires_at)
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)
                
        spotify_user = get_spotify_user_data(spotify_access)

        spotify_user_id = spotify_user['id']
        spotify_url = f"https://api.spotify.com/v1/users/{spotify_user_id}/playlists"  # Ensure the URL is correct

        headers = {
            'Authorization': f'Bearer {spotify_access}',
            'Content-Type': 'application/json'
        }
        
        body = json.dumps({
            'name': data['name'],
            'description': 'Created with SongQuest',
        })

        response = requests.post(spotify_url, headers=headers, data=body)

        if response.status_code == 201:
            data = response.json()
            return JsonResponse({ 'name': data['name'], 'spotify_id': data['id'] }, status=200)
        else:
            return JsonResponse({'error': 'Failed to create playlist'}, status=response.status_code)

    except Exception as e:
        print('Error: ', str(e))
        return JsonResponse({'error': 'Server error'}, status=500)


@csrf_exempt
def add_to_playlist(request, user_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body.decode('utf-8'))
        print('add data: ', data)
        user = User.objects.get(id=user_id)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            print('token_info: ', token_info)
            if token_info:
                spotify_access = token_info['access_token']
                spotify_expires_at = time() + token_info['expires_in']
                print('refreshed spotify_access: ', spotify_access)
                print('refreshed spotify_expires_at: ', spotify_expires_at)
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)
                
        spotify_user = get_spotify_user_data(spotify_access)
        print('user: ', spotify_user)

        spotify_user_id = spotify_user['id']
        spotify_url = f"https://api.spotify.com/v1/playlists/{spotify_user_id}/tracks"  # Ensure the URL is correct

        headers = {
            'Authorization': f'Bearer {spotify_access}',
            'Content-Type': 'application/json'
        }
        
        body = json.dumps({
            'name': data['name'],
            'description': 'Created with SongQuest',
        })

        response = requests.post(spotify_url, headers=headers, data=body)
        print(response.text)

        if response.status_code == 201:
            return JsonResponse({'message': 'Playlist created successfully'}, status=200)
        else:
            return JsonResponse({'error': 'Failed to create playlist'}, status=response.status_code)

    except Exception as e:
        print('Error: ', str(e))
        return JsonResponse({'error': 'Server error'}, status=500)


# @csrf_exempt
# def add_to_spotify(request):
#     if request.method == 'POST':
#         data = json.loads(request.body.decode('utf-8'))
#         recommendation = data.get('recommendation')
#         email = data.get('email')
#         user = User.objects.get(email=email)
#         spotify_access = user.spotify_access
#         spotify_refresh = user.spotify_refresh
#         expires_at = user.spotify_expires_at

#         try:
#              # Check if the access token is expired -- MOVED TO FRONTEND
#             if token_expired(expires_at):
#                 token_info = refresh_spotify_access(spotify_refresh)
#                 print('token_info: ', token_info)
#                 if token_info:
#                     spotify_access_token = token_info['access_token']
#                     spotify_expires_at = time() + token_info['expires_in']
#                     user.spotify_access = spotify_access_token
#                     user.spotify_expires_at = spotify_expires_at
#                     user.save()
#                     print('refreshed spotify_access: ', spotify_access)
#                     print('refreshed spotify_expires_at: ', spotify_expires_at)

#                 else:
#                     return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

#             spotify_url = 'https://api.spotify.com/v1/me/tracks'

#             # Set up the headers with the access token
#             headers = {
#                 'Authorization': f'Bearer {spotify_access}',
#                 'Content-Type': 'application/json'
#             }

#             # Define the track IDs to be added (modify this as needed)
#             track_id = recommendation['id']

#             # Create a JSON payload with the track IDs
#             payload = {
#                 "ids": [track_id]
#             }

#             # Make a PUT request to the Spotify API to add the tracks
#             response = requests.put(
#                 spotify_url, headers=headers, data=json.dumps(payload))

#             # Check if the response status code is 200 (OK), indicating success
#             if response.status_code == 200:
#                 # Tracks were added to the user's library successfully
#                 return JsonResponse({'message': 'Added to Spotify library successfully'}, status=200)
#             else:
#                 # Handle other response statuses here (e.g., error handling)
#                 error_message = 'Failed to add tracks to Spotify library'

#                 # Print the response content for more information
#                 print('Response content:', response.text)

#                 return JsonResponse({'error': error_message}, status=400)

#         except requests.exceptions.SSLError as ssl_error:
#             # Handle SSL-related errors
#             print('SSL Error:', str(ssl_error))
#             return JsonResponse({'error': 'SSL error occurred'}, status=400)
#         except Exception as e:
#             print('Error:', str(e))
#             return JsonResponse({'error': 'Failed to add track to Spotify'}, status=400)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)


# @csrf_exempt
# def check_users_tracks(request):
#     if request.method == 'POST':
#         print('check: ', request)
#         data = json.loads(request.body.decode('utf-8'))
#         print(data)
#         recommendation = data.get('recommendation')
#         email = data.get('email')
#         user = User.objects.get(email=email)
#         spotify_access = user.spotify_access
#         spotify_refresh = user.spotify_refresh
#         expires_at = user.spotify_expires_at
#         print('expires: ', expires_at)
#         print('expired: ', token_expired(expires_at))

#         try:
#             # Check if the access token is expired -- MOVED TO FRONTEND
#             if token_expired(expires_at):
#                 print('EXPIRED')
#                 print(spotify_refresh)
#                 token_info = refresh_spotify_access(spotify_refresh)
#                 print('token_info: ', token_info)
#                 if token_info:
#                     spotify_access_token = token_info['access_token']
#                     spotify_expires_at = time() + token_info['expires_in']
#                     user.spotify_access = spotify_access_token
#                     user.spotify_expires_at = spotify_expires_at
#                     user.save()
#                     print('refreshed spotify_access: ', spotify_access)
#                     print('refreshed spotify_expires_at: ', spotify_expires_at)

#                 else:
#                     return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

#             spotify_url = "https://api.spotify.com/v1/me/tracks/contains"

#             headers = {
#                 'Authorization': f'Bearer {spotify_access}',
#                 'Content-Type': 'application/json'
#             }

#             track_id = recommendation['id']

#             params = {
#                 "ids": [track_id]
#             }

#             response = requests.get(
#                 spotify_url, headers=headers, params=params
#             )

#             if response.status_code == 200:
#                 print('200')
#                 track_is_saved = response.json()
#                 return JsonResponse(track_is_saved, safe=False, status=200)
#             else:
#                 error_message = 'Failed to check saved tracks'
#                 return JsonResponse({'error': error_message}, status=400)

#         except requests.exceptions.SSLError as ssl_error:
#             # Handle SSL-related errors
#             print('SSL Error:', str(ssl_error))
#             return JsonResponse({'error': 'SSL error occurred'}, status=400)
#         except Exception as e:
#             print('Error:', str(e))
#             return JsonResponse({'error': 'Failed to check users tracks'}, status=400)

#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)


# @csrf_exempt
# def remove_users_tracks(request):
#     if request.method == 'POST':
#         data = json.loads(request.body.decode('utf-8'))
#         recommendation = data.get('recommendation')
#         email = data.get('email')
#         user = User.objects.get(email=email)
#         spotify_access = user.spotify_access
#         spotify_refresh = user.spotify_refresh
#         expires_at = user.spotify_expires_at

#         try:
#             # Check if the access token is expired -- MOVED TO FRONTEND
#             if token_expired(expires_at):
#                 token_info = refresh_spotify_access(spotify_refresh)
#                 print('token_info: ', token_info)
#                 if token_info:
#                     spotify_access = token_info['access_token']
#                     spotify_expires_at = time() + token_info['expires_in']
#                     print('refreshed spotify_access: ', spotify_access)
#                     print('refreshed spotify_expires_at: ', spotify_expires_at)

#                 else:
#                     return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

#             spotify_url = "https://api.spotify.com/v1/me/tracks"

#             headers = {
#                 'Authorization': f'Bearer {spotify_access}',
#                 'Content-Type': 'application/json'
#             }

#             track_id = recommendation['id']

#             params = {
#                 "ids": [track_id]
#             }

#             response = requests.delete(
#                 spotify_url, headers=headers, params=params
#             )

#             if response.status_code == 200:
#                 # Tracks were removed from the user's library successfully
#                 return JsonResponse({'message': 'Removed Spotify library successfully'}, status=200)
#             else:
#                 error_message = 'Failed to remove saved tracks'
#                 return JsonResponse({'error': error_message}, status=400)

#         except requests.exceptions.SSLError as ssl_error:
#             # Handle SSL-related errors
#             print('SSL Error:', str(ssl_error))
#             return JsonResponse({'error': 'SSL error occurred'}, status=400)
#         except Exception as e:
#             print('Error:', str(e))
#             return JsonResponse({'error': 'Failed to remove users tracks'}, status=400)

#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)


# @csrf_exempt
# def get_openai_initial_response(request):
#     if request.method == 'POST':
#         data = json.loads(request.body.decode('utf-8'))
        
#         return initial_request(data)

#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)
    
# @csrf_exempt
# def get_openai_subsequent_response(request):
#     if request.method == 'POST':
#         data = json.loads(request.body.decode('utf-8'))
#         subsequent_requests(data)

#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)


# @csrf_exempt
# def search_lyrics(request):
#     try:
#         if request.method == 'POST':
#             # Assuming you receive the lyrics as JSON in the request body
#             data = request.body.decode('utf-8')
#             print('search these lyrics: ', data)

#             # 1. Make an API call to Musixmatch
#             musixmatch_api_key = os.environ.get(
#                 'MUSIXMATCH_KEY')  # Your Musixmatch API key
#             musixmatch_endpoint = f"http://api.musixmatch.com/ws/1.1/track.search?q_lyrics={data}&apikey={musixmatch_api_key}"
#             musixmatch_response = requests.get(musixmatch_endpoint)

#             musixmatch_tracks_info = []
#             if musixmatch_response.status_code == 200:
#                 # Parse the Musixmatch response
#                 musixmatch_response_data = musixmatch_response.json()
#                 track_list = musixmatch_response_data.get(
#                     "message", {}).get("body", {}).get("track_list", [])
#                 for track_data in track_list:
#                     track = track_data.get("track", {})
#                     track_name = track.get("track_name", "")
#                     artist_name = track.get("artist_name", "")
#                     album_name = track.get("album_name", "")
#                     musixmatch_tracks_info.append({
#                         "track_name": track_name,
#                         "artist_name": artist_name,
#                         "album_name": album_name,
#                     })

#             # 2. Make an API call to Genius
#             # Replace with your Genius API token
#             genius_api_token = os.environ.get('GENIUS_CLIENT_TOKEN')
#             genius_endpoint = f"https://api.genius.com/search"
#             headers = {
#                 "Authorization": f"Bearer {genius_api_token}"
#             }
#             params = {
#                 "q": data
#             }
#             genius_response = requests.get(
#                 genius_endpoint, headers=headers, params=params)

#             genius_tracks_info = []
#             if genius_response.status_code == 200:
#                 # Parse the Genius response
#                 genius_response_data = genius_response.json()
#                 hits = genius_response_data.get("response", {}).get("hits", [])
#                 for hit in hits:
#                     result = hit.get("result", {})
#                     genius_tracks_info.append({
#                         "track_name": result.get("title", ""),
#                         "artist_name": result.get("primary_artist", {}).get("name", ""),
#                         "album_name": result.get("album", {}).get("name", ""),
#                     })

#             # 3. Compare the results
#             response_data = {
#                 "musixmatch_tracks_info": musixmatch_tracks_info,
#                 "genius_tracks_info": genius_tracks_info
#             }

#             print('Musixmatch Tracks Info: ', musixmatch_tracks_info)
#             print('Genius Tracks Info: ', genius_tracks_info)

#             combined_tracks_info = musixmatch_tracks_info + genius_tracks_info

#             # Remove duplicates based on matching track_name and artist_name
#             unique_tracks_info = []
#             seen_tracks = set()  # Keep track of seen (non-unique) tracks

#             for track in combined_tracks_info:
#                 track_name = track["track_name"]
#                 artist_name = track["artist_name"]
#                 track_key = (track_name, artist_name)

#                 # Check if this track has already been seen
#                 if track_key in seen_tracks:
#                     continue  # Skip this duplicate

#                 # Otherwise, add it to the unique list
#                 seen_tracks.add(track_key)
#                 unique_tracks_info.append(track)

#             # Now, unique_tracks_info contains only one entry for each unique track

#             # Include only combined results after removing duplicates
#             response_data = {
#                 "combined_tracks_info": unique_tracks_info
#             }

#             print('response: ', response_data)

#             return JsonResponse(response_data)

#         else:
#             return JsonResponse({'error': 'Invalid request method'}, status=400)
#     except Exception as e:
#         # Log the exception
#         print("An error occurred in the search_lyrics view: %s", str(e))
#         # You can return an error response to the client as well
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# @csrf_exempt
# def search_lyrics(request):
#     try:
#         if request.method == 'POST':
#             data = request.body.decode('utf-8')
#             print('search these lyrics: ', data)
#             chatgpt = ChatGPT(api_key=os.environ.get('OPENAI_API_KEY'))
#             response = chatgpt.generate_response(data)
#             print('response: ', response)
#             return JsonResponse({"response": response})
#         else:
#             return JsonResponse({'error': 'Invalid request method'}, status=400)
#     except Exception as e:
#         # Log the exception
#         print("An error occurred in the search_lyrics view: %s", str(e))
#         # You can return an error response to the client as well
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)
