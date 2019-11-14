import os
import uuid
import tensorflow as tf
from flask import Flask
from storage import S3Store
from inference_api.config import Config

storage = S3Store(
    prefix=Config.S3_PREFIX,
    host=Config.S3_ENDPOINT,
    key_id=Config.S3_ACCESS_KEY_ID,
    secret_key=Config.S3_SECRET_ACCESS_KEY,
    bucket=Config.S3_BUCKET,
    region=Config.S3_REGION
)

local_dir = '/tmp/inference-models-' + uuid.uuid4().hex[:6]
storage.download_directory(Config.MODEL_LOCATION, local_dir)
saved_model = tf.saved_model.load(os.path.join(local_dir))
model = saved_model.signatures['serving_default']
model_config = storage.get_json(Config.MODEL_CONFIG_LOCATION)


def create_app(app_name):
    inference_api = Flask(app_name)

    inference_api.config.from_object(Config)

    from inference_api.v1 import v1
    inference_api.register_blueprint(v1, url_prefix='')

    return inference_api
