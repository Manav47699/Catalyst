from rest_framework import serializers
from .models import Mentor, MentorCertificate, Appointment

# ------------------------------------
# MENTOR SERIALIZER
# ------------------------------------
class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = '__all__'


# ------------------------------------
# MENTOR CERTIFICATE SERIALIZER
# ------------------------------------
class MentorCertificateSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)

    class Meta:
        model = MentorCertificate
        fields = '__all__'


# ------------------------------------
# APPOINTMENT SERIALIZER
# ------------------------------------
class AppointmentSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
