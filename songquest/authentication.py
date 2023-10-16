from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class SpotifyBackend(ModelBackend):
    def authenticate(self, request, **kwargs):
        if 'email' in kwargs:
            # Get the email from the keyword arguments
            email = kwargs['email']

            try:
                # Query the database for a user with the given email
                user = User.objects.get(email=email)
                print('user: ', user)
                print('USERS: ', User.objects.values())
                return user
            except User.DoesNotExist:
                pass
        return None
