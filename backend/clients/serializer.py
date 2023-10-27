from clients.models import BlockField, Client, NetfreeUser
from rest_framework import serializers


class NetfreeUserSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(max_length=100)
    email = serializers.CharField(max_length=200)
    class Meta:
        model = NetfreeUser
        fields = '__all__'
    def validate_user_id(self, value):
        if self.instance is None and NetfreeUser.objects.filter(user_id=value).exists():
            raise serializers.ValidationError(f"This Client with user id {str(value)} already in use.")
        if self.instance and self.instance.user_id != value and NetfreeUser.objects.filter(user_id=value).exists():
            raise serializers.ValidationError(f"This Client with user id {str(value)} already in use.")
        return value

    def validate_email(self, value):
        if self.instance is None and NetfreeUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(f"This Client with email {str(value)} already in use.")
        if self.instance and self.instance.email != value and NetfreeUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(f"This Client with email {str(value)} already in use.")
        return value
    

class ClientAttributeSerializer(serializers.ModelSerializer):
    required = serializers.SerializerMethodField()
    field_name = serializers.SerializerMethodField()
    field_slug = serializers.SerializerMethodField()
    data_type = serializers.SerializerMethodField()
    enum_values = serializers.SerializerMethodField()
    class Meta:
        model = BlockField
        fields = ['id','field_name','field_slug','data_type','enum_values','required','defaultvalue','unique','is_delete','display_order','display']

    def get_field_name(self,obj):
        return obj.attribute.name
    def get_field_slug(self,obj):
        return obj.attribute.slug
    def get_required(self,obj):
        return obj.attribute.required
    def get_data_type(self,obj):
        return obj.attribute.datatype
    def get_enum_values(self,obj):
        if obj.attribute.datatype == "enum":
            values = obj.attribute.get_choices().values_list('id', 'value')
            choices = [('', '-----')] + list(values)
            return {'choices': choices}
        return {}
    
class ClientAttributeSerializerCustom(ClientAttributeSerializer):
    value = serializers.SerializerMethodField()
    class Meta:
        model = BlockField
        fields = ['id','field_name','data_type','enum_values','required','value']
    def get_value(self,obj):
        return ''