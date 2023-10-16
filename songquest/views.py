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
from time import time
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
    # Get the CSRF token
    token = get_token(request)

    # Log the token for debugging
    logger.debug(f'Debug - CSRF Token: {token}')

    # Return it in the response
    return JsonResponse({'csrftoken': token})


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
    print('Get User')
    data = json.loads(request.body)
    user = data['email']
    print('user: ', user)
    users = list(User.objects.values_list("email", flat=True))
    try:
        if user in users:
            response_data = {
                "email": user,
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
def discover_song(request):
    data = json.loads(request.body)

    response = get_recommendations(data)

    return JsonResponse(
        response,
        status=200,
        headers={'Access-Control-Allow-Origin': '*'}
    )


@csrf_exempt
def get_access_token_view(request):
    print('get_access_token_view')
    access_token, _ = get_access_token()
    print('access_token 1: ', access_token)

    if access_token:
        return JsonResponse({'access_token': access_token})
    else:
        return JsonResponse({'error': 'Failed to obtain access token'}, status=500)


client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')


# @csrf_exempt
def request_authorization(request):
    print('request_auth')
    print(request)
    # Generate a state and store it in the session for later verification
    state = generate_random_string(16)
    request.session['spotify_state'] = state

    # Spotify API authorization URL
    authorization_url = (
        'https://accounts.spotify.com/authorize/?'
        'client_id={}&response_type=code&redirect_uri={}&scope=user-read-email%20playlist-modify-public%20playlist-modify-private&state={}'
    ).format(client_id, redirect_uri, state)

    print(authorization_url)

    return redirect(authorization_url)


def check_user_exists(email):
    try:
        user = User.objects.get(email=email)
        print('user exists: ', user.email)
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
    print('271: ', user_data)
    display_name = user_data.get('display_name')

    # Check if the display_name field exists
    if display_name:
        return display_name
    else:
        return None  # Email not available


def spotify_redirect(request):
    print("SPOTIFY REDIRECT")
    # Extract any necessary data from the original request

    access_token = request.GET.get('access_token')
    user_data = request.GET.get('user')

    # Define the target URL where you want to redirect
    target_url = f'http://localhost:3000/discover?user={user_data}&access_token={access_token}'
    print('target_url: ', target_url)

    # Redirect the user's browser to the target URL
    return HttpResponseRedirect(target_url)


def handle_callback(request):
    code = request.GET.get('code', None)
    state = request.GET.get('state', None)

    if state is None:
        # Redirect with an error message
        error_params = {'error': 'state_mismatch'}
        return HttpResponseRedirect(reverse('your_redirect_view_name') + '?' + urlencode(error_params))
    else:
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
            access_token = token_info.get('access_token')
            refresh_token = token_info.get('refresh_token')
            print('token info: ', token_info)

            spotify_email = get_spotify_user_email(access_token)
            spotify_display_name = get_spotify_user_display_name(access_token)
            existing_user = check_user_exists(spotify_email)

            print('SPOTIFY EMAIL: ', spotify_email)
            print('NAME: ', spotify_display_name)
            print('EXISTING_USER: ', existing_user)

            if existing_user:
                # Log the user in
                print(spotify_email)
                print('request: ', request)
                # user = authenticate(
                #     request, email=spotify_email, spotify_access_token=access_token)
                # print('authenticated user: ', user)

                token_request_data = {
                    'email': spotify_email,  # Modify this according to your serializer
                    'spotify_access_token': access_token,
                    'spotify_refresh_token': refresh_token,
                }

                if not existing_user.spotify_auth:
                    # If the user is not using Spotify Auth, include the password
                    token_request_data['password'] = existing_user.password
                else:
                    token_request_data.pop('password', None)

                print('after')

                # Check if the user is logged in
                # Check if the user is logged in
                if request.user.is_authenticated:
                    print(request.user)
                    user_data = {
                        'email': request.user.email,
                        # Replace with the actual attribute name
                        'username': request.user.username,
                        # Add more user attributes as needed
                    }
                    redirect_url = f'/redirect/?user={request.user}&access_token={access_token}'
                    print(redirect_url)
                    print('before redirect')

                    return redirect(redirect_url)

                else:
                    # User is not logged in
                    print('User is not logged in')

                # Build a query string with user data
                user_data_query = '&'.join(
                    [f"{key}={value}" for key, value in token_request_data.items()])

                # Redirect to your frontend with user data as query parameters
                redirect_url = f'http://localhost:3000/discover?{user_data_query}'
                return redirect(redirect_url)

            else:
                # password = secrets.token_hex(16)
                user_data = {
                    'email': spotify_email,
                    'spotify_email': spotify_email,
                    'spotify_auth': True,
                    # 'password': password
                }
                json_data = json.dumps(user_data)

                registration_response = requests.post(
                    'http://localhost:8000/api/auth/register/',
                    data=json_data,
                    headers={'Content-Type': 'application/json'}
                )

                if registration_response.status_code == 201:
                    # print(request.user)
                    # print(request.user.email)
                    # print(request.user.username)
                    # user_data = {
                    #     'email': request.user.email,
                    #     'username': request.user.username,
                    #     'spotify_access_token': access_token,
                    #     'spotify_refresh_token': refresh_token,
                    # }

                    # Log in the user by authenticating and creating a session
                    # user = authenticate(
                    #     request, email=spotify_email, password=password)

                    # print('authenticated user: ', user)

                    user_data = {
                        'email': spotify_email,
                        'spotify_access_token': access_token,
                        # Modify this according to your serializer
                        'spotify_refresh_token': refresh_token,
                    }

            # Build a query string with user data
            user_data_query = '&'.join(
                [f"{key}={value}" for key, value in user_data.items()])

            # Redirect to your frontend with user data as query parameters
            redirect_url = f'http://localhost:3000/discover?{user_data_query}'
            return redirect(redirect_url)

        else:
            # Handle the error, possibly by redirecting to an error page
            error_message = 'Failed to obtain access token from Spotify API.'
            return render(request, 'error.html', {'error_message': error_message})


def refresh_access_token(request):
    # Retrieve the refresh token from the request
    refresh_token = request.GET.get('refresh_token', None)

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
            return JsonResponse({'access_token': access_token})

    # Handle errors or return an appropriate response if the refresh token is missing or invalid
    return JsonResponse({'error': 'Failed to refresh access token'}, status=400)
