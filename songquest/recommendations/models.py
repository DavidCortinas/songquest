from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

def validate_limit(value):
    if value < 1 or value > 100:
        raise ValidationError("Limit must be between 1 and 100")

def validate_range_0_to_1(value):
    if value < 0 or value > 1:
        raise ValidationError("Value must be between 0 and 1")

def validate_range_0_to_11(value):
    if value < 0 or value > 11:
        raise ValidationError("Value must be between 0 and 11")
    
def validate_range_0_to_100(value):
    if value < 0 or value > 100:
        raise ValidationError("Value must be between 0 and 100")

class RecommendationRequest(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    limit = models.IntegerField(default=20, null=True, blank=True, validators=[validate_limit])
    market = models.CharField(max_length=2, null=True, blank=True)
    seed_artists = models.CharField(max_length=255, null=True, blank=True)
    seed_genres = models.CharField(max_length=255, null=True, blank=True)
    seed_tracks = models.CharField(max_length=255, null=True, blank=True)
    min_acousticness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_acousticness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_acousticness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    min_danceability = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_danceability = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_danceability = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    min_duration_ms = models.IntegerField(null=True, blank=True)
    max_duration_ms = models.IntegerField(null=True, blank=True)
    target_duration_ms = models.IntegerField(null=True, blank=True)
    min_energy = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_energy = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_energy = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    min_instrumentalness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_instrumentalness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_instrumentalness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    min_key = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_11])
    max_key = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_11])
    target_key = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_11])
    min_liveness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_liveness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_liveness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    min_loudness = models.FloatField(null=True, blank=True)
    max_loudness = models.FloatField(null=True, blank=True)
    target_loudness = models.FloatField(null=True, blank=True)
    min_mode = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_mode = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_mode = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_1])
    min_popularity = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_100])
    max_popularity = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_100])
    target_popularity = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_100])
    min_speechiness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_speechiness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_speechiness = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    min_tempo = models.FloatField(null=True, blank=True)
    max_tempo = models.FloatField(null=True, blank=True)
    target_tempo = models.FloatField(null=True, blank=True)
    min_time_signature = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_11])
    max_time_signature = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_11])
    target_time_signature = models.IntegerField(null=True, blank=True, validators=[validate_range_0_to_11])
    min_valence = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    max_valence = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])
    target_valence = models.FloatField(null=True, blank=True, validators=[validate_range_0_to_1])

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "limit": self.limit,
            "market": self.market,
            "seed_artists": self.seed_artists,
            "seed_genres": self.seed_genres,
            "seed_tracks": self.seed_tracks,
            "min_acousticness": self.min_acousticness,
            "max_acousticness": self.max_acousticness,
            "target_acousticness": self.target_acousticness,
            "min_danceability": self.min_danceability,
            "max_danceability": self.max_danceability,
            "target_danceability": self.target_danceability,
            "min_duration_ms": self.min_duration_ms,
            "max_duration_ms": self.max_duration_ms,
            "target_duration_ms": self.target_duration_ms,
            "min_energy": self.min_energy,
            "max_energy": self.max_energy,
            "target_energy": self.target_energy,
            "min_instrumentalness": self.min_instrumentalness,
            "max_instrumentalness": self.max_instrumentalness,
            "target_instrumentalness": self.target_instrumentalness,
            "min_key": self.min_key,
            "max_key": self.max_key,
            "target_key": self.target_key,
            "min_liveness": self.min_liveness,
            "max_liveness": self.max_liveness,
            "target_liveness": self.target_liveness,
            "min_loudness": self.min_loudness,
            "max_loudness": self.max_loudness,
            "target_loudness": self.target_loudness,
            "min_mode": self.min_mode,
            "max_mode": self.max_mode,
            "target_mode": self.target_mode,
            "min_popularity": self.min_popularity,
            "max_popularity": self.max_popularity,
            "target_popularity": self.target_popularity,
            "min_speechiness": self.min_speechiness,
            "max_speechiness": self.max_speechiness,
            "target_speechiness": self.target_speechiness,
            "min_tempo": self.min_tempo,
            "max_tempo": self.max_tempo,
            "target_tempo": self.target_tempo,
            "min_time_signature": self.min_time_signature,
            "max_time_signature": self.max_time_signature,
            "target_time_signature": self.target_time_signature,
            "min_valence": self.min_valence,
            "max_valence": self.max_valence,
            "target_valence": self.target_valence,
        }
