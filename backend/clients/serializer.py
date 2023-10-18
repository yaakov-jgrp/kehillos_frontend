from clients.models import NetfreeUser
from rest_framework import serializers

class NetfreeUserSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(max_length=100)
    email = serializers.CharField(max_length=200)
    class Meta:
        model = NetfreeUser
        fields = '__all__'
    def validate_user_id(self, value):
        if NetfreeUser.objects.filter(user_id=value).exists():
            raise serializers.ValidationError(f"This Client with user id {str(value)} already in use.")
        return value

    def validate_email(self, value):
        if NetfreeUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(f"This Client with email {str(value)} already in use.")
        return value