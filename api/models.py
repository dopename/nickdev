from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class CustomUser(models.Model):
	user = models.OnetoOneField(User, on_delete=models.CASCADE)