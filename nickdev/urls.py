"""nickdev URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import views, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token
from main.api import views as APIVIEWS


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("main.api.urls")),
    path('', TemplateView.as_view(template_name="index.html")),
    path('token-auth/', obtain_jwt_token),
    path('token-verify/', verify_jwt_token),
    path('token-refresh/', refresh_jwt_token),
    #path('oauth2/', APIVIEWS.GoogleServices.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += [re_path('.*', TemplateView.as_view(template_name='index.html'))]