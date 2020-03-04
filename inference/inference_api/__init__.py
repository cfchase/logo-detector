import os
import uuid
import json
import tensorflow as tf
from flask import Flask
from inference_api.config import Config

local_dir = 'inference_api/models/logos'
saved_model = tf.saved_model.load(local_dir)
model = saved_model.signatures['serving_default']
with open('inference_api/models/model_config.json') as json_file:
    model_config = json.load(json_file)


def create_app(app_name):
    inference_api = Flask(app_name)

    inference_api.config.from_object(Config)

    from inference_api.v1 import v1
    inference_api.register_blueprint(v1, url_prefix='')

    return inference_api
