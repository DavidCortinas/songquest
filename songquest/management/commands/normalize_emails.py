from django.core.management.base import BaseCommand
from songquest.user.models import User

class Command(BaseCommand):
  help = 'normalize email addresses to lowercase'

  def handle(self, *args, **kwargs):
    users = User.objects.all()
    for user in users:
      normalized_email = user.email.lower().strip()
      if user.email != normalized_email:
        user.email = normalized_email
        user.save()
    self.stdout.write(self.style.SUCCESS('Successfully normalized email addresses'))