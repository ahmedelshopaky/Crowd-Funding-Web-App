from pyexpat import model
from django.db import models
from users.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# class Rate(models.Model):
#     class RateChoices(models.IntegerChoices):
#         POOR = 1
#         FAIR = 2
#         GOOD = 3
#         VERYGOOD = 4
#         EXCELLENT = 5

#     rate = models.IntegerField(choices=RateChoices.choices, unique=True, primary_key=True)

#     def __str__(self):
#         return f"Rate ({self.rate})"


class Project(models.Model):
    
    def end_time_validation(value):
        if value < timezone.now():
            # datetime.now().replace(tzinfo=timezone.utc)
            raise ValidationError("Invalid end time!")
        return value

    title = models.CharField(max_length=100, unique=True)
    details = models.CharField(max_length=255)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(validators=[end_time_validation])
    total_target = models.DecimalField(decimal_places=3, max_digits=19) # store numbers up to approximately one billion
    # donations = models.DecimalField(default=0, decimal_places=3, max_digits=19)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    tags = models.ManyToManyField(Tag)
    thumbnail = models.ImageField(upload_to="projects/static/projects/images")
    is_selected = models.BooleanField(blank=True, null=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        pass


class UserRateProject(models.Model):
    class RateChoices(models.IntegerChoices):
        POOR = 1
        FAIR = 2
        GOOD = 3
        VERYGOOD = 4
        EXCELLENT = 5

    rate = models.IntegerField(choices=RateChoices.choices)
    # rate = models.ForeignKey(Rate, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)


class UserDonation(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True)
    time = models.DateTimeField(auto_now_add=True)
    donation = models.DecimalField(decimal_places=3, max_digits=19)


class Picture(models.Model):
    picture = models.ImageField(
        blank=True, null=True, upload_to="projects/static/images")
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


class Comment(models.Model):
    comment = models.CharField(max_length=255)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
