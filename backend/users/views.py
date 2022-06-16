from django.shortcuts import render, get_object_or_404
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserSerializer
from .models import User
from projects.models import Project, UserDonation
from projects.serializers import ProjectSerializer, UserDonationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django_email_verification import send_email
from django.utils import timezone
import jwt
import datetime


class Auth:
    def authenticate(request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed("Unauthenticated!")
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")
        return payload

    def check_status(request):
        token = request.COOKIES.get('jwt')
        if token:
            try:
                # check if the token has expired
                # if it cannot be decoded successfully, it means that token has expired
                payload = jwt.decode(token, 'secret', algorithms=['HS256'])
                raise AuthenticationFailed("You are already logged in!")
            except jwt.ExpiredSignatureError:
                pass


class UserListView(APIView):
    def get(self, request):
        user = User.objects.filter(is_active=1, is_staff=0, is_superuser=0).values()
        return Response(user)


class UserView(APIView):
    def get(self, request):
        payload = Auth.authenticate(request)
        user = get_object_or_404(User, pk=payload['id'])
        serializer = UserSerializer(user)
        return Response(serializer.data)


class GetUserView(APIView):
    def get(self, request, id):
        user = get_object_or_404(User, pk=id)
        if user.is_superuser or user.is_staff:
            raise AuthenticationFailed("Unauthenticated!")
        serializer = UserSerializer(user)
        response = Response()
        response.data = {
            "name": serializer.data['first_name'] + " " + serializer.data['last_name'],
            "email": serializer.data['email'],
            "mobile_phone": serializer.data['mobile_phone'],
            "profile_picture": serializer.data['profile_picture'],
            "birthday": serializer.data['birthday'],
            "country": serializer.data['country'],
            "fb_profile": serializer.data['fb_profile'],
            "projects": Project.objects.filter(user=serializer.data['id']).values()
        }
        return response


class RegisterView(APIView):
    def post(self, request):
        parser_classes = [MultiPartParser, FormParser]

        Auth.check_status(request)
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # user = User.objects.filter(email=serializer.data['email'])
        user = User.objects.get(email=serializer.data['email'])
        send_email(user)

        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        Auth.check_status(request)

        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("Incorrect Email or Password!")

        if password != user.password:
            if not user.check_password(password):
                raise AuthenticationFailed("Incorrect Email or Password!")

        if not user.is_active:
            raise AuthenticationFailed(
                'You have to verify your email first!')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
        }
        user.last_login = datetime.datetime.utcnow()
        user.save()
        # token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token)
        # response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            "jwt": token,
            "last_login": user.last_login,
            "username": user.username
        }
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        payload = Auth.authenticate(request)
        if payload:
            response.delete_cookie('jwt')
            message = "Logged out successfully!"
        else:
            message = "You are not logged in!"
        response.data = {
            "detail": message
        }
        return response


class UpdateUserView(APIView):
    def put(self, request):
        payload = Auth.authenticate(request)
        user = get_object_or_404(User, pk=payload['id'])

        # request.data.pop('email')   # He can edit all his data except for the email
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class GetUserProjectsView(APIView):
    def get(self, request):
        payload = Auth.authenticate(request)
        projects = Project.objects.filter(user=payload['id'])
        data = []
        for project in projects:
            serializer = ProjectSerializer(project)
            data.append(serializer.data)
        return Response(data)


class GetUserDonationsView(APIView):
    def get(self, request):
        payload = Auth.authenticate(request)
        donations = UserDonation.objects.filter(user=payload['id']).values()
        projects = []

        # for donation in set(UserDonation.objects.filter(user=payload['id']).values_list('project')):
        #     projects.append(Project.objects.filter(id=donation[0]).values())

        projects_ids = set(UserDonation.objects.filter(
            user=payload['id']).values_list('project', flat=True))

        for projects_id in projects_ids:
            projects.append(Project.objects.filter(
                id=projects_id).values().first())

        return Response({'donations': donations, 'project': projects})


class DeleteUserView(APIView):
    def delete(self, request):
        payload = Auth.authenticate(request)
        user = get_object_or_404(User, pk=payload['id'])
        
        response = Response()
        projects = Project.objects.filter(user=user.id)
        # if there is at least one project running now the user is not allowed to delete his account
        for project in projects:
            if project.end_time > timezone.now():
                response.data = {
                    "detail": "Cannot delete this account!"
                }
                break
        else:
            user.delete()
            response.delete_cookie('jwt')
            response.data = {
                "detail": "Account deleted successfully!"
            }
        return response
