from django.db import models


class CloudUser(models.Model):
    id = models.AutoField(primary_key=True, db_index=True)
    name = models.CharField(max_length=100)
    login = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    is_admin = models.BooleanField(default=False)
    storage_path = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = 'CloudUser'


class CloudFile(models.Model):
    id = models.AutoField(primary_key=True, db_index=True)
    name = models.CharField(max_length=100)
    comment = models.CharField(max_length=300, null=True)
    size = models.BigIntegerField()
    upload_date = models.DateTimeField()
    download_date = models.DateTimeField(null=True)
    download_link = models.CharField(max_length=10)
    storage_path = models.CharField(max_length=100)
    user = models.ForeignKey(CloudUser, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'CloudFile'
