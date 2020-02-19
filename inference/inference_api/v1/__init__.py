import os
from flask import Blueprint

v1 = Blueprint('v1', __name__)

from inference_api.v1 import errors, status, inference, logos

