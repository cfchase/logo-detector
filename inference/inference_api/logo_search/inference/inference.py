import os
import uuid
import numpy as np
import tensorflow as tf
from PIL import Image
from inference_api import storage


def run_inference_for_single_image(model, image_location):
    _, file_extension = os.path.splitext(image_location)
    local_file = '/tmp/inference-image-' + uuid.uuid4().hex[:6] + file_extension
    storage.download_file(image_location, local_file)

    # image = np.array(Image.open('/home/cchase/s3/cchase-aicoe/scavenger-dev/photos/20191125-14:10:54:226-alz9y.jpg'))
    image = np.array(Image.open(local_file))
    image = np.asarray(image)
    # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
    input_tensor = tf.convert_to_tensor(image)
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

    try:
        os.remove(local_file)
    except OSError:
        pass

    return output_dict
