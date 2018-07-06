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

import datetime
import dateutil.relativedelta

from google_auth_oauthlib.flow import Flow
from oauth2client.contrib.django_util.storage import DjangoORMStorage
from google.auth.transport.requests import AuthorizedSession
import google.auth.transport.requests
from ..nickdev import settings


jwt_decode_handler = api_settings.JWT_DECODE_HANDLER


class BaseGoogle(object):
	FLOW = Flow.from_client_secrets_file(
		settings.GOOGLE_OAUTH2_CLIENT_SECRETS_JSON,
		scopes=[
			'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/contacts',
			 'https://mail.google.com/'
			 ],
		redirect_uri='https://www.nicksdevenv.com/oauth2')

	def create_google_url(self):
		authorize_url, _ = self.FLOW.authorization_url(prompt='consent')
		return HttpResponseRedirect(authorize_url)
		
	def create_credential(self, access_token):
		pass

	def retrieve_credential(self, user_id, authorize=False, scope=[]):
		storage = DjangoORMStorage(Staff, 'id', user_id.staff.id, 'credential')
		credential = storage.get()
		credential = self._check_credential(credential, scope)
		if authorize:
			credential = self._authorize_credential(credential)
		return credential
		
	def auth(self, credential):
		return self._authorize_credential(credential)

	def _refresh_credential(self, credential):
		request = google.auth.transport.requests.Request()
		credential.refresh(request)
		return credential

	def _authorize_credential(self, credential):
		http = AuthorizedSession(credential)
		return http

	def _check_credential(self, credential, scope):
		if credential is not None and credential.has_scopes(scope):
			if credential.expired or not credential.valid:
				credential = self._refresh_credential(credential)
			return credential
		else:
			return self.create_google_url()


class GoogleServices(BaseGoogle, LoginRequiredMixin):
	login_url = '/login/'
	
	#https://www.googleapis.com/auth/drive
	def get(self, request, *args, **kwargs):
		credential = self.retrieve_credential(request.user, authorize=False)
		if 'oauth2' in request.path:
			credential = self.FLOW.fetch_token(code=request.GET['code'])
			credential = self.FLOW.credentials
			storage = DjangoORMStorage(Staff, 'id', request.user.staff.id, 'credential')
			storage.put(credential)
		elif credential is None:
			return self.create_google_url()

	def post(self, request, *args, **kwargs):
		pass


def clean_datetime(dt):
	if dt:
		clean = dt[:len(data)-6]
		formatted_dt = datetime.datetime.strptime(clean, '%Y-%m-%dT%H:%M:%S')
		return formatted_dt
	else:
		return datetime.datetime.strptime('2025-01-01T00:00:00', '%Y-%m-%dT%H:%M:%S')


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

	def get_queryset(self):
		qs = Phase.objects.all()
		query = self.request.GET.get('q')
		if query is not None:
			qs = qs.filter(pk=query)
		return qs


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


