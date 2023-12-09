import os

# 导入所需包
from flask_cors import CORS

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    # SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    # FLASKY_MAIL_SUBJECT_PREFIX = '[Flasky]'
    # FLASKY_MAIL_SENDER = 'Flasky Admin <flasky@example.com>'
    # FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')
    SQLALCHEMY_TRACK_MODIFICATIONS = True  # 动态追踪修改设置
    # SQLALCHEMY_ECHO = True
    SECRET_KEY = "web2_cwk2"
    username = "web2_cwk2"
    password = SECRET_KEY
    ipaddress = "wmzspace.space"
    port = "3306"
    database = "web2_cwk2"
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{username}:{password}@{ipaddress}:{port}/{database}"

    @staticmethod  # 此注释可表明使用类名可以直接调用该方法
    def init_app(app):
        # 执行当前需要的环境的初始化
        CORS(app)
        pass


class DevelopmentConfig(Config):
    # 开发环境
    DEBUG = True
    # MAIL_SERVER = 'smtp.googlemail.com'
    # MAIL_PORT = 587
    # MAIL_USE_TLS = True
    # MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    # MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
    #                           'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')


class TestingConfig(Config):
    # 测试环境
    # TESTING = True
    # SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
    #                           'sqlite:///' + os.path.join(basedir, 'data-test.sqlite')
    pass


class ProductionConfig(Config):
    # 生产环境
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    #                           'sqlite:///' + os.path.join(basedir, 'data.sqlite')
    pass


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
