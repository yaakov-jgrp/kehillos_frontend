from django.db import models
from crm.models import NetfreeCategoriesProfile
def get_or_create_default_netfree_categories():
    default_netfree_categories, _ = NetfreeCategoriesProfile.objects.get_or_create(is_default=True)
    return default_netfree_categories

# Create your models here.
class NetfreeUser(models.Model):
    user_id = models.CharField(max_length=100,unique=True)
    email = models.CharField(max_length=200,unique=True)
    name = models.CharField(max_length=100, null=True, blank=True,default="")
    full_name = models.CharField(max_length=100, null=True, blank=True,default="")
    first_name = models.CharField(max_length=100, null=True, blank=True,default="")
    last_name = models.CharField(max_length=100, null=True, blank=True,default="")
    phone = models.CharField(max_length=100, null=True, blank=True,default="")
    sector = models.CharField(max_length=100, null=True, blank=True,default="")
    netfree_profile = models.ForeignKey(NetfreeCategoriesProfile,default=1,on_delete=models.SET_DEFAULT,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.user_id} - {str(self.email)}"