import os
import requests


class ChatGPT:
    def __init__(self, api_key):
        self.api_key = api_key
        # Use chat/completions endpoint
        self.endpoint = "https://api.openai.com/v1/chat/completions"

    def generate_response(self, lyrics):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
        prompt = f'Find songs that contains this lyric, "{lyrics}"'
        data = {
            "model": "gpt-3.5-turbo",  # Specify your desired model
            "messages": [{"role": "system", "content": "You are a helpful assistant that finds songs by lyrics."}, {"role": "user", "content": prompt}],
            "max_tokens": 100,  # Adjust max_tokens as needed
        }
        response = requests.post(self.endpoint, headers=headers, json=data)
        print('ChatGPT response: ', response)
        return response.json()["choices"][0]["message"]["content"]
