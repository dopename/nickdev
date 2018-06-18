from django.db import models
from django.contrib.auth.models import User
import os

from rest_framework.reverse import reverse as api_reverse

class CustomUser(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)

	def __str__(self):
		return self.user.username

class UserList(models.Model):
	user_list_id = models.AutoField(db_column='id')
	custom_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user_list")
	list_title = models.CharField(max_length=64)

	def __str__(self):
		return str(self.user_list_id)


class ListItem(models.Model):
	list_item_id = models.AutoField(db_column='id')
	user_list = models.ForeignKey(UserList, on_delete=models.CASCADE, related_name="list_item")
	item_title = models.CharField(max_length=64)
	description = models.TextField()

	def __str__(self):
		return str(self.list_item_id)