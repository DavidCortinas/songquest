from django.contrib.auth import get_user_model
from django.db import models

class Song(models.Model):
    name = models.CharField()
    artists = models.JSONField()
    spotify_id = models.CharField()
    isrc = models.CharField()
    image = models.CharField()

    def __str__(self):
        return f"{self.name} - {', '.join(artist['name'] for artist in self.artists)}"


class Playlist(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    spotify_id = models.CharField(max_length=255)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song)
    snapshot_id = models.CharField()

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('user', 'spotify_id',)


class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    added_on = models.DateTimeField(auto_now_add=True)
    removed_on = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.song.name} in {self.playlist.name}'
    
    class Meta:
        ordering = ['order']
        unique_together = ['playlist', 'song']

