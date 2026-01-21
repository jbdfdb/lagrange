"""
Configuration centralisée pour l'application Lagrange.
Utilise python-dotenv pour charger les variables d'environnement.
"""
import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()


class Config:
    """Configuration de base."""

    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-fallback-key-change-in-prod')

    # Server
    HOST = os.getenv('FLASK_HOST', '127.0.0.1')
    PORT = int(os.getenv('FLASK_PORT', 5000))

    # Application
    APP_NAME = os.getenv('APP_NAME', 'Lagrange - Systeme Solaire')
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

    # Security headers
    SECURITY_HEADERS = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    }


class DevelopmentConfig(Config):
    """Configuration pour le developpement."""
    DEBUG = True
    ENV = 'development'


class ProductionConfig(Config):
    """Configuration pour la production."""
    DEBUG = False
    ENV = 'production'

    # Headers de securite renforces en production
    SECURITY_HEADERS = {
        **Config.SECURITY_HEADERS,
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://esm.sh; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data:; "
            "connect-src 'self' https://esm.sh;"
        ),
    }


class TestingConfig(Config):
    """Configuration pour les tests."""
    DEBUG = True
    TESTING = True
    ENV = 'testing'


def get_config():
    """Retourne la configuration appropriee selon l'environnement."""
    env = os.getenv('FLASK_ENV', 'development').lower()

    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig,
    }

    return config_map.get(env, DevelopmentConfig)
