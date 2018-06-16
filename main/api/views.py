from rest_framework import generics, mixins, status, permissions
from django.contrib.auth.models import User
from main.models import CustomUser
from .serializers  import *
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.authentication import get_authorization_header, BaseAuthentication
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER

class UserAPIView(APIView):
	serializer = UserSerializer
