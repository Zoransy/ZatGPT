from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('create-admin/', views.create_admin, name='create_admin'),
    path('create-superadmin/', views.create_superadmin, name='create_superadmin'),
]
