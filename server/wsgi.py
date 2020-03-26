import os
from inference_api import create_app

application = create_app(__name__)


if __name__ == "__main__":
    host = os.getenv('HOST') or '0.0.0.0'
    port = os.getenv('PORT') or '8080'
    application.run(host=host, port=port)


@application.shell_context_processor
def make_shell_context():
    return {}
