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
    
    boxes = process_boxes(boxes, postprocess=True)

    return boxes

def process_boxes(boxes, postprocess=False):
    '''
    if big overlap between cloudera and sas (iou), then pick cloudera
    WARNING: IOU THRESH should be moved to config
    '''
    IOU_THRESH = 0.50

    if not postprocess:
        return boxes

    results, boxes_cloudera, boxes_sas = [], [], []
    for d in boxes:
        print(d)
        if d['label']=='Cloudera':
            boxes_cloudera.append(d)
        elif d['label']=='SAS':
            boxes_sas.append(d)
        else:
            results.append(d)
    
    #quadratic loop but over tiny arrays
    for s in boxes_sas:
        found_overlap = False

        for c in boxes_cloudera:
            if calc_iou(s['box'], c['box']) > IOU_THRESH:
                results.append(c)
                found_overlap = True
                break
        if not found_overlap:
            results.append(s) #if s didn't overlap with any c, keep s

    return results


def calc_iou(bbox1, bbox2):
    #Note: no need to scale the dimensions by actual image size
    #can use normalized/relative coordinates

    x_list = [bbox1['xMin'], bbox1['xMax'], bbox2['xMin'], bbox2['xMax']]
    y_list = [bbox1['yMin'], bbox1['yMax'], bbox2['yMin'], bbox2['yMax']]

    #check for non-intersection:
    if bbox1['xMax'] < bbox2['xMin'] or bbox2['xMax'] < bbox1['yMin']:
        return 0
    if bbox1['yMax'] < bbox2['yMin'] or bbox2['yMax'] < bbox1['yMin']:
        return 0

    x_list_sorted = sorted(x_list)
    y_list_sorted = sorted(y_list)

    area_intersect = (x_list_sorted[2] - x_list_sorted[1]) * (y_list_sorted[2]-y_list_sorted[1])

    area_box1 = (bbox1['xMax']-bbox1['xMin'])*(bbox1['yMax']-bbox1['yMin'])
    area_box2 = (bbox2['xMax']-bbox2['xMin'])*(bbox2['yMax']-bbox2['yMin'])

    iou = area_intersect / (area_box1 + area_box2 - area_intersect)

    return iou