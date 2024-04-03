from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.core.exceptions import MultipleObjectsReturned
from django.db.models import Q

class EmailOrUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        # Adjusting the logic to prioritize email authentication.
        email = kwargs.get('email', username)
        
        try:
            # Trying to fetch the user by email.
            user = UserModel.objects.get(email__iexact=email)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            # If no user is found with the email, try with username if provided.
            if username:
                try:
                    user = UserModel.objects.get(username__iexact=username)
                    if user.check_password(password):
                        return user
                except UserModel.DoesNotExist:
                    return None
                except MultipleObjectsReturned:
                    return UserModel.objects.filter(username=username).order_by('id').first()
            return None
        except MultipleObjectsReturned:
            # Handling the case where multiple users have the same email.
            # It's recommended to enforce email uniqueness to avoid this scenario.
            return UserModel.objects.filter(email=email).order_by('id').first()

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
