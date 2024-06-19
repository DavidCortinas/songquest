from django.core.management.base import BaseCommand
from django.core.cache import cache


class Command(BaseCommand):
    help = "Clears the cache"

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing cache...")
        cache.clear()
        self.stdout.write("Cache cleared.")
