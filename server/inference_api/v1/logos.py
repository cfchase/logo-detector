import json
from flask import jsonify, request, abort
from inference_api.v1 import v1
from inference_api.logo_search import run_inference_for_base64


@v1.route('/logos', methods=['POST'])
def create_logo_inference():
    body = json.loads(request.data)
    image = body.get('image')
    detections = run_inference_for_base64(image)
    inference_result = {
        'detections': detections
    }

    return jsonify(inference_result)
