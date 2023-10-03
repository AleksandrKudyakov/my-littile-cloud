from django.contrib.auth.models import User
from django.db.models import Count, Sum
from rest_framework import serializers

from my_cloud.helpers import generate_secret_code
from my_cloud_models.models import CloudFile, CloudUser


class CloudUserSerializer(serializers.ModelSerializer):
    files_info = serializers.SerializerMethodField("get_files_info")

    class Meta:
        model = CloudUser
        fields = "__all__"

    def create(self, validated_data):
        cloud_user = CloudUser.objects.create(
            **validated_data, storage_path=generate_secret_code(10)
        )

        User.objects.create_user(
            validated_data["login"], validated_data["email"], validated_data["password"]
        )

        return cloud_user

    @staticmethod
    def get_files_info(user):
        files_info = CloudFile.objects.filter(user_id=user.id).aggregate(
            files_count=Count("id"), files_size=Sum("size")
        )
        return files_info
