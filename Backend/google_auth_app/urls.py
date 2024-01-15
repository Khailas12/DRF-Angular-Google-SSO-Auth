from django.urls import path
from . import views


urlpatterns = [
    path('google_token/', views.GoogleView.as_view(), name='google_token')
]