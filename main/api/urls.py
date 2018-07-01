from .views import *

from django.urls import path

urlpatterns = [
	path('users/', UserAPIView.as_view(), name="user-api-view"),

	path('destroy/user_list/<int:pk>/', UserListDestroyView.as_view(), name="user-list-destroy-view"),
	path('user_list/<int:pk>/', UserListUpdateRetrieveView.as_view(), name="user-list-update-retrieve-view"),
	path('user_list/', UserListCreateView.as_view(), name="user-list-create-view"),

	path('destroy/list_item/<int:pk>/', ListItemDestroyView.as_view(), name="list-item-destroy-view"),
	path('list_item/<int:pk>/', ListItemUpdateRetrieveView.as_view(), name="list-item-update-retrieve-view"),
	path('list_item/', ListItemCreateView.as_view(), name="list-item-create-view"),

	path('destroy/project/<int:pk>/', ProjectDestroyView.as_view(), name="project-destroy-view"),
	path('project/<int:pk>/', ProjectUpdateRetrieveView.as_view(), name="project-update-retrieve-view"),
	path('project/', ProjectCreateView.as_view(), name="project-create-view"),

	path('destroy/phase/<int:pk>/', PhaseDestroyView.as_view(), name="phase-destroy-view"),
	path('phase/<int:pk>/', PhaseUpdateRetrieveView.as_view(), name="phase-update-retrieve-view"),
	path('phase/', PhaseCreateView.as_view(), name="phase-create-view"),

	path('destroy/objective/<int:pk>/', ObjectivemDestroyView.as_view(), name="objective-destroy-view"),
	path('objective/<int:pk>/', ObjectiveUpdateRetrieveView.as_view(), name="objective-update-retrieve-view"),
	path('objective/', ObjectiveCreateView.as_view(), name="objective-create-view"),
]