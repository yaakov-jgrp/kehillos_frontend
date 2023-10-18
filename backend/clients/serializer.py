from clients.models import NetfreeUser
from rest_framework import serializers

class NetfreeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetfreeUser
        fields = '__all__'