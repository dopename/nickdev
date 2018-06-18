from rest_framework import serializers
from main.models import CustomUser, UserList, ListItem
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username', read_only=True)

	class Meta:
		model = CustomUser
		fields = [
			'pk',
			'username'
		]


class UserLoginSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ['username', 'pk']


class UserListCreateSerializer(serializers.ModelSerializer):
	list_items = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

	class Meta:
		model = UserList
		fields = [
			"custom_user",
			"list_title",
		]


class UserListSerializer(serializers.ModelSerializer):
	list_items = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

	class Meta:
		model = UserList
		fields = [
			"pk",
			"list_items",
			"list_title",
		]

class ListItemSerializer(serializers.ModelSerializer):

	class Meta:
		model = ListItem
		fields = [
			"user_list",
			"item_title",
			"description"
		]


class ListItemCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = ListItem
		fields = [
			"title",
			"description"
		]