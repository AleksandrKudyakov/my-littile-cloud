from django.urls import include, path

from my_cloud_admin import api

admin_patterns = [
    path('users', api.get_users),
    path('change-admin', api.change_is_admin),
    path('delete-user', api.delete_user),
]

urlpatterns = [
    path('admin/', include(admin_patterns)),
]
