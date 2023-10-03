from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated

from my_cloud.serializers import CloudUserSerializer
from my_cloud_models.models import CloudUser


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_users(request):
    cloud_users = CloudUser.objects.all().order_by('-id')
    response = CloudUserSerializer(instance=cloud_users, many=True)
    return JsonResponse(response.data, safe=False)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def change_is_admin(request):
    cloud_user_id = request.data['user_id']
    cloud_user = CloudUser.objects.get(id=cloud_user_id)
    cloud_user.is_admin = request.data['is_admin']
    cloud_user.save()
    return HttpResponse(status=200)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request):
    try:
        cloud_user = CloudUser.objects.get(id=request.data['id'])
        internal_user = User.objects.get(username=cloud_user.login)
        internal_user.delete()
        cloud_user.delete()
        return HttpResponse(status=200)
    except CloudUser.DoesNotExist:
        return HttpResponseNotFound()
