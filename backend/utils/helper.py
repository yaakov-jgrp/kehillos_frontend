from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import time
import random
import string
import imaplib


def send_email_with_template(subject, to_email, template_name, context):
    # Render the HTML template to a string
    html_content = render_to_string(template_name, context)

    # Create the email message
    email = EmailMultiAlternatives(subject, strip_tags(html_content), to=[to_email])
    email.attach_alternative(html_content, "text/html")

    # Send the email
    email.send()


def generate_unique_string():
    timestamp = str(int(time.time()))
    random_part = ''.join(
        random.choices(
        string.ascii_uppercase + string.ascii_lowercase + string.digits, k=2
    ))
    unique_string = timestamp[-4:] + random_part
    return unique_string


def gmail_checker(username, password):
    i=imaplib.IMAP4_SSL('imap.gmail.com')
    try:
        i.login(username, password)
        return True
    except:
        return