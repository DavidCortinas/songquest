from django.urls import re_path, path
from songquest.payments import views

urlpatterns = [
    re_path(r'^test-payment/$', views.test_payment),
]