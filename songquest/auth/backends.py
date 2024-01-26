from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

class EmailOrUsernameBackend(BaseBackend):
    def authenticate(self, request, username=None, email=None, password=None):
        print('auth')
        print(request)
        print(username)
        print(email)
        print('pass: ', password)
        UserModel = get_user_model()
        print(dir(UserModel))
        users = UserModel.objects.all()
        print(users.values())
        try:
            if email:
                user = UserModel.objects.get(email=email)
                print('e', user)
            else:
                user = UserModel.objects.get(username=username)
                print('u', user)
                print(user.check_password(password))
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            raise ValidationError("No active account found with the given credentials")

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
