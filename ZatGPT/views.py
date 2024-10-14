from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer
from .models import Session, Message
from .utils import get_openai_response
from django.shortcuts import get_object_or_404
from django.utils import timezone

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # 确保只有经过认证的用户可以访问
def user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({'message': 'Login successful!'}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # 确保只有经过认证的用户可以访问
def create_admin(request):
    if not request.user.is_superuser:
        return Response({'error': 'Only superadmins can create admins.'}, status=status.HTTP_403_FORBIDDEN)

    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response({'error': 'Username, password, and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_admin(username=username, password=password, email=email)
        return Response({'message': 'Admin created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # 确保只有经过认证的用户可以访问
def create_superadmin(request):
    if not request.user.is_superuser:
        return Response({'error': 'Only superadmins can create other superadmins.'}, status=status.HTTP_403_FORBIDDEN)

    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response({'error': 'Username, password, and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_superuser(username=username, password=password, email=email)
        return Response({'message': 'Superadmin created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    user = request.user

    session_id = request.data.get('session_id')
    session = get_object_or_404(Session, session_id=session_id)

    # 获取用户输入的消息
    user_message = request.data.get('content')
    if not user_message:
        return JsonResponse({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

    # 记录用户消息
    Message.objects.create(session=session, role='user', content=user_message)

    # 获取该会话的所有消息（包括system prompt）
    messages = Message.objects.filter(session=session).order_by('timestamp')
    message_list = [{"role": msg.role, "content": msg.content} for msg in messages]

    # 调用 OpenAI API 获取助手回复
    assistant_response = get_openai_response(message_list)

    # 记录助手的回复
    Message.objects.create(session=session, role='assistant', content=assistant_response)

    # 返回助手的回复和会话ID给前端
    return JsonResponse({
        "assistant_message": assistant_response,
        "session_id": session.session_id
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, session_id):
    user = request.user
    # 确保使用的是 UUID session_id
    session = get_object_or_404(Session, session_id=session_id, user=user)

    # 获取当前会话的所有消息
    messages = Message.objects.filter(session=session).order_by('timestamp')
    message_list = [{"role": msg.role, "content": msg.content, "timestamp": msg.timestamp} for msg in messages]

    return JsonResponse({"messages": message_list}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sessions(request):
    user = request.user
    sessions = Session.objects.filter(user=user).order_by('-start_time')

    session_list = []
    for session in sessions:
        # 获取会话中用户发出的第一条消息
        first_user_message = Message.objects.filter(session=session, role='user').order_by('timestamp').first()
        # 取第一条用户消息的前10个字符作为标题
        session_title = first_user_message.content[:20] if first_user_message else f"Session from {session.start_time}"

        session_list.append({
            "session_id": session.session_id,
            "title": session_title,
            "start_time": session.start_time,
            "date": session.start_time.date()  # 添加日期字段
        })

    return JsonResponse({"sessions": session_list}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_session(request):
    user = request.user  # 获取当前认证的用户
    if not user.is_authenticated:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    # 创建新会话
    session = Session.objects.create(user=user)

    # 添加系统消息 (system prompt)
    system_prompt = "You are a helpful assistant."
    Message.objects.create(session=session, role='system', content=system_prompt)

    return JsonResponse({"session_id": session.session_id}, status=status.HTTP_201_CREATED)
