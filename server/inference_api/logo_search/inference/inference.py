import os
import sys
import json
from sasctl.services import microanalytic_score as mas
from sasctl import Session


def run_inference_for_base64(base64img):
    host = os.getenv('OPENMM_HOST', '')
    user = os.getenv('OPENMM_USER', '')
    password = os.getenv('OPENMM_PASSWORD', '')
    try:
        with Session(host, user, password, verify_ssl=False, protocol='http'):
            mod = mas.get_module('logo_detector_torch')
            response = mas.execute_module_step(mod, 'score', image_names='test_image', image_strings=base64img)
            return transform_openmm_detections(response)
    except:
        e = sys.exc_info()[0]
        print(e)


def transform_openmm_detections(mm_response):
    model_config = {
        "labels": {
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4"
        }
    }

    detection_boxes = json.loads(mm_response.get('DETECTION_BOXES'))
    detection_classes = json.loads(mm_response.get('DETECTION_CLASSES'))
    detection_scores = json.loads(mm_response.get('DETECTION_SCORES'))
    l = min([len(detection_boxes), len(detection_classes), len(detection_scores)])
    boxes = []
    for i in range(0, l):
        str_index = str(int(detection_classes[i]))
        label = model_config['labels'].get(str_index) or str_index
        d = {
            'box': {
                'yMin': detection_boxes[i][0],
                'xMin': detection_boxes[i][1],
                'yMax': detection_boxes[i][2],
                'xMax': detection_boxes[i][3]
            },
            'class': detection_classes[i],
            'label': label,
            'score': detection_scores[i],
        }
        boxes.append(d)
    return boxes
