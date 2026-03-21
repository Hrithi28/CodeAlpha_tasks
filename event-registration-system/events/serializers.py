from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Registration

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    event_details = EventSerializer(source='event', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Registration
        fields = ('id', 'user', 'event', 'registered_at', 'event_details', 'username')
        read_only_fields = ('user', 'registered_at', 'event_details', 'username')
