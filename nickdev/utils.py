from main.api.serializers import UserLoginSerializer
from django.contrib.auth.models import User
from main.models import CustomUser, UserList, ListItem


def my_jwt_response_handler(token, user=None, request=None):
	current_user = CustomUser.objects.get(user__username=UserLoginSerializer(user, context={'request': request}).data['username'])

	returnData = {
		'token':token,
		'user': {
			'pk':False,
			'username':False,
			'user_list':False
		}
	}

	if current_user:
		returnData['user']['pk'] = current_user.pk
		returnData['user']['username'] = current_user.username
		returnData['user']['user_list'] = current_user.user_list_set.all()

	return returnData