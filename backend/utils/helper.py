from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import time
import random
import string
import imaplib
from django.core.mail import send_mail
from django.conf import settings
import json, requests


def send_email_with_template(subject, to_email, template_name, context):
    # Render the HTML template to a string
    html_content = render_to_string(template_name, context)

    # Create the email message
    send_mail(
        subject,
        strip_tags(html_content),
        settings.EMAIL_HOST_USER,
        [to_email],
        html_message=context.get("your_string"),
        fail_silently=True
    )


def generate_unique_string():
    timestamp = str(int(time.time()))
    random_part = "".join(
        random.choices(
            string.ascii_uppercase + string.ascii_lowercase + string.digits, k=2
        )
    )
    unique_string = timestamp[-4:] + random_part
    return unique_string


def gmail_checker(username, password):
    i = imaplib.IMAP4_SSL("imap.gmail.com")
    try:
        i.login(username, password)
        return True
    except:
        return


def replace_placeholders(template, replacements):
    formatted_template = template
    for placeholder, value in replacements.items():
        formatted_template = formatted_template.replace("{" + placeholder + "}", value)
    return formatted_template


def get_user_deatils(user_id):
    url = "https://netfree.link/api/user/get-filter-settings?id=138766"
    login_url = "https://netfree.link/api/user/login-by-password"

    USER_PASSWORD = settings.USER_PASSWORD
    USERNAME = settings.USERNAME

    login_data = {"password": USER_PASSWORD, "phone": USERNAME}
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
    headers["cookie"] = "; ".join([f"{name}={value}" for name, value in cookie.items()])
    tags_response = session.get(url, headers=headers)
    return tags_response


def post_user_data(user_id,tags,urls,filterSettings):
    url = "https://netfree.link/user/ajax/set-filter-settings"
    login_url = "https://netfree.link/api/user/login-by-password"

    USER_PASSWORD = settings.USER_PASSWORD
    USERNAME = settings.USERNAME

    login_data = {"password": USER_PASSWORD, "phone": USERNAME}
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
    payload = {
        "id":int(user_id),
        "filterSettings": filterSettings,
        "inspectorSettings": {'tagsList': tags, 'urls': urls }
    }
    print(payload)
    session = requests.Session()
    login_response = session.post(login_url, headers=headers, json=login_data)
    cookie = login_response.cookies.get_dict()
    headers["cookie"] = "; ".join([f"{name}={value}" for name, value in cookie.items()])
    tags_response = session.post(url, headers=headers,json=payload)
    return tags_response

def remove_duplicate_combinations(data):
    seen_combinations = set()
    final_list = []

    for entry in data:
        url = entry['url']
        rule = entry['rule']
        exp = entry.get('exp')
        combination = (url, rule)
        if exp:
            combination = (url, rule,exp)

        if combination not in seen_combinations:
            seen_combinations.add(combination)
            final_list.append(entry)

    return final_list