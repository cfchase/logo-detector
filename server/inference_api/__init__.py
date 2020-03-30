from flask import Flask
from inference_api.config import Config


def create_app(app_name):
    inference_api = Flask(app_name)

    inference_api.config.from_object(Config)

    from inference_api.v1 import v1
    inference_api.register_blueprint(v1, url_prefix='')

    return inference_api
