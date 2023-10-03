from rest_framework import serializers


class CloudUserLoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()
