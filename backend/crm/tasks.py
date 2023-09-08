from crm.views import ReadEmail

from celery import shared_task

@shared_task
def read_emails():
    print(" task one called and worker is running good")
    obj = ReadEmail()
    obj.read_email_from_gmail()
    return "success"


@shared_task
def task_two():
    return "success"