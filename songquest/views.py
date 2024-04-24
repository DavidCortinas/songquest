import base64
from urllib.parse import urlencode
from django.utils import timezone
import dateutil
from django.conf import settings
from django.db import transaction
from django.db.models import Max
from django.shortcuts import redirect
import json
import concurrent.futures
import os
from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import HttpResponseForbidden, JsonResponse
from django.core.files.storage import default_storage
from django.shortcuts import get_object_or_404
from time import time

from songquest.playlists.models import Playlist, PlaylistSong, Song
from songquest.recommendations.models import RecommendationRequest

import requests

from songquest.user.models import Genre, User, Profile
from songquest.utilities.image_utlities import resize_image
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
    )


@csrf_exempt
def get_user(request):
    user_email = request.headers.get('User-Email')

    try:
        user = User.objects.get(email=user_email)
        response_data = {
            "email": user.email,
            "username": user.display_name,
            "isRegistered": True,
        }
        return JsonResponse(response_data, status=200)

    except User.DoesNotExist:
        # Handling case where user does not exist
        return JsonResponse({"error": "User does not exist", "isRegistered": False}, status=404) 


@csrf_exempt
def login_user():
    pass


@csrf_exempt
def update_display_name(request):
    if request.method == 'PATCH':
        try:
            user_id = request.headers.get('User-Id')
            user = User.objects.get(pk=user_id)

            data = json.loads(request.body.decode('utf-8'))
            new_display_name = data.get('new_display_name')

            if User.objects.exclude(pk=user_id).filter(display_name=new_display_name).exists():
                return JsonResponse(
                    {'error': 'Display name already exists, please select another option'}, 
                    status=400
                )

            user.display_name = new_display_name
            user.save()

            with transaction.atomic():
                user.complete_onboarding()

            user_data = {
                'id': user.id,
                'email': user.email,
                'display_name': user.display_name,
                'spotifyConnected': user.spotify_connected,
                'tokens': user.tokens,
                'karma': user.karma,
            }

            return JsonResponse({'message': 'Display name updated successfully', 'user': user_data})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def update_birthday(request):
    if request.method == 'PATCH':
        try:
            user_id = request.headers.get('User-Id')
            user = User.objects.get(pk=user_id)

            data = json.loads(request.body.decode('utf-8'))
            birthday = data.get('date')

            parsed_birthday = dateutil.parser.isoparse(birthday).date()
            formatted_birthday = parsed_birthday.strftime('%Y-%m-%d')

            user.birthday = formatted_birthday
            user.save()

            with transaction.atomic():
                user.complete_onboarding()

            return JsonResponse({'message': 'Birthday updated successfully', 'birthday': user.birthday})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def update_preferred_genres(request):
    if request.method == 'PATCH':
        try:
            user_id = request.headers.get('User-Id')
            user = User.objects.get(pk=user_id)

            data = json.loads(request.body.decode('utf-8'))
            genre_names = [genre_name.lower() for genre_name in data.get('genres')] 

            for genre_name in genre_names:
                Genre.objects.get_or_create(name=genre_name)

            genre_objects = Genre.objects.filter(name__in=genre_names)

            user.preferred_genres.set(genre_objects)

            with transaction.atomic():
                user.complete_onboarding()

            updated_genre_names = [genre.name for genre in genre_objects]

            return JsonResponse({'message': 'Preferred genres updated successfully', 'preferred_genres': updated_genre_names})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def update_user_type(request):
    if request.method == 'PATCH':
        try:
            user_id = request.headers.get('User-Id')
            user = User.objects.get(pk=user_id)

            data = json.loads(request.body.decode('utf-8'))
            user_type = data.get('userType') 

            user.user_type = user_type
            user.save()

            with transaction.atomic():
                user.complete_onboarding()

            if user.user_type == 'fan':
                user.profession = None

            return JsonResponse({
                'message': 'Preferred genres updated successfully', 
                'user_type': user.user_type,
                'profession': user.profession,
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def update_user_profession(request):
    if request.method == 'PATCH':
        try:
            user_id = request.headers.get('User-Id')
            user = User.objects.get(pk=user_id)

            data = json.loads(request.body.decode('utf-8'))
            profession = data.get('profession') 

            user.profession = profession
            user.save()

            return JsonResponse({'message': 'Preferred genres updated successfully', 'saved_profession': user.profession})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def update_profile_image(request):
    if request.method == 'POST':
        try:
            user_id = request.headers.get('User-Id')
            user = User.objects.get(pk=user_id)
            file = request.FILES['imageFile'] if 'imageFile' in request.FILES else None

            if not file:
                return JsonResponse({'error': 'No file provided'}, status=400)

            resized_image = resize_image(file)

            user.profile_image.save(resized_image.name, resized_image)

            with transaction.atomic():
                user.complete_onboarding()

            profile_image_url = settings.BASE_URL + user.profile_image.url if user.profile_image else None

            return JsonResponse(
                {
                    'message': 'Profile image updated successfully', 
                    'profile_image': profile_image_url
                }
            )
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            # Catch other errors
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def update_user_profile(request):
    if request.method == 'PATCH':
        try:
            user_id = request.headers.get('User-Id')
            user = User.objects.get(pk=user_id)

            data = json.loads(request.body.decode('utf-8'))
            print('data: ', data)

            display_name = data.get('display_name')
            print(display_name)
            if display_name:
                if User.objects.exclude(pk=user_id).filter(display_name=display_name).exists():
                    return JsonResponse(
                        {'error': 'Display name already exists, please select another option'}, 
                        status=400
                    )
                user.display_name = display_name
                print(user.display_name)

            birthday = data.get('birth_date')
            print(birthday)
            if birthday:
                parsed_birthday = dateutil.parser.isoparse(birthday).date()
                user.birthday = parsed_birthday

            user_type = data.get('user_type')
            if user_type:
                user.user_type = user_type

            profession = data.get('profession')
            if profession:
                user.profession = profession

            print(data.get('genres'))
                
            genre_names = [genre_name.lower() for genre_name in data.get('genres')]

            for genre_name in genre_names:
                Genre.objects.get_or_create(name=genre_name)

            genre_objects = Genre.objects.filter(name__in=genre_names)

            user.preferred_genres.set(genre_objects)

            updated_genre_names = [genre.name for genre in genre_objects]

            user.save()

            with transaction.atomic():
                user.complete_onboarding()

            user_data = {
                'displayName': user.display_name,
                'birthday': user.birthday.strftime('%Y-%m-%d') if user.birthday else None,
                'userType': user.user_type,
                'profession': user.profession,
                'preferredGenres': updated_genre_names,
            }

            return JsonResponse({'message': 'User info updated successfully', 'user': user_data})
        except User.DoesNotExist:
            return JsonResponse({'error': 'There was an issue with your request. If the issue persists, please contact support@songquest.io'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def get_user_profile(request):
    user_id = request.headers.get('User-Id')
    if not user_id:
        return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

    try:
        user = get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    try:
        user_profile = Profile.objects.get(user=user)
        profile_data = serialize_profile(user_profile, request)
        return JsonResponse({'profile': profile_data}, status=200)
    except Profile.DoesNotExist:
        return JsonResponse({'error': 'Profile does not exist for the user.'}, status=404)


@csrf_exempt
def discover_song(request):
    try:
        data = json.loads(request.body)
        action = data['action']
        parameters = data['parameters']

        # Initialize the response
        response = {
            'updated_tokens': 'User not authenticated',
            'updated_karma': 'User not authenticated',
            'recommendations': get_recommendations(parameters)
        }

        # Process for registered users
        user_id = request.headers.get('User-Id')
        if user_id and user_id != 'undefined':
            try:
                user = get_user_model().objects.get(id=user_id)
                user.update_karma(action)
                
                response['updated_tokens'] = user.tokens
                response['updated_karma'] = user.karma
                
            except get_user_model().DoesNotExist:
                # If user_id is provided but invalid, return an error
                return JsonResponse({'error': 'Invalid User-Id'}, status=404)

        # For unregistered users, recommendations are still provided without updating tokens or XP
        return JsonResponse(response, status=200)

    except KeyError:
        return JsonResponse({'error': 'Missing action parameter in request.'}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def get_access_token_view(request):
    # Get the initial access token
    access_token, expires_in = get_access_token()

    expires_at = time() + expires_in

    if access_token:
        if token_expired(expires_at):
            access_token, expires_in = get_access_token()

        return JsonResponse({'access_token': access_token, 'expires_at': expires_at})
    else:
        return JsonResponse({'error': 'Failed to obtain access token'}, status=500)


client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')


@csrf_exempt
def request_authorization(request, source='default'):
    current_user = request.user
    state = generate_random_string(16) + '|' + source
    encoded_state = base64.urlsafe_b64encode(state.encode()).decode('utf-8')  # encode the state to ensure URL safety
    request.session['spotify_state'] = state  # store the original state for verification later

    # Spotify API authorization URL
    authorization_url = (
        'https://accounts.spotify.com/authorize/?'
        'client_id={}&response_type=code&redirect_uri={}&scope=user-library-read user-library-modify user-read-email playlist-modify-public playlist-modify-private&state={}'
    ).format(client_id, redirect_uri, encoded_state)

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
    

@csrf_exempt
def get_spotify_tracks(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = request.headers.get('User-Id')
        if not user_id:
            return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return JsonResponse({'error': 'Invalid User-Id'}, status=400)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                user.spotify_access = spotify_access
                expires_at = time() + token_info['expires_in']
                user.spotify_expires_at = expires_at
                user.save()
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)
    
        # Spotify API endpoint for getting several tracks
        spotify_url = 'https://api.spotify.com/v1/tracks'

        # Get the list of Spotify IDs from the request
        ids = data.get('spotifyIds', [])

        # Check if there are any Spotify IDs in the request
        if not ids:
            return JsonResponse({'error': 'No Spotify IDs provided'}, status=400)

        # Create a comma-separated string of Spotify IDs
        ids_param = ','.join(ids)

        # Set up headers for the GET request
        headers = {
            'Authorization': f'Bearer {spotify_access}',
        }

        # Set up parameters for the GET request
        params = {
            'ids': ids_param,
        }

        # Make the GET request to the Spotify API
        response = requests.get(spotify_url, headers=headers, params=params)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            data = response.json()
            return JsonResponse(data)
        else:
            # If the request was unsuccessful, return an error response
            error_message = f'Error from Spotify API: {response.status_code}'
            return JsonResponse({'error': error_message}, status=response.status_code)

    except Exception as e:
        print('Error: ', str(e))
        return JsonResponse({'error': 'Server error'}, status=500)


@csrf_exempt
def get_spotify_artists(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = request.headers.get('User-Id')

        if not user_id:
            return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return JsonResponse({'error': 'Invalid User-Id'}, status=400)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                user.spotify_access = spotify_access
                expires_at = time() + token_info['expires_in']
                user.spotify_expires_at = expires_at
                user.save()
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

        artist_ids = data.get('artistIds', [])

        if not artist_ids:
            return JsonResponse({'error': 'No artistIds provided'}, status=400)

        # Spotify API endpoint for getting artist details for multiple artists
        spotify_url = 'https://api.spotify.com/v1/artists'

        # Set up headers for the GET request
        headers = {
            'Authorization': f'Bearer {spotify_access}',
        }

        # Set up parameters for the GET request
        params = {
            'ids': ','.join(artist_ids),
        }

        # Make the GET request to the Spotify API
        response = requests.get(spotify_url, headers=headers, params=params)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            data = response.json()
            return JsonResponse({'artists': data['artists']})
        else:
            # If the request was unsuccessful, return an error response
            error_message = f'Error from Spotify API: {response.status_code}'
            return JsonResponse({'error': error_message}, status=response.status_code)

    except Exception as e:
        print('Error: ', str(e))
        return JsonResponse({'error': 'Server error'}, status=500)


def get_spotify_token_info(code):
    # Define your Spotify API credentials
    client_id = os.environ.get('SPOTIFY_CLIENT_ID')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
    redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')

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
        # Log or handle the error appropriately
        logging.error(
            f'Failed to obtain access token from Spotify API. Status code: {token_response.status_code}, Response: {token_response.text}'
        )
        return None


def serialize_profile(profile, request):
    # Prepare data for achievements including linked badge details
    achievements_data = [{
        'name': achievement.name,
        'karma_reward': achievement.karma_reward,
        'token_reward': achievement.token_reward,
        'badge': {
            'name': achievement.badge_reward.name,
            'description': achievement.badge_reward.description,
            'image_url': request.build_absolute_uri(achievement.badge_reward.image.url) if achievement.badge_reward.image else None,
        } if achievement.badge_reward else None,
    } for achievement in profile.achievements.all()]

    return {
        'email': profile.user.email,
        'achievements': achievements_data,
    }


@csrf_exempt
def handle_spotify_callback(request):
    # Extract the query parameters
    code = request.GET.get('code', '')
    encoded_state = request.GET.get('state', '')
    
    # Decode and split the state into its components
    try:
        decoded_state = base64.urlsafe_b64decode(encoded_state.encode()).decode('utf-8')
        state, source = decoded_state.split('|')
    except Exception as e:
        logging.error(f"Error decoding state: {str(e)}")
        return HttpResponseForbidden("Invalid state parameter")

    # Verify state matches what was stored in the session
    if not state == request.session.pop('spotify_state', '').split('|')[0]:
        return HttpResponseForbidden("Invalid state parameter")

    user_id = request.session.get('user_id')  # Assuming you store user_id in session during authorization
    User = get_user_model()
    user = User.objects.get(id=user_id)

    if code:
        token_info = get_spotify_token_info(code)

        if token_info and 'access_token' in token_info:
            access_token = token_info['access_token']
            refresh_token = token_info.get('refresh_token', '')
            expires_at = time() + token_info.get('expires_in', 3600)  # Default to 1 hour if not specified

            # Update user model with Spotify access credentials
            user.spotify_access = access_token
            user.spotify_refresh = refresh_token
            user.spotify_expires_at = expires_at
            user.save()

            spotify_connected = user.spotify_refresh is not None
            # Assuming 'serialize_profile' is a function that prepares user profile data
            user_profile_data = serialize_profile(user.profile)

            return JsonResponse({
                'spotify_connected': spotify_connected,
                'user_profile': user_profile_data,
                'source': source  # Include the source to allow specific frontend behavior
            })

        else:
            # Log and handle the case where Spotify tokens were not retrieved
            logging.error("Failed to retrieve access tokens from Spotify.")
            return JsonResponse({'error': 'Failed to retrieve access tokens'}, status=500)

    else:
        # Log and handle the case where no authorization code was provided
        logging.error("No authorization code provided in the request.")
        return JsonResponse({'error': 'No authorization code provided'}, status=400)


def token_expired(expiration_time):
    current_time = time()

    # Convert the expiration_time to a floating-point number
    expiration_time = float(expiration_time)

    return (expiration_time < current_time)


def refresh_spotify_access(refresh_token):
    client_id = os.environ.get('SPOTIFY_CLIENT_ID')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

    # Prepare the data to send to the Spotify API to refresh the access token
    token_data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }

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
        return token_info

    # Handle errors or return an appropriate response if the refresh token is missing or invalid
    return JsonResponse({'error': 'Failed to refresh access token'}, status=400)


def refresh_access_token(request):
    # # Retrieve the refresh token from the request
    data = json.loads(request.body.decode('utf-8'))
    refresh_token = data['refresh_token']

    if refresh_token:
        client_id = os.environ.get('SPOTIFY_CLIENT_ID')
        client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

        # Prepare the data to send to the Spotify API to refresh the access token
        token_data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }

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
    return JsonResponse({'error': 'Failed to refresh access token'}, status=400)


def generate_unique_id(obj):
    return obj.id + 1 if obj else 1


@csrf_exempt
def create_playlist(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body.decode('utf-8'))
        action = data['action']
        playlist = data['playlist']
        user_id = request.headers.get('User-Id')
        if not user_id:
            return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return JsonResponse({'error': 'Invalid User-Id'}, status=400)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                user.spotify_access = spotify_access
                expires_at = time() + token_info['expires_in']
                user.spotify_expires_at = expires_at
                user.save()
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
            'name': playlist['name'],
            'description': 'Created with SongQuest',
        })

        response = requests.post(spotify_url, headers=headers, data=body)

        if response.status_code == 201:
            spotify_data = response.json()
            last_playlist = Playlist.objects.order_by('-id').first()
            playlist_id = generate_unique_id(last_playlist)

            playlist = Playlist.objects.create(
                id=playlist_id,
                name=spotify_data['name'],
                spotify_id=spotify_data['id'],
                user=user,
                snapshot_id=spotify_data['snapshot_id']
            )

            user.use_tokens(action)
            user.update_karma(action)

            playlist_data = {
                'id': playlist.id,
                'name': playlist.name,
                'tracks': [],
                'snapshotId': playlist.snapshot_id,
            }

            data = {
                'playlistData': playlist_data,
                'updatedTokens': user.tokens,
                'updatedKarma': user.karma,
            }

            return JsonResponse(data, status=200)
        else:
            return JsonResponse({'error': 'Failed to create playlist'}, status=response.status_code)

    except Exception as e:
        print('Error: ', str(e))
        return JsonResponse({'error': 'Server error'}, status=500)


@csrf_exempt
def delete_playlist(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body.decode('utf-8'))

        user_id = request.headers.get('User-Id')
        user = User.objects.get(id=user_id)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                user.spotify_access = spotify_access
                expires_at = time() + token_info['expires_in']
                user.spotify_expires_at = expires_at
                user.save()
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

        playlist_ids = data.get('playlist_ids')
        if not playlist_ids:
            return JsonResponse({'error': 'Playlist IDs are required'}, status=400)

        headers = {
            'Authorization': f'Bearer {spotify_access}',
            'Content-Type': 'application/json'
        }

        for playlist_id in playlist_ids:
            playlist = Playlist.objects.get(id=playlist_id)
            response = requests.delete(
                f'https://api.spotify.com/v1/playlists/{playlist.spotify_id}/followers',
                headers=headers
            )

            if response.status_code in (200, 204):
                playlist.delete()
            else:
                return JsonResponse({'error': 'Failed to unfollow playlist on Spotify', 'status_code': response.status_code}, status=response.status_code)

        return JsonResponse({'message': 'Playlists deleted successfully'}, status=200)

    except Playlist.DoesNotExist:
        return JsonResponse({'error': 'One or more playlists not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return JsonResponse({'error': 'Server error'}, status=500)


@csrf_exempt
def add_to_playlist(request, playlist_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = request.headers.get('User-Id')
        user = User.objects.get(id=user_id)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                user.spotify_access = spotify_access
                expires_at = time() + token_info['expires_in']
                user.spotify_expires_at = expires_at
                user.save()
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

        playlist = Playlist.objects.get(id=playlist_id)
        spotify_id = playlist.spotify_id
        spotify_url = f"https://api.spotify.com/v1/playlists/{spotify_id}/tracks"  # Ensure the URL is correct

        headers = {
            'Authorization': f'Bearer {spotify_access}',
            'Content-Type': 'application/json'
        }

        tracks = data['tracks']
        print(tracks)

        body = json.dumps({
            'uris': [f'spotify:track:{track["spotifyId"]}' for track in tracks],
        })

        # ADD TRACKS TO PLAYLIST INSTANCE IN DB AND UPDATE ORDER
        max_order = PlaylistSong.objects.filter(playlist=playlist).aggregate(Max('order'))['order__max'] or -1
        for track in tracks:
            name = track['name']
            artists = [artist for artist in track['artists']]
            spotify_id = track['spotifyId']
            isrc = track['isrc']
            image = track['image']


            song, created = Song.objects.get_or_create(
                spotify_id=spotify_id,
                defaults={
                    'name': name, 
                    'artists': ', '.join(artists), 
                    'isrc': isrc,
                    'image': image,
                }
            )

            playlist.songs.add(song)

            max_order += 1
            PlaylistSong.objects.create(playlist=playlist, song=song, order=max_order, added_on=timezone.now())

        
        response = requests.post(spotify_url, headers=headers, data=body)

        try:
            response_data = response.json()  # Try to parse response as JSON
            snapshot_id = response_data['snapshot_id']
        except (json.JSONDecodeError, KeyError):
            print('Error parsing or accessing snapshot_id from response:', response.text)
            return JsonResponse({'error': 'Failed to add to playlist'}, status=500)

        playlist.snapshot_id = snapshot_id
        playlist.save()

        if response.status_code == 201 or response.status_code == 200:
            serialized_playlist = {
                'id': playlist.id,
                'name': playlist.name,
                'tracks': [
                    {
                        'id': song.id,
                        'name': song.name,
                        'artists': song.artists.split(', '),
                        'spotifyId': song.spotify_id,
                        'image': song.image,
                    }
                    for song in playlist.songs.all()
                ],
                'snapshotId': playlist.snapshot_id
            }
            return JsonResponse({'playlist': serialized_playlist, 'message': 'Tracks successfully added to playlist'}, status=200)
        else:
            return JsonResponse({'error': 'Failed to add to playlist'}, status=response.status_code)

    except Exception as e:
        print('Error: ', str(e))
        return JsonResponse({'error': 'Server error'}, status=500)
    

@csrf_exempt
def remove_from_playlist(request, playlist_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = request.headers.get('User-Id')
        user = get_object_or_404(User, id=user_id)

        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                user.spotify_access = spotify_access
                expires_at = time() + token_info['expires_in']
                user.spotify_expires_at = expires_at
                user.save()
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

        playlist = get_object_or_404(Playlist, id=playlist_id)
        spotify_id = playlist.spotify_id
        spotify_url = f"https://api.spotify.com/v1/playlists/{spotify_id}/tracks"

        headers = {
            'Authorization': f'Bearer {spotify_access}',
            'Content-Type': 'application/json'
        }

        tracks = data['tracks']
        body = json.dumps({'tracks': [{'uri': f'spotify:track:{track["spotifyId"]}' for track in tracks}]})

        for track in tracks:
            spotify_id = track['spotifyId']
            song = get_object_or_404(Song, spotify_id=spotify_id)
            playlist.songs.remove(song)

            PlaylistSong.objects.filter(playlist=playlist, song=song, removed_on__isnull=True).update(removed_on=timezone.now())
        
        playlist.refresh_from_db()
        
        response = requests.delete(spotify_url, headers=headers, data=body)

        if response.status_code == 200:
            serialized_playlist = {
                'id': playlist.id,
                'name': playlist.name,
                'tracks': [
                    {
                        'id': song.id,
                        'name': song.name,
                        'artists': song.artists.split(', '),
                        'spotifyId': song.spotify_id,
                        'image': song.image,
                    }
                    for song in playlist.songs.all()
                ],
            }
            return JsonResponse({
                'message': 'Tracks successfully removed from playlist',
                'snapshotId': response.json().get('snapshot_id'),
                'playlist': serialized_playlist,
            }, status=200)
        else:
            return JsonResponse({'error': 'Failed to remove from playlist'}, status=response.status_code)

    except Exception as e:
        print('Error: ', str(e))
        return JsonResponse({'error': 'Server error'}, status=500)
    

@csrf_exempt
def update_playlist_items(request, playlist_id):
    if request.method != 'PUT':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = request.headers.get('User-Id')
        user = User.objects.get(id=user_id)

        # Handling Spotify access and refresh tokens
        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                expires_at = time() + token_info['expires_in']
                user.spotify_access = spotify_access
                user.spotify_expires_at = expires_at
                user.save()
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

        playlist = Playlist.objects.get(id=int(playlist_id))
        spotify_id = playlist.spotify_id
        spotify_url = f"https://api.spotify.com/v1/playlists/{spotify_id}/tracks"

        headers = {
            'Authorization': f'Bearer {spotify_access}',
            'Content-Type': 'application/json'
        }

        if 'uris' in data:
            body = json.dumps({'uris': data['uris']})
            method = requests.put
        elif 'range_start' in data:
            body = json.dumps({
                'range_start': data['range_start'],
                'insert_before': data['insert_before'],
                'range_length': data.get('range_length', 1),
            })
            method = requests.put
        else:
            return JsonResponse({'error': 'Invalid parameters'}, status=400)

        response = method(spotify_url, headers=headers, data=body)

        if response.status_code in [200, 201]:
            snapshot_id = response.json().get('snapshot_id')

            # Extract track IDs from URIs and update the order in the database
            track_ids = [uri.split(':')[-1] for uri in data['uris']]
            with transaction.atomic():
                for index, track_id in enumerate(track_ids):
                    song = Song.objects.get(spotify_id=track_id)
                    PlaylistSong.objects.filter(playlist=playlist, song=song).update(order=index)

            ordered_tracks = [
                {
                    'id': pt.song.id,
                    'name': pt.song.name,
                    'artists': pt.song.artists.split(', '),
                    'spotifyId': pt.song.spotify_id,
                    'image': pt.song.image,
                    'isrc': pt.song.isrc,
                } for pt in PlaylistSong.objects.filter(playlist=playlist).select_related('song').order_by('order')
            ]

            return JsonResponse({'message': 'Playlist updated successfully', 'snapshotId': snapshot_id, 'tracks': ordered_tracks}, status=200)
        else:
            return JsonResponse({'error': 'Failed to update playlist on Spotify', 'status_code': response.status_code}, status=response.status_code)

    except Playlist.DoesNotExist:
        return JsonResponse({'error': 'Playlist not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Song.DoesNotExist:
        return JsonResponse({'error': 'Song not found'}, status=404)
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return JsonResponse({'error': 'Server error'}, status=500)
    

@csrf_exempt
def get_user_playlists(request):
    user_id = request.headers.get('User-Id')
    if not user_id:
        return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

    try:
        user = get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return JsonResponse({'error': 'Invalid User-Id'}, status=400)

    playlists = Playlist.objects.filter(user=user)

    serialized_playlists = []
    for playlist in playlists:
        songs = playlist.songs.all()
        serialized_songs = [
            {
                'id': song.id,
                'name': song.name,
                'artists': song.artists.split(', '),
                'spotifyId': song.spotify_id,
                'image': song.image,
                'isrc': song.isrc,
            } for song in songs
        ]

        # LOGIC for getting snapshot_id
        # Implemented for existing playlists
        # Can delete after updating initial creation of playlist and any views
        # that update the playlists to return the snapshot_id
        # --------START--------------
        spotify_access = user.spotify_access
        spotify_refresh = user.spotify_refresh
        expires_at = user.spotify_expires_at

        if token_expired(expires_at):
            token_info = refresh_spotify_access(spotify_refresh)
            if token_info:
                spotify_access = token_info['access_token']
                user.spotify_access = spotify_access
                expires_at = time() + token_info['expires_in']
                user.spotify_expires_at = expires_at
                user.save()
            else:
                return JsonResponse({'error': 'Failed to refresh access token'}, status=400)

        playlist_spotify_id = playlist.spotify_id
        if not playlist_spotify_id:
            return JsonResponse({'error': 'Playlist ID is required'}, status=400)

        headers = {
            'Authorization': f'Bearer {spotify_access}',
            'Content-Type': 'application/json'
        }

        response = requests.get(
            f'https://api.spotify.com/v1/playlists/{playlist_spotify_id}',
            headers=headers
        )

        if response.status_code == 200:
            playlist_spotify_data = response.json()
            snapshot_id = playlist_spotify_data['snapshot_id']
            playlist.snapshot_id = snapshot_id
            playlist.save()
        # --------END--------------

        serialized_playlist = {
            'id': playlist.id,
            'name': playlist.name,
            'spotifyId': playlist.spotify_id,
            'tracks': serialized_songs,
            'snapshotId': snapshot_id,
        }
        serialized_playlists.append(serialized_playlist)

    return JsonResponse({'playlists': serialized_playlists})


@csrf_exempt
def save_request_parameters(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_id = request.headers.get('User-Id')
            if not user_id:
                return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

            try:
                user = get_user_model().objects.get(id=user_id)
            except get_user_model().DoesNotExist:
                return JsonResponse({'error': 'Invalid User-Id'}, status=400)

            request_name = data.get('name', 'Default Name')
            query_data = data.get('query', {})

            # Generate unique ID using the provided function
            unique_id = generate_unique_id(RecommendationRequest.objects.last())

            recommendation_request = RecommendationRequest(
                id=unique_id,
                name=request_name,
                user=user,
                limit=query_data.get('limit', 20),
                market=query_data.get('market', ''),
                seed_artists=json.dumps(query_data.get('performers', [])),
                seed_genres=json.dumps(query_data.get('genres', [])),
                seed_tracks=json.dumps(query_data.get('songs', [])),
                min_acousticness=query_data['acousticness']['min'],
                target_acousticness=query_data['acousticness']['target'],
                max_acousticness=query_data['acousticness']['max'],
                min_danceability=query_data['danceability']['min'],
                target_danceability=query_data['danceability']['target'],
                max_danceability=query_data['danceability']['max'],
                min_duration_ms=query_data['duration_ms']['min'],
                target_duration_ms=query_data['duration_ms']['target'],
                max_duration_ms=query_data['duration_ms']['max'],
                min_energy=query_data['energy']['min'],
                target_energy=query_data['energy']['target'],
                max_energy=query_data['energy']['max'],
                min_instrumentalness=query_data['instrumentalness']['min'],
                target_instrumentalness=query_data['instrumentalness']['target'],
                max_instrumentalness=query_data['instrumentalness']['max'],
                min_key=query_data['key']['min'],
                target_key=query_data['key']['target'],
                max_key=query_data['key']['max'],
                min_liveness=query_data['liveness']['min'],
                target_liveness=query_data['liveness']['target'],
                max_liveness=query_data['liveness']['max'],
                min_loudness=query_data['loudness']['min'],
                target_loudness=query_data['loudness']['target'],
                max_loudness=query_data['loudness']['max'],
                min_mode=query_data['mode']['min'],
                target_mode=query_data['mode']['target'],
                max_mode=query_data['mode']['max'],
                min_popularity=query_data['popularity']['min'],
                target_popularity=query_data['popularity']['target'],
                max_popularity=query_data['popularity']['max'],
                min_speechiness=query_data['speechiness']['min'],
                target_speechiness=query_data['speechiness']['target'],
                max_speechiness=query_data['speechiness']['max'],
                min_tempo=query_data['tempo']['min'],
                target_tempo=query_data['tempo']['target'],
                max_tempo=query_data['tempo']['max'],
                min_time_signature=query_data['time_signature']['min'],
                target_time_signature=query_data['time_signature']['target'],
                max_time_signature=query_data['time_signature']['max'],
                min_valence=query_data['valence']['min'],
                target_valence=query_data['valence']['target'],
                max_valence=query_data['valence']['max'],
            )

            recommendation_request.save()

            return JsonResponse(
                {
                    'success': 'Request parameters saved successfully', 
                    'recommendation_request': recommendation_request.to_dict(),
                }, 
                status=200
            )

        except Exception as e:
            return JsonResponse({'error': 'Server error: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
def get_user_requests(request):
    user_id = request.headers.get('User-Id')
    if not user_id:
        return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

    try:
        user = get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return JsonResponse({'error': 'Invalid User-Id'}, status=400)

    requests = RecommendationRequest.objects.filter(user=user)

    serialized_requests = []
    for req in requests:
        serialized_request = req.to_dict()
        serialized_requests.append(serialized_request)
    return JsonResponse({'requests': serialized_requests})


@csrf_exempt
def get_user_tokens(request):
    user_id = request.headers.get('User-Id')
    if not user_id:
        return JsonResponse({'error': 'User-Id not found in headers'}, status=400)

    try:
        user = get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return JsonResponse({'error': 'Invalid User-Id'}, status=400)

    user_tokens = user.tokens

    return JsonResponse({'tokens': user_tokens})


@csrf_exempt
def add_to_spotify(request):
    print('add to spotify')
    if request.method == 'POST':
        print('if post')
        data = json.loads(request.body.decode('utf-8'))
        recommendation = data.get('recommendation')
        user_id = request.headers.get('User-Id')
        try:
            user = User.objects.get(id=user_id)
            spotify_access = user.spotify_access
            expires_at = user.spotify_expires_at

            if token_expired(expires_at):
                token_info = refresh_spotify_access(user.spotify_refresh)
                if token_info:
                    user.spotify_access = token_info['access_token']
                    expires_at = time() + token_info['expires_in']
                    user.spotify_expires_at = expires_at
                    user.save()
                    spotify_access = token_info['access_token']

            spotify_url = 'https://api.spotify.com/v1/me/tracks'
            headers = {
                'Authorization': f'Bearer {spotify_access}',
                'Content-Type': 'application/json'
            }

            track_id = recommendation['id']
            payload = {"ids": [track_id]}

            response = requests.put(
                spotify_url, headers=headers, data=json.dumps(payload))

            if response.status_code == 200:
                return JsonResponse({'message': 'Added to Spotify library successfully'}, status=200)
            else:
                error_message = 'Failed to add tracks to Spotify library'
                print('Response content:', response.text)
                return JsonResponse({'error': error_message}, status=400)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)
        except Exception as e:
            print('Error:', str(e))
            return JsonResponse({'error': 'Failed to add track to Spotify'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def check_users_tracks(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        recommendation = data.get('recommendation')
        user_id = request.headers.get('User-Id')
        try:
            user = User.objects.get(id=user_id)
            spotify_access = user.spotify_access
            expires_at = user.spotify_expires_at

            if token_expired(expires_at):
                token_info = refresh_spotify_access(user.spotify_refresh)
                if token_info:
                    user.spotify_access = token_info['access_token']
                    expires_at = time() + token_info['expires_in']
                    user.spotify_expires_at = expires_at
                    user.save()
                    spotify_access = token_info['access_token']

            spotify_url = "https://api.spotify.com/v1/me/tracks/contains"
            headers = {
                'Authorization': f'Bearer {spotify_access}',
                'Content-Type': 'application/json'
            }

            track_id = recommendation['id']
            params = {"ids": [track_id]}

            response = requests.get(
                spotify_url, headers=headers, params=params
            )

            if response.status_code == 200:
                track_is_saved = response.json()
                return JsonResponse(track_is_saved, safe=False, status=200)
            else:
                error_message = 'Failed to check saved tracks'
                return JsonResponse({'error': error_message}, status=400)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)
        except Exception as e:
            print('Error:', str(e))
            return JsonResponse({'error': 'Failed to check users tracks'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def remove_users_tracks(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        recommendation = data.get('recommendation')
        user_id = request.headers.get('User-Id')
        try:
            user = User.objects.get(id=user_id)
            spotify_access = user.spotify_access
            expires_at = user.spotify_expires_at

            if token_expired(expires_at):
                token_info = refresh_spotify_access(user.spotify_refresh)
                if token_info:
                    user.spotify_access = token_info['access_token']
                    expires_at = time() + token_info['expires_in']
                    user.spotify_expires_at = expires_at
                    user.save()
                    spotify_access = token_info['access_token']

            spotify_url = "https://api.spotify.com/v1/me/tracks"
            headers = {
                'Authorization': f'Bearer {spotify_access}',
                'Content-Type': 'application/json'
            }

            track_id = recommendation['id']
            params = {"ids": [track_id]}

            response = requests.delete(
                spotify_url, headers=headers, params=params
            )

            if response.status_code == 200:
                return JsonResponse({'message': 'Removed from Spotify library successfully'}, status=200)
            else:
                error_message = 'Failed to remove saved tracks'
                return JsonResponse({'error': error_message}, status=400)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)
        except Exception as e:
            print('Error:', str(e))
            return JsonResponse({'error': 'Failed to remove users tracks'}, status=400)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def follow_artists_on_spotify(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        artist_ids = data.get('ids')
        user_id = request.headers.get('User-Id')

        try:
            user = User.objects.get(id=user_id)
            spotify_access = user.spotify_access
            expires_at = user.spotify_expires_at

            if token_expired(expires_at):
                token_info = refresh_spotify_access(user.spotify_refresh)
                if token_info:
                    user.spotify_access = token_info['access_token']
                    user.spotify_expires_at = time() + token_info['expires_in']
                    user.save()
                    spotify_access = token_info['access_token']

            spotify_url = 'https://api.spotify.com/v1/me/following'
            headers = {
                'Authorization': f'Bearer {spotify_access}',
                'Content-Type': 'application/json'
            }
            payload = {
                'type': 'artist', 
                'ids': artist_ids
            }

            response = requests.put(spotify_url, headers=headers, json=payload)

            if response.status_code == 204:
                return JsonResponse({'message': 'Artists followed successfully'}, status=204)
            else:
                error_message = 'Failed to follow artists'
                print('Response content:', response.text)
                return JsonResponse({'error': error_message}, status=response.status_code)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)
        except Exception as e:
            print('Error:', str(e))
            return JsonResponse({'error': 'Failed to follow artists'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def check_if_user_follows_artists(request):
    if request.method == 'GET':
        user_id = request.headers.get('User-Id')
        artist_ids = request.GET.get('ids')  # Comma-separated artist IDs from query params
        try:
            user = User.objects.get(id=user_id)
            spotify_access = user.spotify_access
            expires_at = user.spotify_expires_at

            if token_expired(expires_at):
                token_info = refresh_spotify_access(user.spotify_refresh)
                if token_info:
                    user.spotify_access = token_info['access_token']
                    user.spotify_expires_at = time() + token_info['expires_in']
                    user.save()
                    spotify_access = user.spotify_access

            spotify_url = f"https://api.spotify.com/v1/me/following/contains?type=artist&ids={artist_ids}"
            headers = {'Authorization': f'Bearer {spotify_access}'}
            response = requests.get(spotify_url, headers=headers)

            if response.status_code == 200:
                return JsonResponse(response.json(), safe=False)
            else:
                return JsonResponse({'error': 'Failed to check if user follows artists'}, status=response.status_code)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def unfollow_artists(request):
    if request.method == 'DELETE':
        user_id = request.headers.get('User-Id')
        try:
            data = json.loads(request.body)
            artist_ids = data.get('ids')  # JSON array of artist IDs
            user = User.objects.get(id=user_id)
            spotify_access = user.spotify_access
            expires_at = user.spotify_expires_at

            if token_expired(expires_at):
                token_info = refresh_spotify_access(user.spotify_refresh)
                if token_info:
                    user.spotify_access = token_info['access_token']
                    user.spotify_expires_at = time() + token_info['expires_in']
                    user.save()
                    spotify_access = user.spotify_access

            spotify_url = 'https://api.spotify.com/v1/me/following'
            headers = {
                'Authorization': f'Bearer {spotify_access}',
                'Content-Type': 'application/json'
            }
            payload = json.dumps({'type': 'artist', 'ids': artist_ids})

            response = requests.delete(spotify_url, headers=headers, data=payload)

            if response.status_code == 204:
                return JsonResponse({'message': 'Successfully unfollowed the artists'}, status=204)
            else:
                return JsonResponse({'error': 'Failed to unfollow artists'}, status=response.status_code)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

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
