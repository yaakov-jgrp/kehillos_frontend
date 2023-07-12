from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Actions(models.Model):
    label = models.CharField(max_length=200)
    is_default = models.BooleanField(default=False)


class Categories(models.Model):
    description = models.CharField(max_length=2000)
    actions = models.ManyToManyField(Actions, related_name='categories_action')
    categories_id = models.IntegerField()

# @receiver(post_save, sender=Categories)
# def update_stock(sender, instance, **kwargs):
#     default_action = Actions.objects.
#     instance.actions = 
#     instance.actions.save()


class Emailrequest(models.Model):
    email_id = models.BigIntegerField()
    sender_email = models.CharField(max_length=320)
    username = models.CharField(max_length=100, null=True, default=None)
    text = models.TextField(default="")
    action_done = models.CharField(max_length=500, null=True, default="")
    customer_id = models.CharField(max_length=100)
    ticket_id = models.CharField(max_length=100, null=True, default=None)
    requested_website = models.CharField(max_length=500)
    created_at = models.DateTimeField()


class EmailTemplate(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email_to = models.CharField(max_length=320)
    subject = models.CharField(max_length=100)
    design = models.JSONField()
    html = models.TextField()


class SMTPEmail(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=200)
