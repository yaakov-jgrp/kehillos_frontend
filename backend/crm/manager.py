import datetime
from typing import Union, Tuple
from urllib.parse import urlparse
from utils.helper import NetfreeAPI,replace_placeholders,send_email_with_template
from django.conf import settings
import logging

cronjob_email_log = logging.getLogger('cronjob-email')

class ActionPriorityQueue:
    def __init__(self):
        self.queue = []

    def add_action(self, action: str, duration: Union[int, None],label:str):
        rank = self.calculate_rank(action, duration)
        self.queue.append((action, duration, rank,label))

    def calculate_rank(self, action: str, duration: Union[int, None]) -> int:
        base_ranks = {
            'Send email template': 1,
            'Open URL for':2,
            'Open URL': 3,
            'Open Domain for':4,
            'Open Domain': 5,

        }

        return base_ranks.get(action, 1)

    def get_strictest_action(self) -> Tuple[str, Union[int, None]]:
        # Sort the queue by rank in ascending order
        self.queue.sort(key=lambda x: (x[2], x[1] if x[0] in ('Open URL for', 'Open Domain for') else None))
        # Return the action and duration of the tuple with the lowest rank
        if self.queue:
            return self.queue[0][0], self.queue[0][1],self.queue[0][3]
        else:
            return '', None

class EmailRequestProcessor:
    def __init__(self,email_request):
        self.email_request = email_request
        self.action_priority_queue = ActionPriorityQueue()
        self.netfree_api = NetfreeAPI()
    def send_mail(self, template_name):
        from crm.models import EmailTemplate,SMTPEmail
        try:
            template = EmailTemplate.objects.filter(name=template_name).first()
            if template:
                instance = SMTPEmail.objects.last()
                settings.EMAIL_HOST_USER = instance.email
                settings.EMAIL_HOST_PASSWORD = instance.password
                subject = self.email_request.id
                to_email = self.email_request.sender_email
                template_name = "email.html"
                admin_email = instance.email
                format_variables = {
                    "request_id": str(self.email_request.id),
                    "client_name": self.email_request.username,
                    "client_email": self.email_request.sender_email,
                    "admin_email": admin_email,
                    "domain_requested": self.email_request.requested_website,
                }
                context = {
                    "your_string": replace_placeholders(template.html, format_variables)
                }
                if template.email_to == "admin_email":
                    to_email = admin_email

                send_email_with_template(subject, to_email, template_name, context)
                # cronjob_email_log.info(f"customer id : {self.customer_id}. email send to : {to_email}. domain_requested : {self.requested_website}. template id and name : {template.id}/{template.name}")
                return True
        except Exception as e:
            # cronjob_email_log.error(f"customer id : {self.customer_id}. error while sending mail : {e}")
            pass
        return False
    def calculate_future_timestamp(self,amount, condition,current_datetime):
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

    def sync_data_with_netfree(self,urls):
        user_all_urls = urls
        user_detail = self.netfree_api.get_user_deatils(self.email_request.customer_id)
        if user_detail.status_code == 200:
            data = user_detail.json()
            cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. customer data : {str(data)}")
            user_urls = data.get("inspectorSettings", {}).get("urls",[])
            user_all_urls += user_urls
            res = self.netfree_api.post_user_data(self.email_request.customer_id,user_all_urls,data)
            if res.status_code == 200:
                return True
        else:
            return False
    def convert_condition_to_minutes(self,amount,condition):
        if condition == "Minutes":
            return amount
        elif condition == "Hours":
            return amount * 60
        elif condition == "Days":
            return amount * 60 * 24
        elif condition == "Weeks":
            return amount * 60 * 24 * 7
        else:
            raise ValueError("Invalid condition. Use 'Minutes', 'Hours', 'Days', or 'Weeks'.")
    def open_domain(self,label,url,amount,current_datetime):
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

            if label == "Open Domain for":
                timestamp = self.calculate_future_timestamp(amount,"Minutes",current_datetime)
                data.update({'exp':timestamp})
            return data
        except Exception as e:
            print(e)
            return False
    def is_domain_or_full_url(self,input_str):
        try:
            parsed_url = urlparse(input_str)
            if parsed_url.netloc and not parsed_url.path:
                return "Open Domain"
            elif parsed_url.netloc and parsed_url.path:
                return "Open URL"
            else:
                return "Invalid Input"
        except ValueError:
            return "Invalid Input"
    def find_categories_by_url_or_domain(self, url_or_domain: str):
        from crm.models import Actions,Categories
        res = self.netfree_api.search_category(url_or_domain)
        categories_list = []
        categories_data = {}
        if res.status_code == 200:
            try:
                keys = res.json()["tagValue"]["tags"].keys()
                categories_list = list(map(int, keys))
            except Exception as e:
                categories_list = []
        categories_obj = Categories.objects.filter(
                categories_id__in=[int(i) for i in categories_list]
            )
        empty = True
        data = {}
        for i in categories_obj:
            data.update({i.id:[]})
            actions = Actions.objects.filter(category=i)
            if actions.exists():
                empty = False
                for action in actions:
                    if "Send email template" in action.label:
                        data.get(i.id).append({"url":action.label,"rule":"Send email template","exp":action.label.split("Send email template")[-1].strip(),'label':action.label})
                    if "Open URL" in action.label:
                        data2 = {"url":action.label,"rule":"Open URL",'label':action.label}
                        if len(action.label.split("Open URL for"))==2:
                            amount_time = action.label.split("Open URL for")[1].strip().split(" ")
                            timestamp = self.convert_condition_to_minutes(int(amount_time[0]),amount_time[1])
                            data2.update({"rule":"Open URL for",'exp':timestamp})
                        data.get(i.id).append(data2)

                    if "Open Domain" in action.label:
                        data2 = {"url":action.label,"rule":"Open Domain",'label':action.label}
                        if len(action.label.split("Open Domain for"))==2:
                            amount_time = action.label.split("Open Domain for")[1].strip().split(" ")
                            timestamp = self.convert_condition_to_minutes(int(amount_time[0]),amount_time[1])
                            data2.update({"rule":"Open Domain for",'exp':timestamp})
                        print(data2)
                        data.get(i.id).append(data2)
            if empty:
                actions = Actions.objects.filter(is_default=True,category=None)
                if actions.exists():
                    data.update({"default":[]})
                    empty = False
                    for action in actions:
                        if "Send email template" in action.label:
                            data.get(i.id).append({"url":action.label,"rule":"Send email template","exp":action.label.split("Send email template")[-1].strip(),'label':action.label})
                        if "Open URL" in action.label:
                            data2 = {"url":action.label,"rule":"Open URL",'label':action.label}

                            if len(action.label.split("Open URL for"))==2:
                                amount_time = action.label.split("Open URL for")[1].strip().split(" ")
                                timestamp = self.convert_condition_to_minutes(int(amount_time[0]),amount_time[1])
                                data2.update({"rule":"Open URL for",'exp':timestamp})
                            data.get(i.id).append(data2)

                        if "Open Domain" in action.label:
                            data2 = {"url":action.label,"rule":"Open Domain",'label':action.label}

                            if len(action.label.split("Open Domain for"))==2:
                                amount_time = action.label.split("Open Domain for")[1].strip().split(" ")
                                timestamp = self.convert_condition_to_minutes(int(amount_time[0]),amount_time[1])
                                data2.update({"rule":"Open Domain for",'exp':timestamp})
                            data.get(i.id).append(data2)
            categories_data.update(data)
        return categories_data

    def process(self):
        # Use find_categories_by_url_or_domain to get all actions and durations associated with the URL or domain
        categories_data = self.find_categories_by_url_or_domain(self.email_request.requested_website)
        # Populate action_priority_queue by adding these actions and durations using add_action()
        for category, action_duration_list in categories_data.items():
            for action_data in action_duration_list:
                action = action_data.get('rule', '')  # Extract the action from the dictionary
                duration = action_data.get('exp', None)  # Extract the duration from the dictionary
                label = action_data.get('label', None)
                self.action_priority_queue.add_action(action, duration,label)

        # Call get_strictest_action() to find the strictest action and its duration
        strictest_action, strictest_duration,strictest_label = self.action_priority_queue.get_strictest_action()
        all_urls = []
        actions_done = []
        current_datetime = datetime.datetime.now()
        if strictest_action == 'Send email template':
            if self.send_mail(strictest_duration):
                actions_done.append(strictest_label)
        elif strictest_action == 'Open URL':
            open_url_data = self.email_request.open_url("Open URL",self.email_request.requested_website,current_datetime)
            if open_url_data:
                all_urls.append(open_url_data)
                actions_done.append(strictest_label)

        elif strictest_action == 'Open URL for':
            data = {"url":self.email_request.requested_website,
                    "rule":"open"}
            timestamp = self.calculate_future_timestamp(strictest_duration,"Minutes",current_datetime)
            data.update({'exp':timestamp})
            all_urls.append(data)
            actions_done.append(strictest_label)
        elif strictest_action == 'Open Domain for':
            data = self.open_domain('Open Domain for',self.email_request.requested_website,strictest_duration,current_datetime)
            all_urls.append(data)
            actions_done.append(strictest_label)
        elif strictest_action == 'Open Domain':
            data = self.open_domain('Open Domain',self.email_request.requested_website,strictest_duration,current_datetime)
            all_urls.append(data)
            actions_done.append(strictest_label)
        if all_urls:
            if not self.sync_data_with_netfree(all_urls):
                return False
        cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. total urls : {str(all_urls)}")
        cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. strictest_action : {str(strictest_label)}")
        if actions_done:
            self.email_request.action_done = " ,".join(actions_done)
            self.email_request.save()
            cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. total action done : {str(actions_done)}")
            cronjob_email_log.info(f"email request saving process end for customer id : {self.email_request.customer_id} ")
            return True
        return False