from apscheduler.schedulers.background import BackgroundScheduler
from crm.views import ReadEmail
from apscheduler.triggers.cron import CronTrigger

read_email = ReadEmail()


def test():
    print("JHGYUGYUGU")


def Cronjob():
    scheduler = BackgroundScheduler()
    # scheduler.add_job(test, CronTrigger.from_crontab('* * * * *'))
    scheduler.add_job(read_email.read_email_from_gmail, CronTrigger(minute='*/4'))
    scheduler.start()
