from django.urls import path
from .views import CreateProjectView, ProjectListView, ProjectDetailsView, CancelProjectView, DonateProjectView, CommentProjectView, ReportProjectView, ReportCommentView, RateProjectView, UpdateProjectView, GetTopFiveProjectsView, GetLatestFiveProjectsView, GetAdminSelectedProjectsView, GetCategoriesView, GetProjectsByCategoryView, GetProjectsByTagOrTitleView, GetProjectComments

urlpatterns = [
    path('', ProjectListView.as_view()),
    path('<int:id>', ProjectDetailsView.as_view()),
    path('create', CreateProjectView.as_view()),
    path('<int:id>/cancel', CancelProjectView.as_view()),
    path('<int:id>/donate', DonateProjectView.as_view()),
    path('<int:id>/comment', CommentProjectView.as_view()),
    path('<int:id>/rate', RateProjectView.as_view()),
    path('<int:id>/update', UpdateProjectView.as_view()),
    path('<int:id>/comments', GetProjectComments.as_view()),
    path('<int:id>/report', ReportProjectView.as_view()),
    path('comment/<int:id>/report', ReportCommentView.as_view()),

    path('top-five', GetTopFiveProjectsView.as_view()),
    path('latest-five', GetLatestFiveProjectsView.as_view()),
    path('admin-selected', GetAdminSelectedProjectsView.as_view()),
    path('categories', GetCategoriesView.as_view()),
    path('<str:name>', GetProjectsByCategoryView.as_view()),
    path('search/<str:word>', GetProjectsByTagOrTitleView.as_view()), # TODO make it query not param
]
