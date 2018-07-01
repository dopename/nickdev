from django.db import models
from django.contrib.auth.models import User
import os

from rest_framework.reverse import reverse as api_reverse

class CustomUser(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)

	def __str__(self):
		return self.user.username

class UserList(models.Model):
	user_list_id = models.AutoField(primary_key=True, db_column="id")
	custom_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user_list")
	list_title = models.CharField(max_length=64)

	def __str__(self):
		return str(self.user_list_id)


class ListItem(models.Model):
	list_item_id = models.AutoField(primary_key=True, db_column="id")
	user_list = models.ForeignKey(UserList, on_delete=models.CASCADE, related_name="list_items")
	item_title = models.CharField(max_length=64)
	description = models.TextField()

	def __str__(self):
		return str(self.list_item_id)


class Project(models.Model):
	project_id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=64)
	members = models.ManyToManyField(CustomUser, related_name="projects")


class Phase(models.Model):
	phase_id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=64)
	order = models.IntegerField()
	project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="phases")

class Objective(models.Model):
	objective_id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=64)
	order = models.IntegerField()
	description = models.TextField()
	notes = models.TextField()
	priority = models.IntegerField(blank=True, null=True)
	completed = models.BooleanField(default=False)
	file = models.FileField(blank=True, null=True)
	phase = models.ForeignKey(Phase, on_delete=models.CASCADE, related_name="objectives")


