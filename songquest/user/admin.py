from django.contrib import admin
from .models import Achievement, Badge, User, UserAdmin, Profile, ProfileAdmin

admin.site.register(User, UserAdmin)

admin.site.register(Badge)
admin.site.register(Achievement)
admin.site.register(Profile, ProfileAdmin)
