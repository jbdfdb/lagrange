"""
Lagrange - Systeme Solaire 3D Interactif
Application Flask avec configuration securisee

@author J-B de Fromont
@version 2.0.0
"""

import logging
from flask import Flask, render_template
from config import get_config


def create_app(config_class=None):
    """
    Factory function pour creer l'application Flask.

    Args:
        config_class: Classe de configuration (optionnel, auto-detecte sinon)

    Returns:
        Flask: Instance de l'application configuree
    """
    app = Flask(__name__)

    # Charger la configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Configurer le logging
    logging.basicConfig(
        level=getattr(logging, app.config.get('LOG_LEVEL', 'INFO')),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)

    # Security headers middleware
    @app.after_request
    def add_security_headers(response):
        """Ajoute les headers de securite a chaque reponse."""
        headers = config_class.SECURITY_HEADERS
        for header, value in headers.items():
            response.headers[header] = value
        return response

    # Routes
    @app.route('/')
    def index():
        """Page principale - Visualisation du systeme solaire."""
        return render_template('index.html')

    @app.route('/health')
    def health():
        """Endpoint de health check."""
        return {'status': 'ok', 'app': app.config.get('APP_NAME', 'Lagrange')}

    logger.info(f"Application {app.config.get('APP_NAME')} initialisee")
    return app


# Point d'entree pour le developpement
if __name__ == '__main__':
    app = create_app()
    app.run(
        host=app.config.get('HOST', '127.0.0.1'),
        port=app.config.get('PORT', 5000),
        debug=app.config.get('DEBUG', False)
    )
