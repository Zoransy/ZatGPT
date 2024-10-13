from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer

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
