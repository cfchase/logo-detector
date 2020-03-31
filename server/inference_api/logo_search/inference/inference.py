import os
import sys
import json
from sasctl.services import microanalytic_score as mas
from sasctl import Session


def run_inference_for_base64(base64img):
    host = os.getenv('OPENMM_HOST', '')
    user = os.getenv('OPENMM_USER', '')
    password = os.getenv('OPENMM_PASSWORD', '')
    model = os.getenv('OPENMM_MODEL', '')
    try:
        with Session(host, user, password, verify_ssl=False, protocol='http'):
            mod = mas.get_module(model)
            response = mas.execute_module_step(mod, 'score', image_names='test_image', image_strings=base64img)
            return transform_openmm_detections(response)
    except:
        e = sys.exc_info()[0]
        print(e)


def transform_openmm_detections(mm_response):
    labels = json.loads(os.getenv('OPENMM_LABELS', '["SAS", "Red Hat", "Anaconda", "Cloudera"]'))
    min_scores = json.loads(os.getenv('OPENMM_MIN_SCORES', '[0,0,0,0]'))

    print(mm_response.get('DETECTION_BOXES_NORM'))
    print(mm_response.get('DETECTION_CLASSES'))
    print(mm_response.get('DETECTION_LABELS'))
    print(mm_response.get('DETECTION_SCORES'))

    detection_boxes = json.loads(mm_response.get('DETECTION_BOXES_NORM'))
    detection_classes = json.loads(mm_response.get('DETECTION_CLASSES'))
    detection_scores = json.loads(mm_response.get('DETECTION_SCORES'))

    num_detections = min([len(detection_boxes), len(detection_classes), len(detection_scores)])

    boxes = []
    for i in range(0, num_detections):
        detection_class = int(detection_classes[i])
        label = labels[detection_class] or detection_classes[i]
        if detection_scores[i] * 100 < min_scores[detection_class]:
            continue

        d = {
            'box': {
                'xMin': detection_boxes[i][0],
                'yMin': detection_boxes[i][1],
                'xMax': detection_boxes[i][2],
                'yMax': detection_boxes[i][3]
            },
            'class': detection_classes[i],
            'label': label,
            'score': detection_scores[i],
        }
        boxes.append(d)
    return boxes
