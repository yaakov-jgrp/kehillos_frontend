from django.db import models


class Categories(models.Model):
    description = models.CharField(max_length=2000)
    categories_id = models.IntegerField()


class Actions(models.Model):
    label = models.CharField(max_length=200)
    is_default = models.BooleanField(default=False)
    template = models.BooleanField(default=False)
    category = models.ForeignKey(
        Categories, on_delete=models.SET_NULL,
        null=True, related_name="action_category",
        blank=True, default=None
    )


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
    action = models.ForeignKey(
        Actions, on_delete=models.SET_NULL,
        null=True, blank=True, default=None
    )


class SMTPEmail(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=200)
