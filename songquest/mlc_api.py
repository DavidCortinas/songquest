import requests

username = 'dcortinas33@gmail.com'
password = '3#qUUfWYgVJ3zY1'

# Endpoint URLs
token_url = 'https://public-api.themlc.com/oauth/token'
work_url = 'https://public-api.themlc.com/work/id/{id}'
songcode_url = 'https://public-api.themlc.com/search/songcode'


def get_access_token():

    # Request headers
    headers = {'Content-Type': 'application/json'}

    # Request body for token endpoint
    token_payload = {
        'username': username,
        'password': password
    }

    # Send POST request to obtain token
    token_response = requests.post(
        token_url, headers=headers, json=token_payload)

    # Check the token response status code
    if token_response.status_code == 200:
        # Successful token request
        token_response_data = token_response.json()
        access_token = token_response_data['accessToken']
        refresh_token = token_response_data['refreshToken']
        expires_in = token_response_data['expiresIn']

        print('token response:', token_response_data)
        return access_token, refresh_token, expires_in

    else:
        # Error occurred during token request
        print('Token Error:', token_response.status_code, token_response.text)


def get_work():
    # Set the work ID you want to retrieve
    work_id = '867584675'
    print("GET WORK")

    try:
        access_token, refresh_token, expires_in = get_access_token()
        print("access_token: ", access_token)
        print("refresh_token: ", refresh_token)
        print("expires_in: ", expires_in)
        print("expires_in_type: ", type(expires_in))
        if access_token:
            # Set authorization header with the access token
            work_headers = {
                'Content-Type': 'application/json',
                # 'Authorization': f'Bearer {access_token}'
                # 'Authorization': f'Bearer {refresh_token}'
            }
            # Check if the access token has expired
            if int(expires_in) <= 0:
                # Access token has expired, get a new one
                access_token, expires_in = get_access_token()
                if access_token:
                    # Update the headers with the new access token
                    work_headers["Authorization"] = f"Bearer {access_token}"
                    # Make your API request with the updated headers
        else:
            # Handle the error case
            print("Failed to obtain access token.")

            # Create the work URL with the provided work ID
        work_url_with_id = work_url.replace('{id}', work_id)
        print(work_url_with_id)

        # Send GET request to work endpoint
        print("Before Work Response")
        work_response = requests.get(
            work_url_with_id, headers=work_headers)
        print("work_response: ", work_response)

        # Check the work response status code
        if work_response.status_code == 200:
            # Successful work request
            work_data = work_response.json()
            # Process the work data as needed
            print('Work Data:', work_data)
        else:
            # Error occurred during work request
            print('Work Error:', work_response.status_code, work_response.text)

    except Exception as e:
        print('Get Work Error: ', e)


def get_songcode():
    try:
        access_token, refresh_token, expires_in = get_access_token()
        print("access_token: ", access_token)
        print("refresh_token: ", refresh_token)
        print("expires_in: ", expires_in)
        print("expires_in_type: ", type(expires_in))
        if access_token:
            # Set authorization header with the access token
            songcode_headers = {
                'Content-Type': 'application/json',
                # 'Authorization': f'Bearer {access_token}'
                # 'Authorization': f'Bearer {refresh_token}'
            }
            # Check if the access token has expired
            if int(expires_in) <= 0:
                # Access token has expired, get a new one
                access_token, expires_in = get_access_token()
                if access_token:
                    # Update the headers with the new access token
                    songcode_headers["Authorization"] = f"Bearer {access_token}"
                    # Make your API request with the updated headers
        else:
            # Handle the error case
            print("Failed to obtain access token.")

        # Set the title you want to retrieve
        title = "don't let me die in waco"

        payload = {
            'title': title,
        }

        print("Before Songcode Response")
        songcode_response = requests.get(
            songcode_url, headers=songcode_headers, data=payload)
        print("songcode_response: ", songcode_response)

        # Check the songcode response status code
        if songcode_response.status_code == 200:
            # Successful songcode request
            songcode_data = songcode_response.json()
            # Process the songcode data as needed
            print('Songcode Data:', songcode_data)
        else:
            # Error occurred during songcode request
            print('Songcode Error:', songcode_response.status_code,
                  songcode_response.text)

    except Exception as e:
        print('Get Songcode Error: ', e)


get_work()
get_songcode()
