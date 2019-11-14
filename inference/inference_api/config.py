import os


class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY', 'api-secret-key')
    S3_ACCESS_KEY_ID = os.environ.get('S3_ACCESS_KEY_ID')
    S3_SECRET_ACCESS_KEY = os.environ.get('S3_SECRET_ACCESS_KEY')
    S3_ENDPOINT = os.environ.get('S3_ENDPOINT')
    S3_REGION = os.environ.get('S3_REGION')
    S3_BUCKET = os.environ.get('S3_BUCKET')
    S3_PREFIX = os.environ.get('S3_PREFIX')
    MODEL_LOCATION = os.environ.get('MODEL_LOCATION')
    MODEL_CONFIG_LOCATION = os.environ.get('MODEL_CONFIG_LOCATION')
