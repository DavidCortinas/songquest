from songquest.user.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'spotify_connected', 'tokens', 'xp', 'profile_image', 'display_name', 'birthday', 'profession', 'user_type']

    def get_profile_image(self, obj):
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            return self.context['request'].build_absolute_uri(obj.profile_image.url)
        else:
            return None
