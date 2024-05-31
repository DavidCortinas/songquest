from django.urls import path, re_path
from .views import index

urlpatterns = [
    path("", index, name="index"),
    re_path(r"^.*$", index, name="catch-all"),  # Catch-all pattern for frontend routes
]
