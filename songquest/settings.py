import os
import sys
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")

# Base URL
BASE_URL = "https://songquest.io"

# Frontend URL
# FRONTEND_URL = "http://localhost:3000"
# FRONTEND_URL = "http://localhost:8000"
FRONTEND_URL = "https://songquest.io"

# Email settings
DEFAULT_FROM_EMAIL = os.getenv("EMAIL_HOST_USER")
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

# Security settings
DEBUG = True  # Set to False in production
SECRET_KEY = os.environ.get("SECRET_KEY")
ALLOWED_HOSTS = [
    "songquest.io",
    "www.songquest.io",
    "127.0.0.1",
    "216.128.141.249",
    "localhost",
]

APPEND_SLASH = True

# Database settings
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}

# Installed apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # "corsheaders",
    "rest_framework",
    "webpack_loader",
    "songquest",
    "songquest.user.apps.UserConfig",
    "songquest.songs.apps.SongsConfig",
    "songquest.playlists.apps.PlaylistsConfig",
    "songquest.recommendations.apps.RecommendationsConfig",
    "songquest.payments.apps.PaymentsConfig",
    "frontend",
]

# Webpack
WEBPACK_LOADER = {
    "DEFAULT": {
        "CACHE": not DEBUG,
        "BUNDLE_DIR_NAME": "static/bundles/",  # must end with a slash
        "STATS_FILE": os.path.join(BASE_DIR, "static/bundles/webpack-stats.json"),
        "POLL_INTERVAL": 0.1,
        "TIMEOUT": None,
        "IGNORE": [r".+\.hot-update.js", r".+\.map"],
    }
}

# Middleware
MIDDLEWARE = [
    # "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# Cache settings
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}


# CORS settings
# CORS_ALLOW_HEADERS = [
#     "Authorization",
#     "Content-Type",
#     "X-CSRFToken",
#     "X-Requested-With",
#     "User-Id",
#     "User-Email",
# ]

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
# ]

# CORS_ALLOW_METHODS = [
#     "DELETE",
#     "GET",
#     "OPTIONS",
#     "PATCH",
#     "POST",
#     "PUT",
# ]

# CORS_ALLOW_ALL_ORIGINS = False

# CSRF_TRUSTED_ORIGINS = [
#     "http://localhost:3000",
#     "http://localhost:8000",
# ]

# CORS_ALLOW_CREDENTIALS = True


# Authentication settings
AUTH_USER_MODEL = "user.User"
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "songquest.auth.backends.EmailOrUsernameBackend",
]

# Rest Framework settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
}

# Logging settings
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
        },
        "file": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": os.path.join(
                BASE_DIR, "logs/django.log"
            ),  # Full path to log file
        },
    },
    "root": {
        "handlers": ["console"],  # Specify which handlers to use
        "level": "DEBUG",  # Set the root logger level
    },
    "loggers": {
        "django": {
            # Log only to the file for Django-related logs
            "handlers": ["file"],
            "level": "DEBUG",
            "propagate": False,  # Prevent logs from being propagated to the root logger
        },
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Frontend widget values
CHANNEL_TYPE_VALUE = 0
FREQ_TYPE_VALUE = 8000
CONVERT_TYPE_VALUE = 0

# URL Configuration
ROOT_URLCONF = "songquest.urls"

# Template settings
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "frontend/dist")],
        "APP_DIRS": True,  # Disable loading templates from installed apps
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "songquest.context_processors.spotify_client_id",
            ],
        },
    },
]

# WSGI application
WSGI_APPLICATION = "songquest.wsgi.application"

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files settings
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

# Media settings
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
