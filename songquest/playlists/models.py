from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

class Playlist(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    spotify_id = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('user', 'spotify_id',)
