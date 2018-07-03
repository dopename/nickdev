from rest_framework import serializers
from main.models import CustomUser, UserList, ListItem, Project, Phase, Objective
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

class UserListDestroySerializer(serializers.ModelSerializer):

	class Meta:
		model = UserList
		fields = [
			"pk"
		]

class ListItemSerializer(serializers.ModelSerializer):

	class Meta:
		model = ListItem
		fields = [
			"pk",
			"user_list",
			"item_title",
			"description"
		]


class ListItemCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = ListItem
		fields = [
			"item_title",
			"description"
		]

class ListItemDestroySerializer(serializers.ModelSerializer):
	model = ListItem
	fields = [
		"pk"
	]

#Serializers for the PROJECT MODEL

class ProjectSerializer(serializers.ModelSerializer):
	phases = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

	class Meta:
		model = Project
		fields = [
			"pk",
			"title",
			"members",
			"phases"
		]


class ProjectCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = Project
		fields = [
			"title",
			"members"
		]

class ProjectDestroySerializer(serializers.ModelSerializer):
	model = Project
	fields = [
		"pk"
	]


################################

class PhaseSerializer(serializers.ModelSerializer):
	objectives = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

	class Meta:
		model = Phase
		fields = [
			"pk",
			"title",
			"order",
			"project",
			"objectives"
		]


class PhaseCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = Phase
		fields = [
			"title",
			"order",
			"project"
		]

class PhaseDestroySerializer(serializers.ModelSerializer):
	model = Phase
	fields = [
		"pk"
	]

########################################


class ObjectiveSerializer(serializers.ModelSerializer):

	class Meta:
		model = Objective
		fields = [
			"pk",
			"title",
			"order",
			"description",
			"notes",
			"priority",
			"completed",
			"phase",
			"due_date"
		]


class ObjectiveCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = Objective
		fields = [
			"title",
			"order",
			"description",
			"notes",
			"priority",
			"phase",
		]

class ObjectiveDestroySerializer(serializers.ModelSerializer):
	model = Objective
	fields = [
		"pk"
	]
