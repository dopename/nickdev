from django.db import models
from django.contrib.auth.models import User
import os

from rest_framework.reverse import reverse as api_reverse

class CUstomUser(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
# Create your models here.
