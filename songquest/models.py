from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from django.urls import reverse
from django.conf import settings
# from audiofield.fields import AudioField
import os.path


class Song(models.Model):
    title = models.TextField()
    artist = models.TextField()
    image = models.ImageField()
    audio_file = models.FileField(blank=True, null=True)
    audio_link = models.CharField(max_length=200, blank=True, null=True)
    duration = models.CharField(max_length=20)
    paginate_by = 2

    # Add the audio field to your model
    # audio_file = AudioField(upload_to='your/upload/dir', blank=True,
    #                         ext_whitelist=(".mp3", ".wav", ".ogg"),
    #                         help_text=("Allowed type - .mp3, .wav, .ogg"))

    # Add this method to your model
    # def audio_file_player(self):
    #     """audio player tag for admin"""
    #     if self.audio_file:
    #         file_url = settings.MEDIA_URL + str(self.audio_file)
    #         player_string = '<audio src="%s" controls>Your browser does not support the audio element.</audio>' % (
    #             file_url)
    #         return player_string

    # audio_file_player.allow_tags = True
    # audio_file_player.short_description = ('Audio file player')

    def __str__(self):
        return self.title
