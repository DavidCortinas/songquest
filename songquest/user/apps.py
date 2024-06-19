from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'songquest.user'
    label = 'user'

    def ready(self):
        import songquest.user.signals
