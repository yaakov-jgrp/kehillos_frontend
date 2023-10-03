from rest_framework import serializers
import re
from crm import models


class EmailrequestSerializer(serializers.ModelSerializer):
    request_type = serializers.CharField(
        default="פתיחת אתר - נטפרי"
    )
    text = serializers.SerializerMethodField()
    action_done = serializers.SerializerMethodField()
    class Meta:
        model = models.Emailrequest
        fields = ["id","email_id","sender_email","username","request_type","text","action_done","customer_id","ticket_id","requested_website","created_at"]

    def get_text(self,obj):
        paragraphs = re.split(r'\n\s*\n', obj.text)
        try:
            return paragraphs[-3]
        except Exception as e:
            return obj.text
    def get_action_done(self,obj):
        lang = self.context.get("lang",'en')
        if lang == 'he':
            obj.action_done = obj.action_done.replace("Send email template","שלח תבנית אימייל").replace("Open Domain for","פתח דומיין עבור").replace("Open Domain","פתח דומיין").replace("Open URL for","פתח כתובת אתר עבור").replace("Open URL","פתח כתובת אתר").replace('Hours','שעה (ות').replace('Minutes','דקות').replace('Days','ימים').replace('Weeks','שבועות')

        return obj.action_done



class ActionsSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    class Meta:
        model = models.Actions
        fields = ("id","label",'email_to_admin','email_to_client','custom_email')

    def get_label(self,obj):
        lang = self.context.get("lang")
        data = obj.localized_label(lang)
        return data

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
        default="פתיחת אתר - נטפרי"
    )
    name = serializers.CharField(
        source="description", default="פתיחת אתר - נטפרי"
    )
    actions = serializers.SerializerMethodField()

    class Meta:
        model = models.Categories
        fields = (
            "categories_id", "name", "actions", "request_type",
        )

    def get_actions(self, instance):
        lang = self.context.get("lang")
        def fill_label(item):
            return {
                "id": item["id"],
                "label": item["label"].format("https://kehillos.com/", "5")} if '{}' in item["label"] else item
        data = instance.action_category.filter(template=False)
        
        data = ActionsSerializer(data, many=True, context = {"lang":lang}).data
        data_filled = list(map(fill_label, data))
        return data_filled


class EmailTemplateSchema(serializers.Serializer):
    name = serializers.CharField()
    email_to = serializers.CharField()
    subject = serializers.CharField()
    body = serializers.JSONField()