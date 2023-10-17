from clients.models import NetfreeUser
from rest_framework import serializers

class NetfreeUserSerializer(serializers.ModelSerializer):
    netfree_profile = serializers.SerializerMethodField()
    class Meta:
        model = NetfreeUser
        fields = '__all__'
    
    def get_netfree_profile(self,obj):
        return obj.netfree_profile.name