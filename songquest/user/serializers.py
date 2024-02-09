from songquest.user.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'spotify_connected',
                  'is_active', 'created_at', 'updated_at']
        read_onlyFields = ['isActive', 'created_at', 'updated_at']
