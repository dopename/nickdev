from .views import *

from django.urls import path

urlpatterns = [
	path('users/', UserAPIView.as_view(), name="user-api-view"),
]