from django.db import models
from django.contrib.auth.models import User
import os

from rest_framework.reverse import reverse as api_reverse

class CustomUser(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)

	def __str__(self):
		return self.user.username

class UserList(models.Model):
	custom_user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

	def __str__(self):
		return str(self.user_list_id)


class ListItem(models.Model):
	user_list = models.ForeignKey(UserList, on_delete=models.CASCADE, related_name="list_item")
	title = models.CharField(max_length=64)
	description = models.TextField()

	def __str__(self):
		return str(self.list_item_id)