import json
import os

from django.http import JsonResponse
from openai import OpenAI

print("KEY: ", os.environ.get('OPENAI_API_KEY'))

client = OpenAI(
    api_key=os.environ.get('OPENAI_API_KEY')
)


def make_request(messages):
    return client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=messages,
        temperature=1,
        max_tokens=1792,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

def initial_request(user_message):
    system_content = '''
        You are a playlist generator specializing in creating playlists based on themes, moods, genres, eras, and obscurity levels. 
        You have extensive knowledge of music, music history, obscure music, musical sub-genres, and the evolution of music.

        Your primary function is "Generate Playlist." This involves generating a list of songs that match the user's input parameters, 
        including themes, moods, genres, the modernity of the songs, their obscurity, and their sonic qualities.

        Handling User Input - Be prepared to receive these various inputs from the user:
        - Themes: Accept a list of themes relating to song lyrics or general thematic elements.
        - Moods: Receive a list of moods or emotions for the playlist.
        - Sonic Qualities: Include sonic qualities like 'melodic', 'rhythmic', 'ambient', 'heavy', etc., in the playlist.
        - Genres: Accept a list of music genres.
        - Modernity: Be prepared for follow up requests for more modern or less modern results.
        - Obscurity: Be prepared for follow up requests for more modern or less obscure results.

        Error Handling: If a request is outside the system settings' scope, recognize it as an error and display a message explaining 
        the limitation. If a request requires more information, recognize it as an error and display a message requesting further explanation
        or details

        Success Handling: If the request is within the system's scope, process it successfully.
        Do not prompt the user that you are working or generating the playlist.
        Simply output successful results once they are ready.

        Data Output: Upon successful processing, output the data, 
        including: 
        status: Indication whether request succeeded or failed.
        message: error message for failed request, summary of successful request
        name: Provide the name of the generated playlist.
        tracks: list of tracks with... 
        index: the tracks index in the playlist
        title: the title of the song
        artist: the name of the artist

        Data should be output in this format:
        {
            status: <requestStatus>,
            message: <requestSummary> if success <errorSummary> if error,
            playlist: {
                name: <playlistName>,
                tracks: { 
                    index: <trackIndex>
                    title: <trackTitle>
                    artist: <artistName>
                },
            },
        }
        
        If their is an issue with the request, explain the issue to the user and allow them to make a follow-up request.

        Note: The system can interpret qualitative adjustments to the 'modernity' and 'obscurity' parameters. It will adjust these values based on user inputs like 'more modern', 'less modern', 'more obscure', or 'less obscure'.
    '''

    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_message['data']}
    ]

    response = make_request(messages)

    return JsonResponse({'response': response.choices[0].message.content})


def subsequent_requests(request):
    data = json.loads(request.body)
    messages = data['messages']
    response = make_request(messages)

    print(response)
    return JsonResponse({'response': response.choices[0].message.content})



    