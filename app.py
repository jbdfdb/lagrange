"""Lagrange - Système Solaire 3D Interactif.

Application Flask avec configuration sécurisée.
"""
import logging

from flask import Flask, render_template

from config import get_config


def create_app(config_class=None):
    """Factory de l'application Flask.

    Args:
        config_class: Classe de configuration (auto-détectée si None).

    Returns:
        Flask: Instance configurée.
    """
    app = Flask(__name__)

    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    logging.basicConfig(
        level=getattr(logging, app.config.get('LOG_LEVEL', 'INFO')),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    )
    logger = logging.getLogger(__name__)

    @app.after_request
    def add_security_headers(response):
        for header, value in config_class.SECURITY_HEADERS.items():
            response.headers[header] = value
        return response

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/health')
    def health():
        return {'status': 'ok', 'app': app.config.get('APP_NAME', 'Lagrange')}

    logger.info(f"Application {app.config.get('APP_NAME')} initialisée")
    return app


if __name__ == '__main__':
    create_app().run(
        host=get_config().HOST,
        port=get_config().PORT,
        debug=get_config().DEBUG,
    )
