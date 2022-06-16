import datetime
from operator import attrgetter
from unicodedata import category, numeric
from defer import return_value
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project, UserRateProject, Comment, Category, Tag, Picture, UserDonation
from users.models import User
from .serializers import ProjectSerializer, PictureSerializer, CommentSerializer, UserDonationSerializer, TagSerializer, UserRateProjectSerializer
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Avg
from rest_framework.exceptions import AuthenticationFailed

from users.views import Auth
from django.utils import timezone


class ProjectListView(APIView):
    def get_user_dict(self, projects):
        returned_projects = []

        for project in projects:
            first_name = User.objects.filter(id=project['user_id']).first().first_name
            last_name = User.objects.filter(id=project['user_id']).first().last_name
            user = {
                "id": project['user_id'],
                "name": f"{first_name} {last_name}",
            }
            returned_projects.append({**project, "user": user})
        return returned_projects

    def get(self, request):
        projects = Project.objects.all().values()
        returned_projects = self.get_user_dict(projects)
        return Response(returned_projects)


class CreateProjectView(APIView):
    def post(self, request):
        pictures = request.data.getlist('pictures') if 'pictures' in request.data else []
        tags = request.data.getlist('tags[]') if 'tags[]' in request.data else []
        tags_list = []

        # store multiple tags
        # if it doesn't exist, create a new one
        for tag in tags:
            stored_tag = Tag.objects.filter(name=tag).first()
            if stored_tag:
                tags_list.append(stored_tag)
            else:
                tag_serializer = TagSerializer(data={'name': tag})
                x = tag_serializer.is_valid(raise_exception=True)
                tag_serializer.save()

                tag_instance = get_object_or_404(
                    Tag, pk=tag_serializer.data['id'])
                tags_list.append(tag_instance)

        # the user who creates the project must be the one who is already logged in
        payload = Auth.authenticate(request)
        request.data._mutable = True
        request.data['user'] = payload['id']
        # request.data['tags'] = 
        request.data._mutable = False

        # store project data
        project_serializer = ProjectSerializer(data=request.data)
        project_serializer.is_valid(raise_exception=True)
        project_serializer.save()

        project_instance = get_object_or_404(
            Project, pk=project_serializer.data['id'])
        
        try:
            # assign the project for each tag entered
            for tag in tags_list:
                project_instance.tags.add(tag)

            # store multiple project pictures
            for picture in pictures:
                picture_serializer = PictureSerializer(
                    data={'project': project_serializer.data['id'], 'picture': picture})
                picture_serializer.is_valid(raise_exception=True)
                picture_serializer.save()
        except:
            project_instance.delete()
            return Response({"detail": "Unexpected error!"})

        return Response(project_serializer.data)


class UpdateProjectView(APIView):
    def put(self, request, id):
        # TODO: edit pictures and tags
        payload = Auth.authenticate(request)
        project = get_object_or_404(Project, pk=id)
        if payload['id'] != project.user.id:
            raise AuthenticationFailed("You cannot edit this project!")

        serializer = ProjectSerializer(
            project, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProjectDetailsView(APIView):
    def get_related_projects(self, target_project):
        related_projects = []
        project_tags = target_project.tags.values_list('id', flat=True)
        
        projects = Project.objects.all()
        for project in projects:
            tags = project.tags.values_list('id', flat=True)
            if set(tags).intersection(project_tags):
                related_projects.append(project)
        return related_projects

    def get(self, request, id):
        project = get_object_or_404(Project, pk=id)
        serializer = ProjectSerializer(project)
        rate = UserRateProject.objects.filter(
            project=project.id).aggregate(Avg('rate'))['rate__avg'] or 0
        category = Category.objects.filter(
            id=serializer.data['category']).first().name if serializer.data['category'] else None
        # tags = []
        # for tag in serializer.data['tags']:
        #     tags.append(Tag.objects.filter(id=tag).first().name)

        pictures = Picture.objects.filter(project=id).values_list('picture', flat=True)
        current_donations = UserDonation.objects.filter(project=id).aggregate(Sum('donation'))['donation__sum'] or 0

        related_projects = self.get_related_projects(project)
        related_projects_serializer = ProjectSerializer(related_projects, many=True)
        
        returned_related_projects = []
        for related in related_projects_serializer.data:
            returned_related_projects.append({**related, 'user': {'name': f"{User.objects.filter(id=related['user']).first().first_name} {User.objects.filter(id=related['user']).first().last_name}"}})
        try:
            payload = Auth.authenticate(request)
            user_id = get_object_or_404(User, pk=payload['id']).id
            auth_user_rate = UserRateProject.objects.filter(user_id=user_id, project_id=serializer.data['id']).first().rate
        except:
            auth_user_rate = 0
        user = User.objects.filter(id=serializer.data['user']).first()
        return Response({**serializer.data, 'rate': rate, 'auth_user_rate': auth_user_rate, 'category': category, 'pictures': pictures, 'donations': current_donations, 'related': returned_related_projects, 'user': {'id': user.id, 'name': f"{user.first_name} {user.last_name}"}})


class CancelProjectView(APIView):
    def delete(self, request, id):
        project = get_object_or_404(Project, pk=id)
        current_donations = UserDonation.objects.filter(project=id).aggregate(Sum('donation'))['donation__sum'] or 0
        # TODO: add is_canceled column instead of delete the whole project
        if current_donations < project.total_target * Decimal(0.25) and project.end_time or timezone.now() > timezone.now() - datetime.timedelta(minutes=1):
            project.delete()
            message = "Canceled successfully!"
        else:
            message = "Cannot cancel the project!"
        return Response({
            "detail": message
        })


class DonateProjectView(APIView):
    def post(self, request, id):
        project = get_object_or_404(Project, pk=id)
        try:
            donation = Decimal(request.data['donation'])
            current_donations = UserDonation.objects.filter(project=id).aggregate(Sum('donation'))['donation__sum'] or 0
            if donation < 1:
                raise Exception()
        except:
            message = "Donation must be a +ve number!"
            return Response({
                "detail": message
            })

        if project.end_time or timezone.now() > timezone.now() - datetime.timedelta(minutes=1):
            if donation <= project.total_target - current_donations:
                user_id = Auth.authenticate(request)['id']
                user_donation_serializer = UserDonationSerializer(
                    data={'user': user_id, 'project': id, 'donation': donation})
                user_donation_serializer.is_valid(raise_exception=True)
                user_donation_serializer.save()

                # donations = project.donations + donation
                # project_serializer = ProjectSerializer(
                #     project, data={'donations': donations}, partial=True)
                # project_serializer.is_valid(raise_exception=True)
                # project_serializer.save()

                message = "Donated successfully!"
            else:
                message = f"This amount cannot be donated, the remaining amount = {project.total_target - current_donations}"
        else:
            message = f"The project ended on {project.end_time}"
        return Response({
            "detail": message
        })


class CommentProjectView(APIView):
    def post(self, request, id):
        project = get_object_or_404(Project, pk=id)
        comment = request.data['comment']
        user = Auth.authenticate(request)['id']

        serializer = CommentSerializer(
            data={'comment': comment, 'project': project.id, 'user': user})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = User.objects.filter(id=serializer.data['user']).first()
        returned_comment = {**serializer.data, 'user': {'id': user.id, 'name': f"{user.first_name} {user.last_name}", 'profile_picture': str(user.profile_picture)}}

        return Response(returned_comment)


class ReportProjectView(APIView):
    def post(self, request, id):
        return Response({"detail": "message"})


class ReportCommentView(APIView):
    def post(self, request, id):
        return Response({"detail": "message"})


class RateProjectView(APIView):
    def post(self, request, id):
        project_id = id if get_object_or_404(Project, pk=id) else None
        rate = request.data['rate']
        user_id = Auth.authenticate(request)['id']
        user_rate_project = UserRateProject.objects.filter(
            user=user_id, project=project_id).first()
        if user_rate_project:
            serializer = UserRateProjectSerializer(
                user_rate_project, data={'rate': rate}, partial=True)
        else:
            serializer = UserRateProjectSerializer(
                data={'rate': rate, 'user': user_id, 'project': project_id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": serializer.data})


# Homepage should contains the following:        
# - A slider to show the highest five rated running projects to encourage users to donate
class GetTopFiveProjectsView(APIView):
    def custom_sort(self, list):
        return list['rate']

    def get(self, request):
        projects = Project.objects.all()
        rates = []
        for project in projects:
            rate = UserRateProject.objects.filter(
                project=project.id).aggregate(Avg('rate'))['rate__avg'] or 0
            rates.append({
                'rate': rate,
                'project_id': project.id
            })
            
        rates = sorted(rates, key=self.custom_sort, reverse=True)[:5]
        top_five = []
        for rate in rates:
            project = Project.objects.filter(id=rate['project_id']).values().first()
            top_five.append({'rate': rate['rate'], **project})

        # projects = UserRateProject.objects.values_list('project_id', flat=True).annotate(Sum('rate')).order_by('-rate__sum')[:5]
        # top_five = ProjectSerializer(Project.objects.filter(id__in=projects), many=True).data

        returned_projects = ProjectListView.get_user_dict(self, top_five)
        return Response(returned_projects)


# - List of the latest 5 projects
class GetLatestFiveProjectsView(APIView):
    def get(self, request):
        projects = Project.objects.values().order_by('start_time')[:5]
        returned_projects = ProjectListView.get_user_dict(self, projects)
        return Response(returned_projects)



# - List of latest 5 featured projects (which are selected by the admin)
class GetAdminSelectedProjectsView(APIView):
    def get(self, request):
        projects = Project.objects.filter(is_selected=1).values()[:5]
        returned_projects = ProjectListView.get_user_dict(self, projects)
        return Response(returned_projects)


# - A list of the categories. User can open each category to view its projects
class GetCategoriesView(APIView):
    def get(self, request):
        category = Category.objects.all().values()
        return Response(category)


class GetProjectsByCategoryView(APIView):
    def get(self, request, name):
        category_id = Category.objects.filter(name=name).first().id if Category.objects.filter(name=name) else None
        projects = Project.objects.filter(category=category_id).values()
        returned_projects = ProjectListView.get_user_dict(self, projects)
        return Response(returned_projects)


# - Search bar that enables users to search projects by title or tag
class GetProjectsByTagOrTitleView(APIView):
    def get(self, request, word):
        returned_projects = []
        # tag = Tag.objects.filter(name=request.data['keyword']).first()
        tag = Tag.objects.filter(name__contains=word).first()
        if tag:
            projects = Project.objects.filter(tags=tag.id).values()
        else:
            # projects = Project.objects.filter(title=request.data['keyword']).values()
            projects = Project.objects.filter(title__contains=word).values()
        returned_projects = ProjectListView.get_user_dict(self, projects)
        return Response(returned_projects)


class GetProjectComments(APIView):
    def get(self, request, id):
        comments = Comment.objects.filter(project_id=id).values()
        returned_comments = []
        for comment in comments:
            user = User.objects.filter(id=comment['user_id']).first()
            returned_comments.append({**comment, 'user': {'id': user.id, 'name': f"{user.first_name} {user.last_name}", 'profile_picture': str(user.profile_picture)}})
        return Response(returned_comments)

