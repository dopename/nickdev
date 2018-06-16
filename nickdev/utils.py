from main.api.serializers import UserLoginSerializer
from django.contrib.auth.models import User


def my_jwt_response_handler(token, user=None, request=None):
	current_user = User.objects.get(username=UserSerializer(user, context={'request': request}).data['username'])

	returnData = {
		'token':token,
		'user': {
			'username':False,
		}
	}

	if current_user:
		returnData['user']['username'] = current_user.username

	return returnData