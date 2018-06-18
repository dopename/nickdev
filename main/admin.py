from django.contrib import admin
from main.models import CustomUser, UserList, ListItem

admin.site.register(CustomUser)
admin.site.register(UserList)
admin.site.register(ListItem)