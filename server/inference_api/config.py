import os


class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY', 'api-secret-key')

