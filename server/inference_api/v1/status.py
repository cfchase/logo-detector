import sys
import time
from flask import jsonify
from inference_api.v1 import v1


@v1.route('/status', methods=['GET'])
def status():
    status_obj = {
        'version': '0.1',
        'python_version': '.'.join(str(n) for n in sys.version_info),
        'status': 'ok',
        'time': time.strftime('%A %B, %d %Y %H:%M:%S')
    }

    return jsonify(status_obj)
