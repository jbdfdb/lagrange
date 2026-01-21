"""
Tests pour l'application Lagrange
"""

import pytest
from app import create_app
from config import Config, DevelopmentConfig, ProductionConfig, TestingConfig


class TestConfig:
    """Tests pour la configuration."""

    def test_base_config(self):
        """Verifie la configuration de base."""
        assert Config.SECRET_KEY is not None
        assert Config.HOST == '127.0.0.1'
        assert Config.PORT == 5000

    def test_development_config(self):
        """Verifie la configuration de developpement."""
        assert DevelopmentConfig.DEBUG is True
        assert DevelopmentConfig.ENV == 'development'

    def test_production_config(self):
        """Verifie la configuration de production."""
        assert ProductionConfig.DEBUG is False
        assert ProductionConfig.ENV == 'production'
        assert 'Strict-Transport-Security' in ProductionConfig.SECURITY_HEADERS

    def test_testing_config(self):
        """Verifie la configuration de test."""
        assert TestingConfig.DEBUG is True
        assert TestingConfig.TESTING is True


class TestApp:
    """Tests pour l'application Flask."""

    @pytest.fixture
    def app(self):
        """Cree une instance de l'application pour les tests."""
        app = create_app(TestingConfig)
        return app

    @pytest.fixture
    def client(self, app):
        """Cree un client de test."""
        return app.test_client()

    def test_app_creation(self, app):
        """Verifie que l'application est creee correctement."""
        assert app is not None
        assert app.config['TESTING'] is True

    def test_index_route(self, client):
        """Verifie que la route principale fonctionne."""
        response = client.get('/')
        assert response.status_code == 200
        assert b'Systeme Solaire' in response.data

    def test_health_route(self, client):
        """Verifie que le health check fonctionne."""
        response = client.get('/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'ok'

    def test_security_headers(self, client):
        """Verifie que les headers de securite sont presents."""
        response = client.get('/')
        assert response.headers.get('X-Content-Type-Options') == 'nosniff'
        assert response.headers.get('X-Frame-Options') == 'SAMEORIGIN'
        assert response.headers.get('X-XSS-Protection') == '1; mode=block'

    def test_static_css(self, client):
        """Verifie que le CSS est accessible."""
        response = client.get('/static/css/style.css')
        assert response.status_code == 200
        assert b'--color-primary' in response.data

    def test_static_js_main(self, client):
        """Verifie que le JS principal est accessible."""
        response = client.get('/static/js/main.js')
        assert response.status_code == 200
        assert b'Lagrange' in response.data

    def test_static_js_config(self, client):
        """Verifie que la config JS est accessible."""
        response = client.get('/static/js/config.js')
        assert response.status_code == 200
        assert b'PLANETS' in response.data


class TestStaticFiles:
    """Tests pour les fichiers statiques."""

    @pytest.fixture
    def client(self):
        """Cree un client de test."""
        app = create_app(TestingConfig)
        return app.test_client()

    def test_all_js_modules_exist(self, client):
        """Verifie que tous les modules JS existent."""
        modules = [
            'config.js',
            'scene.js',
            'celestial.js',
            'referential.js',
            'asteroids.js',
            'voyage.js',
            'ui.js',
            'main.js',
        ]
        for module in modules:
            response = client.get(f'/static/js/{module}')
            assert response.status_code == 200, f"Module {module} non trouve"
