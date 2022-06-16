from rest_framework import serializers
from .models import Project, Picture, Comment, UserDonation, Tag, UserRateProject


class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"

class ProjectSerializer(serializers.ModelSerializer):

    tags = serializers.SlugRelatedField(
        slug_field="name",
        many=True,
        read_only=True,
        # required=False
    )

    # category = serializers.SlugRelatedField(
    #     slug_field="name",
    #     read_only=True
    # )

    # user = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = "__all__"
        extra_kwargs = {
            'is_selected': {
                'read_only': True,
            }
        }

    # def create(self, validated_data):
    #     tags = validated_data.pop('tags', [])
    #     instance = self.Meta.model(
    #         **validated_data
    #     )
    #     instance.save()
    #     for tag in tags:
    #         instance.tags.set(tag)
    #     return instance

    def update(self, instance, validated_data):
        if 'user' in validated_data:
            validated_data.pop('user', None)

        instance = super(ProjectSerializer, self).update(
            instance, validated_data)
        return instance


class UserDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDonation
        fields = "__all__"


class UserRateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRateProject
        fields = "__all__"


# class RateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Rate
#         fields = "__all__"
