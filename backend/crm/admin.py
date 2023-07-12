from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Categories)
admin.site.register(models.Emailrequest)
admin.site.register(models.Actions)
admin.site.register(models.EmailTemplate)
admin.site.register(models.SMTPEmail)