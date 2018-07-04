from rest_framework import generics, mixins, status, permissions
from django.contrib.auth.models import User
from main.models import CustomUser, UserList, ListItem, Project, Phase, Objective
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

class UserAPIView(generics.ListAPIView):
	serializer_class = UserSerializer

	def get_queryset(self):
		return CustomUser.objects.all()

class UserListUpdateRetrieveView(generics.RetrieveUpdateAPIView):
	lookup_field = 'pk'
	serializer_class = UserListSerializer

	def get_queryset(self):
		qs = UserList.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs


class UserListCreateView(generics.CreateAPIView):
	lookup_field = 'pk'
	serializer_class = UserListCreateSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = UserList.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)

class UserListDestroyView(generics.DestroyAPIView):
	lookup_field = 'pk'
	serializer_class = UserListDestroySerializer

	def get_queryset(self):
		qs = UserList.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs


class ListItemUpdateRetrieveView(generics.RetrieveUpdateAPIView):
	lookup_field = 'pk'
	serializer_class = ListItemSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = ListItem.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs

class ListItemDestroyView(generics.DestroyAPIView):
	lookup_field = 'pk'
	serializer_class = ListItemDestroySerializer

	def get_queryset(self):
		qs = ListItem.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs


class ListItemCreateView(generics.CreateAPIView):
	lookup_field = 'pk'
	serializer_class = ListItemSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = ListItem.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)

#####################################################################

class ProjectUpdateRetrieveView(generics.RetrieveUpdateAPIView):
	lookup_field = 'pk'
	serializer_class = ProjectSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = Project.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs

class ProjectDestroyView(generics.DestroyAPIView):
	lookup_field = 'pk'
	serializer_class = ProjectDestroySerializer

	def get_queryset(self):
		qs = Project.objects.all()
		return qs


class ProjectCreateView(generics.CreateAPIView):
	lookup_field = 'pk'
	serializer_class = ProjectSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = Project.objects.all()
		return qs

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)

######################################################################

class PhaseUpdateRetrieveView(generics.RetrieveUpdateAPIView):
	lookup_field = 'pk'
	serializer_class = PhaseSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = Phase.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs

class PhaseDestroyView(generics.DestroyAPIView):
	lookup_field = 'pk'
	serializer_class = PhaseDestroySerializer

	def get_queryset(self):
		qs = Phase.objects.all()
		return qs

class PhaseUpdateView(generics.UpdateAPIView):
	lookup_field = "pk"
	serializer_class = PhaseUpdateSerializer


class PhaseCreateView(generics.CreateAPIView):
	lookup_field = 'pk'
	serializer_class = PhaseSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = Phase.objects.all()
		return qs

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)

####################################################################

class ObjectiveUpdateRetrieveView(generics.RetrieveUpdateAPIView):
	lookup_field = 'pk'
	serializer_class = ObjectiveSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = Objective.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs

class ObjectiveDestroyView(generics.DestroyAPIView):
	lookup_field = 'pk'
	serializer_class = ObjectiveDestroySerializer

	def get_queryset(self):
		qs = Objective.objects.all()
		return qs


class ObjectiveCreateView(generics.CreateAPIView):
	lookup_field = 'pk'
	serializer_class = ObjectiveSerializer
	# queryset = Solution.objects.all()

	def get_queryset(self):
		qs = Objective.objects.all()
		return qs

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)


