import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username must be set')

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_admin(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)
        return self.create_user(username=username, password=password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username=username, password=password, **extra_fields)


class User(AbstractBaseUser):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.username


class Session(models.Model):
    session_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # 会话ID
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # 发起用户
    start_time = models.DateTimeField(auto_now_add=True)  # 会话开始时间

    def __str__(self):
        return f'Session {self.session_id} by {self.user.username}'


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)  # 对话记录ID
    session = models.ForeignKey(Session, on_delete=models.CASCADE)  # 关联会话ID
    role = models.CharField(max_length=10)  # 消息发送方（'system', 'user', 'assistant'）
    content = models.TextField()  # 消息内容
    timestamp = models.DateTimeField(auto_now_add=True)  # 消息时间戳

    def __str__(self):
        return f'{self.role}: {self.content[:50]}...'
