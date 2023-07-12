from rest_framework import serializers
from . import models


class EmailrequestSerializer(serializers.ModelSerializer):
    request_type = serializers.CharField(
        default="שתמש בשם"
    )
    action_done = serializers.SerializerMethodField()

    class Meta:
        model = models.Emailrequest
        fields = "__all__"

    def get_action_done(self, instance):
        return models.Actions.objects.last().label


class ActionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Actions
        fields = ("label",)


class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmailTemplate
        exclude = ("html",)


class EmailTemplateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmailTemplate
        fields = ('id', 'name')


class CategoriesSerializer(serializers.ModelSerializer):
    request_type = serializers.CharField(
        default="שתמש בשם"
    )
    name = serializers.CharField(
        source="description", default="שתמש בשם"
    )
    actions = serializers.SerializerMethodField()

    class Meta:
        model = models.Categories
        fields = (
            "categories_id", "name", "actions", "request_type",
        )

    def get_actions(self, instance):
        return instance.actions.filter(is_default=0).values_list("label", flat=True)


class EmailTemplateSchema(serializers.Serializer):
    name = serializers.CharField()
    email_to = serializers.CharField()
    subject = serializers.CharField()
    body = serializers.JSONField()