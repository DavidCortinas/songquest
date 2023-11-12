from django.db import models
from django.conf import settings
# from audiofield.fields import AudioField
import os


class Song(models.Model):
    title = models.TextField()
    artist = models.TextField()
    # image = models.ImageField()
    audio_file = models.FileField(upload_to='songs/', blank=True, null=True)
    audio_link = models.CharField(max_length=200, blank=True, null=True)
    duration = models.CharField(max_length=20, blank=True, null=True)
    to_license = models.BooleanField(default=False)
    to_detect = models.BooleanField(null=True)

    @property
    def audio_file_url(self):
        if self.audio_file:
            return self.audio_file.url
        return None

    # # Add the audio field to your model
    # audio_file = AudioField(upload_to='songs', blank=True,
    #                         ext_whitelist=(".mp3", ".wav", ".ogg"),
    #                         help_text=("Allowed type - .mp3, .wav, .ogg"))

    # # Add this method to your model
    # def audio_file_player(self):
    #     """audio player tag for admin"""
    #     if self.audio_file:
    #         file_url = settings.MEDIA_URL + str(self.audio_file)
    #         player_string = '<ul class="playlist"><li style="width:250px;">\
    #         <a href="%s">%s</a></li></ul>' % (file_url, os.path.basename(self.audio_file.name))
    #         return player_string

    # audio_file_player.allow_tags = True
    # audio_file_player.short_description = ('Audio file player')

    def __str__(self):
        return self.title
