import os
import json
import boto3
import botocore


class S3Store:
    def __init__(self, *,
                 host: str = None,
                 key_id: str = None,
                 secret_key: str = None,
                 bucket: str = None,
                 region: str = None,
                 prefix: str = ""):
        super().__init__()
        self.host = host
        self.key_id = key_id
        self.secret_key = secret_key
        self.bucket = bucket
        self.region = region
        self.prefix = prefix

        session = boto3.session.Session(aws_access_key_id=self.key_id,
                                        aws_secret_access_key=self.secret_key,
                                        region_name=self.region)

        self._s3 = session.resource(
            's3',
            config=botocore.client.Config(signature_version='s3v4'),
            endpoint_url=self.host
        )

    def get_json(self, object_key: str) -> dict:
        object_body = self._s3.Object(self.bucket, os.path.join(self.prefix, object_key)).get()['Body'].read()
        return json.loads(object_body.decode())

    def get_file(self, object_key: str) -> bytes:
        return self._s3.Object(self.bucket, os.path.join(self.prefix, object_key)).get()['Body'].read()

    def download_file(self, s3_source_key, dest_path):
        full_key = os.path.join(self.prefix, s3_source_key)
        bucket = self._s3.Bucket(self.bucket)
        bucket.download_file(full_key, dest_path)

    def download_directory(self, s3_source_prefix, local_dest_dir):
        full_prefix = os.path.join(self.prefix, s3_source_prefix)
        bucket = self._s3.Bucket(self.bucket)

        for obj in bucket.objects.filter(Prefix=full_prefix).all():
            stripped_key = obj.key.replace(full_prefix, '')
            if stripped_key.startswith('/'):
                stripped_key = stripped_key[1:]
            new_file_path = os.path.join(local_dest_dir, stripped_key)

            try:
                os.makedirs(os.path.dirname(new_file_path))
            except OSError:
                pass
            if new_file_path.endswith('/'):
                continue
            if os.path.exists(new_file_path):
                os.remove(new_file_path)

            bucket.download_file(obj.key, new_file_path)
