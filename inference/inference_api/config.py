import os


class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY', 'api-secret-key')
    S3_ACCESS_KEY = os.environ.get('S3_ACCESS_KEY')
    S3_SECRET_KEY = os.environ.get('S3_SECRET_KEY')
    S3_ENDPOINT = os.environ.get('S3_ENDPOINT')
    S3_BUCKET = os.environ.get('S3_BUCKET')

