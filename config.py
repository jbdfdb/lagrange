"""Configuration centralisée pour l'application Lagrange."""
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


class Config:
    """Configuration de base."""

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-fallback-key-change-in-prod')
    HOST = os.getenv('FLASK_HOST', '127.0.0.1')
    PORT = int(os.getenv('FLASK_PORT', 5000))
    APP_NAME = os.getenv('APP_NAME', 'Lagrange - Système Solaire')
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

    SECURITY_HEADERS = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    }


class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'


class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'

    SECURITY_HEADERS = {
        **Config.SECURITY_HEADERS,
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data:; "
            "connect-src 'self';"
        ),
    }


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SECRET_KEY = 'test-key'


def get_config():
    """Retourne la configuration selon la variable d'environnement FLASK_ENV."""
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig
    if env == 'testing':
        return TestingConfig
    return DevelopmentConfig
