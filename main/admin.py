from django.contrib import admin
from main.models import CustomUser, UserList, ListItem, Project, Phase, Objective

admin.site.register(CustomUser)
admin.site.register(UserList)
admin.site.register(ListItem)
admin.site.register(Project)
admin.site.register(Phase)
admin.site.register(Objective)