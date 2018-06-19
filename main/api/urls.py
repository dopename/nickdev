from .views import *

from django.urls import path

urlpatterns = [
	path('users/', UserAPIView.as_view(), name="user-api-view"),

	path('destroy/user_list/<int:pk>/', UserListDestroyView.as_view(), name="user-list-destroy-view"),
	path('user_list/<int:pk>/', UserListUpdateRetrieveView.as_view(), name="user-list-update-retrieve-view"),
	path('user_list/', UserListCreateView.as_view(), name="user-list-create-view"),

	path('destroy/list_item/<int:pk>/', ListItemDestroyView.as_view(), name="list-item-destroy-view"),
	path('list_item/<int:pk>/', ListItemUpdateRetrieveView.as_view(), name="list-item-update-retrieve-view"),
	path('list_item/', ListItemCreateView.as_view(), name="list-item-creat-view"),
]