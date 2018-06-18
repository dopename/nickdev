from .views import *

from django.urls import path

urlpatterns = [
	path('users/', UserAPIView.as_view(), name="user-api-view"),

	path('user_list/', UserListCreateView.as_view(), name="user-list-create-view"),
	path('user_list/<int:pk>/', UserListUpdateRetrieveView.as_view(), name="user-list-update-retrieve-view"),

	path('list_item/', ListItemCreateView.as_view(), name="list-item-creat-view"),
	path('list_item/<int:pk>/', ListItemUpdateRetrieveView.as_view(), name="list-item-update-retrieve-view"),
]