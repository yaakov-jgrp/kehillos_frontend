from clients.models import Block, BlockField, NetfreeUser,Client
from clients.resources import NetfreeUserResource
from django.contrib import admin
from eav.admin import BaseEntityAdmin
from eav.forms import BaseDynamicEntityForm
from import_export import resources
# Register your models here.
from import_export.admin import ImportExportModelAdmin


class PatientAdminForm(BaseDynamicEntityForm):
    model = NetfreeUser

class PatientAdmin(BaseEntityAdmin):
    form = PatientAdminForm

admin.site.register(NetfreeUser, PatientAdmin)
admin.site.register(Block)
admin.site.register(BlockField)
admin.site.register(Client)
# class NetfreeUserAdmin(ImportExportModelAdmin):
#     resource_classes = [NetfreeUserResource]

# admin.site.register(NetfreeUser,NetfreeUserAdmin)