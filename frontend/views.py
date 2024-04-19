from django.shortcuts import render
from django.conf import settings
import os

def index(request):
    index_html_path = os.path.join(settings.BASE_DIR, 'frontend', 'public', 'index.html')
    response = render(request, index_html_path)
    response['Content-Security-Policy'] = "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self';"
    return response
