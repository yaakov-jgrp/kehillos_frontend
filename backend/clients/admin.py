from django.contrib import admin
from clients.models import NetfreeUser
from clients.resources import NetfreeUserResource
# Register your models here.
from import_export.admin import ImportExportModelAdmin
from import_export import resources

class NetfreeUserAdmin(ImportExportModelAdmin):
    resource_classes = [NetfreeUserResource]

admin.site.register(NetfreeUser,NetfreeUserAdmin)