import base64
import datetime
import os
from functools import wraps

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.http import FileResponse, HttpResponse, JsonResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated

from my_cloud.helpers import generate_secret_code
from my_cloud_files.serializers.CloudFilerSerializer import CloudFilerSerializer
from my_cloud_models.models import CloudFile, CloudUser


def check_is_owner(function):
    @wraps(function)
    def decorator(request, *args, **kwargs):
        user = CloudUser.objects.get(login=request.user.username)

        if user is not None:
            if user.is_admin:
                return function(request, *args, **kwargs)
            else:
                if kwargs['user_id'] == user.id:
                    return function(request, *args, **kwargs)
            return HttpResponse(status=403)

    return decorator


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@check_is_owner
def get_files_for_user(request, user_id):
    files = CloudFile.objects.filter(user_id=user_id).order_by('-upload_date')
    response = CloudFilerSerializer(instance=files, many=True)
    return JsonResponse(response.data, safe=False)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def upload(request):
    request_file = request.FILES['file']

    user = CloudUser.objects.get(id=request.data['userId'])

    upload_file_name = str(request_file)

    is_file_exists = default_storage.exists(
        os.path.join(user.storage_path, str(request_file))
    )

    if is_file_exists:
        file_name_arr = request_file.name.split('.')
        new_file_hash = generate_secret_code(6)
        upload_file_name = '{0}_copy_{1}.{2}'.format(
            file_name_arr[0], new_file_hash, file_name_arr[1]
        )

    default_storage.save(
        os.path.join(user.storage_path, upload_file_name),
        ContentFile(request_file.read()),
    )

    cloud_file = CloudFile()
    cloud_file.name = upload_file_name
    cloud_file.size = request_file.size
    cloud_file.comment = request.data['fileComment']
    cloud_file.upload_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cloud_file.download_link = generate_secret_code(10)
    cloud_file.storage_path = os.path.join(user.storage_path, upload_file_name)
    cloud_file.user = user

    cloud_file.save()

    return HttpResponse(status=200)


def download_internal(user_file):
    response = FileResponse(default_storage.open(user_file.storage_path))
    response.headers['FileName'] = base64.b64encode(bytes(user_file.name, 'utf-8'))

    user_file.download_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user_file.save()

    return response


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def download(request, file_id):
    user_file = CloudFile.objects.get(id=file_id)
    response = download_internal(user_file)
    return response


@api_view(['GET'])
@permission_classes((AllowAny,))
def download_external(request, code):
    user_file = CloudFile.objects.get(download_link=code)
    response = download_internal(user_file)
    return response


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete(request):
    user_file = CloudFile.objects.get(id=request.data['file_id'])
    default_storage.delete(user_file.storage_path)
    user_file.delete()
    return HttpResponse(status=200)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def edit(request):
    cloud_file = CloudFile.objects.get(id=request.data['id'])

    if cloud_file.name != request.data['name']:
        initial_path = os.path.join(settings.MEDIA_ROOT, cloud_file.storage_path)
        new_path = os.path.join(
            settings.MEDIA_ROOT,
            cloud_file.storage_path.replace(cloud_file.name, request.data['name']),
        )
        os.rename(initial_path, new_path)

        cloud_file.storage_path = cloud_file.storage_path.replace(
            cloud_file.name, request.data['name']
        )
        cloud_file.name = request.data['name']

    if cloud_file.comment != request.data['comment']:
        cloud_file.comment = request.data['comment']

    cloud_file.save()

    return HttpResponse(status=200)
