from django.urls import path, include
from .views import UserListView, RegisterView, LoginView, UserView, LogoutView, UpdateUserView, GetUserProjectsView, GetUserDonationsView, GetUserView, DeleteUserView
from django_email_verification import send_email, urls as mail_urls

urlpatterns = [
    path('', UserListView.as_view(), name="all_users"),
    path('<int:id>', GetUserView.as_view(), name="get_user"),
    path('profile', UserView.as_view(), name="user_profile"),
    path('register', RegisterView.as_view(), name="register"),
    path('login', LoginView.as_view(), name="login"),
    path('logout', LogoutView.as_view(), name="logout"),
    path('update', UpdateUserView.as_view(), name="update"),
    path('projects', GetUserProjectsView.as_view(), name="user_projects"),
    path('donations', GetUserDonationsView.as_view(), name="user_donations"),
    path('delete', DeleteUserView.as_view(), name="delete_user"),

    path('email', include(mail_urls)),
    path('send_email', send_email),
]
