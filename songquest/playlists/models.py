from django.contrib.auth import get_user_model
from django.db import models

class Song(models.Model):
    name = models.CharField()
    artists = models.CharField()
    spotify_id = models.CharField()
    isrc = models.CharField()
    image = models.CharField()

    def __str__(self):
        return f'{self.name} - {self.artists}'

class Playlist(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    spotify_id = models.CharField(max_length=255)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('user', 'spotify_id',)
