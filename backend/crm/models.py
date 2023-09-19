from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import requests, json
import datetime
from django.conf import settings
from crm.manager import EmailRequestProcessor
from django.db import transaction
from utils.helper import send_email_with_template, replace_placeholders,NetfreeAPI
import logging

cronjob_email_log = logging.getLogger('cronjob-email')
def calculate_future_timestamp(amount, condition,current_datetime):
    if condition == "Minutes":
        future_datetime = current_datetime + datetime.timedelta(minutes=amount)
    elif condition == "Hours":
        future_datetime = current_datetime + datetime.timedelta(hours=amount)
    elif condition == "Days":
        future_datetime = current_datetime + datetime.timedelta(days=amount)
    elif condition == "Weeks":
        future_datetime = current_datetime + datetime.timedelta(weeks=amount)
    else:
        raise ValueError("Invalid condition. Use 'minute', 'hour', 'day', or 'week'.")

    future_timestamp = int(future_datetime.timestamp() * 1000)
    return future_timestamp

class Categories(models.Model):
    description = models.CharField(max_length=2000)
    categories_id = models.IntegerField()

    def __str__(self):
        return f"{self.description} - {str(self.categories_id)}"

    def search_category(self, params):
        url = "https://netfree.link/api/tags/value/edit/get"
        login_url = "https://netfree.link/api/user/login-by-password"

        USER_PASSWORD = settings.USER_PASSWORD
        USERNAME = settings.USERNAME

        login_data = {"password": USER_PASSWORD, "phone": USERNAME}

        valid_domain = self.find_domain(params)
        domain = (
            valid_domain.json()["foundHost"] if valid_domain.status_code == 200 else ""
        )
        payload = json.dumps({"host": str(domain)})
        headers = {
            "authority": "netfree.link",
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/json",
            "origin": "https://netfree.link",
            "referer": "https://netfree.link/app/",
            "save-data": "on",
            "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        }

        session = requests.Session()
        login_response = session.post(login_url, headers=headers, json=login_data)
        cookie = login_response.cookies.get_dict()
        headers["cookie"] = "; ".join(
            [f"{name}={value}" for name, value in cookie.items()]
        )
        tags_response = session.post(url, headers=headers, data=payload)
        return tags_response

    def find_domain(self, params):
        url = "https://netfree.link/api/tags/search-url"
        login_url = "https://netfree.link/api/user/login-by-password"

        USER_PASSWORD = settings.USER_PASSWORD
        USERNAME = settings.USERNAME

        login_data = {"password": USER_PASSWORD, "phone": USERNAME}

        payload = json.dumps({"search": params})
        headers = {
            "authority": "netfree.link",
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/json",
            "origin": "https://netfree.link",
            "referer": "https://netfree.link/app/",
            "save-data": "on",
            "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        }

        session = requests.Session()
        login_response = session.post(login_url, headers=headers, json=login_data)
        cookie = login_response.cookies.get_dict()
        headers["cookie"] = "; ".join(
            [f"{name}={value}" for name, value in cookie.items()]
        )
        response = session.post(url, headers=headers, data=payload)
        return response


class Actions(models.Model):
    label = models.CharField(max_length=200)
    is_default = models.BooleanField(default=False)
    template = models.BooleanField(default=False)
    email_template = models.ForeignKey('crm.EmailTemplate',on_delete=models.CASCADE,null=True,blank=True)
    category = models.ForeignKey(
        Categories,
        on_delete=models.SET_NULL,
        null=True,
        related_name="action_category",
        blank=True,
        default=None,
    )

    @property
    def get_label(self):
        if "Send email template" in self.label:
            try:
                return self.label+" "+self.email_template.name
            except Exception:
                return self.label
        return self.label


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

    def send_mail(self, template_name):
        try:
            template = EmailTemplate.objects.filter(name=template_name).first()
            if template:
                instance = SMTPEmail.objects.last()
                settings.EMAIL_HOST_USER = instance.email
                settings.EMAIL_HOST_PASSWORD = instance.password
                subject = self.id
                to_email = self.sender_email
                template_name = "email.html"
                admin_email = instance.email
                format_variables = {
                    "request_id": str(self.id),
                    "client_name": self.username,
                    "client_email": self.sender_email,
                    "admin_email": admin_email,
                    "domain_requested": self.requested_website,
                }
                context = {
                    "your_string": replace_placeholders(template.html, format_variables)
                }
                if template.email_to == "admin_email":
                    to_email = admin_email

                send_email_with_template(subject, to_email, template_name, context)
                cronjob_email_log.info(f"customer id : {self.customer_id}. email send to : {to_email}. domain_requested : {self.requested_website}. template id and name : {template.id}/{template.name}")
                return True
        except Exception as e:
            cronjob_email_log.error(f"customer id : {self.customer_id}. error while sending mail : {e}")
        return False

    def open_url(self,label,url,current_datetime=False):
        try:
            data = {"url":url,
                    "rule":"open"}
            if len(label.split("Open URL for"))==2:
                amount_time = label.split("Open URL for")[1].strip().split(" ")
                timestamp = calculate_future_timestamp(int(amount_time[0]),amount_time[1],current_datetime)
                data.update({'exp':timestamp})
            cronjob_email_log.info(f"customer id : {self.customer_id}. open url : {json.dumps(data)}")
            return data
        except Exception as e:
            print(e)
            cronjob_email_log.error(f"customer id : {self.customer_id}. error while open url : {e}")
            return False

    def open_domain(self,label,url,current_datetime):
        try:
            parts = url.split("://")
            protocol = parts[0] if len(parts) > 1 else None

            if protocol:
                domain_and_path = parts[1]
                domain, path = domain_and_path.split("/", 1)
            else:
                domain, path = parts[0].split("/", 1)

            # Concatenate the protocol and domain
            full_domain = f"{protocol}://{domain}"
            data = {"url":full_domain,
                    "rule":"open"}

            if len(label.split("Open Domain for"))==2:
                amount_time = label.split("Open Domain for")[1].strip().split(" ")
                timestamp = calculate_future_timestamp(int(amount_time[0]),amount_time[1],current_datetime)
                data.update({'exp':timestamp})
            cronjob_email_log.info(f"customer id : {self.customer_id}. open doamin : {json.dumps(data)}")
            return data
        except Exception as e:
            print(e)
            cronjob_email_log.error(f"customer id : {self.customer_id}. error while open domain : {e}")
            return False


@receiver(post_save, sender=Emailrequest)
def email_request_created_or_updated(sender, instance,created, **kwargs):
    if created:
        if hasattr(instance, '_processing'):
            return
        instance._processing = True
        
        with transaction.atomic():
            obj =EmailRequestProcessor(instance)
            if obj.process():
                cronjob_email_log.info(f"email request created for customer id : {instance.customer_id}")
            else:
                cronjob_email_log.info(f"email request created failed for customer id : {instance.customer_id}")
            if hasattr(instance, '_processing'):
                del instance._processing

class EmailTemplate(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email_to = models.CharField(max_length=320)
    subject = models.CharField(max_length=100)
    design = models.JSONField()
    html = models.TextField()
    action = models.ForeignKey(
        Actions, on_delete=models.SET_NULL, null=True, blank=True, default=None
    )


class SMTPEmail(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=200)
