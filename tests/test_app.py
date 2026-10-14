"""Tests pour l'application Lagrange."""
import pytest

from app import create_app
from config import Config, DevelopmentConfig, ProductionConfig, TestingConfig


class TestConfig:
    def test_base_config(self):
        assert Config.SECRET_KEY is not None
        assert Config.HOST == '127.0.0.1'
        assert Config.PORT == 5000

    def test_development_config(self):
        assert DevelopmentConfig.DEBUG is True

    def test_production_config(self):
        assert ProductionConfig.DEBUG is False
        assert 'Strict-Transport-Security' in ProductionConfig.SECURITY_HEADERS

    def test_testing_config(self):
        assert TestingConfig.TESTING is True


class TestApp:
    @pytest.fixture
    def app(self):
        return create_app(TestingConfig)

    @pytest.fixture
    def client(self, app):
        return app.test_client()

    def test_app_creation(self, app):
        assert app is not None

    def test_index_route(self, client):
        response = client.get('/')
        assert response.status_code == 200
        assert b'LAGRANGE' in response.data or b'Syst' in response.data

    def test_health_route(self, client):
        response = client.get('/health')
        assert response.status_code == 200
        assert response.json['status'] == 'ok'

    def test_security_headers(self, client):
        response = client.get('/')
        assert response.headers['X-Content-Type-Options'] == 'nosniff'


class TestStaticFiles:
    @pytest.fixture
    def client(self):
        return create_app(TestingConfig).test_client()

    def test_all_js_modules_exist(self, client):
        modules = [
            'data.js', 'physics.js', 'scene.js', 'ui.js',
            'asteroids.js', 'missions.js', 'voyage.js',
        ]
        for module in modules:
            response = client.get(f'/static/js/{module}')
            assert response.status_code == 200, f'Module {module} non trouvé'

    def test_main_entry_exists(self, client):
        assert client.get('/static/lagrange.js').status_code == 200

    def test_vendor_three_exists(self, client):
        assert client.get('/static/vendor/three.module.js').status_code == 200

    def test_missions_module_contains_data(self, client):
        data = client.get('/static/js/missions.js').data.decode()
        assert 'MISSIONS_DATA' in data
        assert 'Voyager 1' in data
        assert 'Apollo 11' in data
        assert 'James Webb' in data
