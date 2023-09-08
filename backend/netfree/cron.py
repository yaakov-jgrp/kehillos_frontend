from apscheduler.schedulers.background import BackgroundScheduler
from crm.views import ReadEmail
from apscheduler.triggers.cron import CronTrigger
import time
import logging
read_email = ReadEmail()


def test():
    print("JHGYUGYUGU")


def run_scheduler():
    try:
        scheduler = BackgroundScheduler()
        # scheduler.add_job(test, CronTrigger.from_crontab('* * * * *'))
        scheduler.add_job(read_email.read_email_from_gmail, CronTrigger(second='*/10'))
        scheduler.start()

        while True:
            # Keep the main thread running
            time.sleep(1)

    except Exception as e:
        # Handle exceptions and log errors
        logging.error(f"Scheduler crashed: {str(e)}")

        # Sleep for a while before restarting (to avoid constant restarts)
        time.sleep(60)  # Sleep for 60 seconds (adjust as needed)
        run_scheduler()  # Restart the scheduler

def Cronjob():
    # Start the scheduler loop in a separate thread
    import threading
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.daemon = True
    scheduler_thread.start()
