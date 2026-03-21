from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import Event, Registration
from .serializers import EventSerializer, RegistrationSerializer, UserSerializer

class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class LoginUserView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id, 'username': user.username})
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class EventListView(generics.ListAPIView):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

class RegisterForEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        if event.registrations.count() >= event.capacity:
            return Response({'error': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Registration.objects.filter(user=request.user, event=event).exists():
            return Response({'error': 'Already registered'}, status=status.HTTP_400_BAD_REQUEST)
            
        registration = Registration.objects.create(user=request.user, event=event)
        return Response({'message': 'Successfully registered', 'id': registration.id}, status=status.HTTP_201_CREATED)

class UserRegistrationListView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(user=self.request.user).order_by('-registered_at')

class CancelRegistrationView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Registration.objects.filter(user=self.request.user)
