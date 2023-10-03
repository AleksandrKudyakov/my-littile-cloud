from django.contrib.auth import authenticate
from django.contrib.auth import login as internal_login
from django.contrib.auth import logout as internal_logout
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseServerError, JsonResponse
from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from rest_framework.permissions import AllowAny, IsAuthenticated

from my_cloud.serializers import (CloudUserInfoSerializer,
                                  CloudUserLoginSerializer,
                                  CloudUserSerializer)
from my_cloud_models.models import CloudUser


def index(request):
    return render(request, 'front/index.html')


@api_view(['POST'])
@permission_classes((AllowAny,))
def register(request):
    serializer = CloudUserSerializer(data=request.data)

    if not serializer.is_valid():
        return HttpResponseServerError(content=serializer.errors)

    cloud_user = serializer.save()

    internal_user = authenticate(username=serializer.validated_data['login'], password=serializer.validated_data['password'])
    internal_login(request, internal_user)

    return HttpResponse(status=200, content=cloud_user.id)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes((AllowAny,))
def login(request):
    serializer = CloudUserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return HttpResponseServerError(content=serializer.errors)

    cloud_user = CloudUser.objects.get(login=serializer.validated_data['login'])

    if cloud_user is None:
        return HttpResponse(status=404)

    if cloud_user.is_admin is True:
        internal_user = authenticate_as_admin(serializer.validated_data['login'])
        internal_login(request, internal_user)
    else:
        internal_user = authenticate(username=serializer.validated_data['login'], password=serializer.validated_data['password'])

    if internal_user is not None:
        internal_login(request, internal_user)
        return HttpResponse(status=200, content=cloud_user.id)
    else:
        return HttpResponse(status=403)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
def logout(request):
    internal_logout(request)
    return HttpResponse(status=200)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    request_user = request.user
    user = CloudUser.objects.get(login=request_user.username)
    response = CloudUserInfoSerializer(instance=user)
    return JsonResponse(response.data, safe=False)


def authenticate_as_admin(login):
    admin = CloudUser.objects.get(login=login)
    internal_admin_user = authenticate(username=admin.login, password=admin.password)

    if internal_admin_user is None:
        User.objects.create_user(admin.login, admin.email, admin.password)
        internal_admin_user = authenticate(username=admin.login, password=admin.password)

    return internal_admin_user
