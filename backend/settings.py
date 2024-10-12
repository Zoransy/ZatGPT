from pathlib import Path
from dotenv import load_dotenv
import os

# 加载 .env 文件
load_dotenv()
# 11
# 项目根目录
BASE_DIR = Path(__file__).resolve().parent.parent

# 从环境变量中读取配置信息
SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# OpenAI 配置
OPENAI_AZURE_ENDPOINT = os.getenv('OPENAI_AZURE_ENDPOINT')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_API_VERSION = os.getenv('OPENAI_API_VERSION')
OPENAI_MODEL = os.getenv('OPENAI_MODEL')

# 安装的应用
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "ZatGPT",
]

# 中间件配置
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL 配置
ROOT_URLCONF = "backend.urls"

# 模板配置
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / 'templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI 配置
WSGI_APPLICATION = "backend.wsgi.application"

# 数据库配置
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # 使用 PostgreSQL 数据库
        'NAME': os.getenv('DB_NAME', 'mydatabase'),  # 默认数据库名称
        'USER': os.getenv('DB_USER', 'myuser'),  # 默认数据库用户
        'PASSWORD': os.getenv('DB_PASSWORD', 'mypassword'),  # 默认数据库密码
        'HOST': os.getenv('DB_HOST', 'localhost'),  # 默认数据库主机
        'PORT': os.getenv('DB_PORT', '5432'),  # 默认数据库端口
    }
}

AUTH_USER_MODEL = 'ZatGPT.User'

# 密码验证
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

# 国际化配置
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# 静态文件配置
STATIC_URL = "static/"

# 默认主键字段类型
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
