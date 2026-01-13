from rest_framework import serializers
from .models import Startups, StartupRequest


# ------------------------------------
# STARTUP SERIALIZER
# ------------------------------------
class StartupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Startups
        fields = '__all__'


# ------------------------------------
# STARTUP REQUEST SERIALIZER
# ------------------------------------
class StartupRequestSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(
        source='startup.name',
        read_only=True
    )
    user_email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    class Meta:
        model = StartupRequest
        fields = '__all__'
