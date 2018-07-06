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
			'user_list':False, 
			'projects':False,
			#'credential':False,
		}
	}

	if current_user:
		returnData['user']['pk'] = current_user.pk
		returnData['user']['username'] = current_user.user.username
		returnData['user']['user_list'] = [x.pk for x in current_user.user_list.all()]
		returnData['user']['projects'] = [y.pk for y in current_user.projects.all()]
		#returnData['user']['credential'] = current_user.credential

	return returnData