import os
import uuid
import numpy as np
import tensorflow as tf
import base64
import io

from PIL import Image
from inference_api import storage


def run_inference_for_base64(model, base64img):
    img_bytes = base64.decodebytes(base64img.encode())
    image = Image.open(io.BytesIO(img_bytes))
    inference = run_inference_for_single_image(model, image)
    return inference


def run_inference_for_stored_file(model, image_location):
    _, file_extension = os.path.splitext(image_location)
    local_file = '/tmp/inference-image-' + uuid.uuid4().hex[:6] + file_extension
    storage.download_file(image_location, local_file)

    image = Image.open(local_file)
    inference = run_inference_for_single_image(model, image)

    try:
        os.remove(local_file)
    except OSError:
        pass

    return inference


def run_inference_for_single_image(model, image):
    np_array = np.array(image)
    ar_np_array = np.asarray(np_array)
    # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
    input_tensor = tf.convert_to_tensor(ar_np_array)
    # The model expects a batch of images, so add an axis with `tf.newaxis`.
    input_tensor = input_tensor[tf.newaxis, ...]

    # Run inference
    tensor_output = model(input_tensor)

    # All outputs are batches tensors.
    # Convert to numpy arrays, and take index [0] to remove the batch dimension.
    # We're only interested in the first num_detections.
    num_detections = int(tensor_output.pop('num_detections'))
    output_dict = {
        key: value[0, :num_detections].numpy().tolist() for key, value in tensor_output.items()
    }
    output_dict['num_detections'] = num_detections

    return output_dict
