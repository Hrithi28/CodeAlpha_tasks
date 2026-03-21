from django.test import TestCase
from django.contrib.auth.models import User
from .models import Event, Registration
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
import datetime

class EventAPITestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client = APIClient()
        self.event = Event.objects.create(
            title='Test Event',
            description='This is a test event',
            date=timezone.now() + datetime.timedelta(days=1),
            location='Virtual',
            capacity=10
        )
        self.event2 = Event.objects.create(
             title='Small Event',
             description='Capacity 1',
             date=timezone.now() + datetime.timedelta(days=2),
             location='Virtual',
             capacity=1
        )
    
    def test_list_events(self):
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_registration_requires_auth(self):
        response = self.client.post(f'/api/events/{self.event.id}/register/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_successful_registration(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/events/{self.event.id}/register/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Registration.objects.filter(user=self.user, event=self.event).exists())
        
    def test_capacity_limit(self):
        # Register user 1
        self.client.force_authenticate(user=self.user)
        self.client.post(f'/api/events/{self.event2.id}/register/')
        
        # Try to register user 2
        user2 = User.objects.create_user(username='testuser2', password='password123')
        self.client.force_authenticate(user=user2)
        response = self.client.post(f'/api/events/{self.event2.id}/register/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get('error'), 'Event is full')
        
    def test_cancel_registration(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(f'/api/events/{self.event.id}/register/')
        reg = Registration.objects.get(user=self.user, event=self.event)
        
        response = self.client.delete(f'/api/registrations/{reg.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Registration.objects.filter(id=reg.id).exists())
