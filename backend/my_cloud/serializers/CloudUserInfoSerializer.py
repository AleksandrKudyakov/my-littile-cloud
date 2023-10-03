from rest_framework import serializers

from my_cloud_models.models import CloudUser


class CloudUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudUser
        fields = ['id', 'name', 'login', 'email', 'is_admin']
