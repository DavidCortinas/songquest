from songquest.user.models import Genre, User
from rest_framework import serializers

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']
        

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    preferred_genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'spotify_connected', 'tokens', 'karma', 'profile_image', 'display_name',
            'birthday', 'profession', 'user_type', 'preferred_genres'
        ]

    def get_profile_image(self, obj):
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            return self.context['request'].build_absolute_uri(obj.profile_image.url)
        else:
            return None
