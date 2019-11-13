from flask import jsonify, request, abort
from inference_api.v1 import v1
from pprint import pprint


@v1.route('/inference', methods=['POST'])
def create_inference():
    pprint(request.data)
    inference_result = {
        'inference': 'label'
    }

    return jsonify(inference_result)
