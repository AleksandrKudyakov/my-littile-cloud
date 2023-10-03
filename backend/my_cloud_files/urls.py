from django.urls import include, path

from my_cloud_files import api

files_patterns = [
    path('user/<int:user_id>', api.get_files_for_user),
    path('upload', api.upload),
    path('delete', api.delete),
    path('edit', api.edit),
    path('download/<int:file_id>', api.download),
    path('download/external/<str:code>', api.download_external),
]

urlpatterns = [
    path('files/', include(files_patterns)),
]
