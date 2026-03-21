from django.urls import path
from .views import (
    RegisterUserView, LoginUserView, EventListView, EventDetailView,
    RegisterForEventView, UserRegistrationListView, CancelRegistrationView
)

urlpatterns = [
    path('auth/register/', RegisterUserView.as_view(), name='auth-register'),
    path('auth/login/', LoginUserView.as_view(), name='auth-login'),
    path('events/', EventListView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/<int:pk>/register/', RegisterForEventView.as_view(), name='event-register'),
    path('registrations/', UserRegistrationListView.as_view(), name='registration-list'),
    path('registrations/<int:pk>/', CancelRegistrationView.as_view(), name='registration-cancel'),
]
