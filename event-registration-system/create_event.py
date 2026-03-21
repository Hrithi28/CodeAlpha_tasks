from events.models import Event
from django.utils import timezone
import datetime

def run():
    if not Event.objects.filter(title='Premium Tech Conference 2026').exists():
        e = Event.objects.create(
            title='Premium Tech Conference 2026',
            description='Join us for an exclusive tech gathering where we explore the bleeding edge of AI, full-stack frameworks, and design systems.\n\nEnjoy curated keynotes, networking sessions, and interactive workshops guided by industry leaders.',
            date=timezone.now() + datetime.timedelta(days=14),
            location='The Innovation Center, New York',
            capacity=150
        )
        print(f"Created event: {e}")
    else:
        print("Event already exists.")

run()
