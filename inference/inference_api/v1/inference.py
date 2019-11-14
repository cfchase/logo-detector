import json
from flask import jsonify, request, abort
from inference_api import model, model_config
from inference_api.v1 import v1
from inference_api.logo_search import run_inference_for_single_image


@v1.route('/inference', methods=['POST'])
def create_inference():
    body = json.loads(request.data)
    file = body.get('file')
    detections = clean_detections(run_inference_for_single_image(model, file))
    inference_result = {
        'logo_classes': get_logo_classes(detections),
        'detections': detections
    }

    return jsonify(inference_result)


def clean_detections(inference):
    cleaned = []
    num_detections = inference['num_detections']

    for i in range(0, num_detections):
        d = {
            'box': {
                'yMin': inference['detection_boxes'][i][0],
                'xMin': inference['detection_boxes'][i][1],
                'yMax': inference['detection_boxes'][i][2],
                'xMax': inference['detection_boxes'][i][3]
            },
            'class': inference['detection_classes'][0],
            'label': model_config['labels'][str(int(inference['detection_classes'][0]))],
            'score': inference['detection_scores'],
        }
        cleaned.append(d)
    return cleaned


def get_logo_classes(detections):
    return [d['label'] for d in detections]
