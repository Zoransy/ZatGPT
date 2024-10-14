from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('create-admin/', views.create_admin, name='create_admin'),
    path('create-superadmin/', views.create_superadmin, name='create_superadmin'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-info/', views.user_info, name='user_info'),
    path('create-session/', views.create_session, name='create-session'),
    path('get-sessions/', views.get_sessions, name='get-sessions'),
    path('send-message/', views.send_message, name='send-message'),
    path('get-messages/<uuid:session_id>/', views.get_messages, name='get-messages'),
]

