from rest_framework import serializers

from my_cloud_models.models import CloudFile


class CloudFilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudFile
        fields = '__all__'
