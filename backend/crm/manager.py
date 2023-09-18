import datetime
from typing import Union, Tuple
from urllib.parse import urlparse
from utils.helper import NetfreeAPI,replace_placeholders,send_email_with_template
from django.conf import settings
import logging

cronjob_email_log = logging.getLogger('cronjob-email')

class EmailRequestProcessor:
    def __init__(self,email_request):
        self.email_request = email_request
        self.netfree_api = NetfreeAPI()
        self.category_count = 0
        self.default = False
        self.all_urls = []
        self.actions_done = []
        self.base_ranks = {
            'Open URL for':2,
            'Open URL': 3,
            'Open Domain for':4,
            'Open Domain': 5,

        }

    def update_usernmae_or_email(self):
        user_detail = self.netfree_api.get_user(self.email_request.customer_id)
        if user_detail.status_code == 200:
            data = user_detail.json()
            data = data.get('users',[])
            if len(data)>0:
                client_name = data[0].get('full_name',"")
                client_email = data[0].get("email","")
                self.email_request.username = client_name
                self.email_request.sender_email = client_email
                self.email_request.save()
                cronjob_email_log.info(f"user data id  name: {client_name} {client_email}.{user_detail} customer data : {str(data)}")

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
                client_email = self.email_request.sender_email

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
                if template.email_to == "client_email":
                    to_email = client_email
                    if client_email=="":
                        to_email = admin_email


                subject = replace_placeholders(template.subject, format_variables)

                send_email_with_template(subject, to_email, template_name, context)
                cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. email send to : {to_email}. domain_requested : {self.email_request.requested_website}. template id and name : {template.id}/{template.name}")
                return True
        except Exception as e:
            cronjob_email_log.error(f"customer id : {self.email_request.customer_id}. error while sending mail : {e}")
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
            cronjob_email_log.error(f"customer id : {self.email_request.customer_id}. error while open domain : {e}")
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
        self.category_count = categories_obj.count()
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
                        data.get(i.id).append(data2)
        if empty:
            actions = Actions.objects.filter(is_default=True,category=None)
            self.default = True
            if actions.exists():
                data.update({"default":[]})
                empty = False
                for action in actions:
                    if "Send email template" in action.label:
                        data.get('default').append({"url":action.label,"rule":"Send email template","exp":action.label.split("Send email template")[-1].strip(),'label':action.label})
                    if "Open URL" in action.label:
                        data2 = {"url":action.label,"rule":"Open URL",'label':action.label}
                        if len(action.label.split("Open URL for"))==2:
                            amount_time = action.label.split("Open URL for")[1].strip().split(" ")
                            timestamp = self.convert_condition_to_minutes(int(amount_time[0]),amount_time[1])
                            data2.update({"rule":"Open URL for",'exp':timestamp})
                        data.get('default').append(data2)
                    if "Open Domain" in action.label:
                        data2 = {"url":action.label,"rule":"Open Domain",'label':action.label}
                        if len(action.label.split("Open Domain for"))==2:
                            amount_time = action.label.split("Open Domain for")[1].strip().split(" ")
                            timestamp = self.convert_condition_to_minutes(int(amount_time[0]),amount_time[1])
                            data2.update({"rule":"Open Domain for",'exp':timestamp})
                        data.get('default').append(data2)
        categories_data.update(data)
        return categories_data
    def has_data_in_single_key(self,d):
        data_count = 0
        categories_key = False

        for key, value in d.items():
            if isinstance(value, list) and len(value) > 0:
                categories_key = key
                data_count += 1
                if data_count > 1:
                    return False,False # Data in more than one key

        return data_count == 1,categories_key
    def cate_process(self,categories):
        current_datetime = datetime.datetime.now()
        for action_data in categories:
            action = action_data.get('rule', '')  # Extract the action from the dictionary
            duration = action_data.get('exp', None)  # Extract the duration from the dictionary
            label = action_data.get('label', None)
            if action == 'Send email template':
                if self.send_mail(label.split("Send email template")[-1].strip()):
                    self.actions_done.append(label)
            elif action == 'Open URL':
                open_url_data = self.email_request.open_url("Open URL",self.email_request.requested_website,current_datetime)
                if open_url_data:
                    self.all_urls.append(open_url_data)
                    self.actions_done.append(label)

            elif action == 'Open URL for':
                data = {"url":self.email_request.requested_website,
                            "rule":"open"}
                timestamp = self.calculate_future_timestamp(duration,"Minutes",current_datetime)
                data.update({'exp':timestamp})
                self.all_urls.append(data)
                self.actions_done.append(label)
            elif action == 'Open Domain for':
                data = self.open_domain('Open Domain for',self.email_request.requested_website,duration,current_datetime)
                self.all_urls.append(data)
                self.actions_done.append(label)
            elif action == 'Open Domain':
                data = self.open_domain('Open Domain',self.email_request.requested_website,duration,current_datetime)
                self.all_urls.append(data)
                self.actions_done.append(label)
        return True

    def calculate_min_rank(self,data_list):
        def custom_sort(item):
            rule_value = item['rule']
            exp_value = item.get('exp', 0)
            base_rank = self.base_ranks.get(rule_value, 0)
            return (base_rank, exp_value)
        for key, value_list in data_list.items():
            value_list.sort(key=custom_sort)
        min_exp_value = float('inf')  # Set to positive infinity initially
        min_exp_value_domain = float('inf')
        corresponding_keys = set({})  # Use a set to store keys with the same minimum 'exp' value

        # Iterate through the dictionaries to find the minimum 'exp' value and corresponding keys
        for key, item_list in data_list.items():
            for item in item_list:
                if item['rule'] == "Open URL for" and item['exp'] < min_exp_value:
                    min_exp_value = item['exp']
                    corresponding_keys.clear()
                    corresponding_keys.add(key) # Start a new set with the current key
                elif item['rule'] == "Open URL for" and item['exp'] == min_exp_value:
                    corresponding_keys.add(key)  # Add the current key to the set
        # Only keep the corresponding_keys set if it contains more than one key
        if len(corresponding_keys) == 1:
                return list(corresponding_keys)[0]

        if len(corresponding_keys) > 1 or len(corresponding_keys) ==0 :
            result_set = corresponding_keys.copy()
            corresponding_key = set({}) 
            for i in result_set if len(corresponding_keys) > 1 else data_list :
                for item_list in data_list.get(i):
                    if item_list['rule'] == "Open URL":
                        corresponding_key.add(i)
            if len(corresponding_key) > 1:
                corresponding_keys = corresponding_key.copy()
            elif len(corresponding_key) == 1:
                return list(corresponding_key)[0] 
        elif len(corresponding_keys) == 1:
                return list(corresponding_keys)[0]

        result_set = corresponding_keys.copy()
        corresponding_key = set({})

        for i in result_set if len(corresponding_keys) > 1 else data_list:
            for item in data_list.get(i):
                if item['rule'] == "Open Domain for" and item['exp'] < min_exp_value_domain:
                    min_exp_value_domain = item['exp']
                    corresponding_key.clear()
                    corresponding_key.add(i)
                elif item['rule'] == "Open Domain for" and item['exp'] == min_exp_value_domain:
                    corresponding_key.add(i)

        if len(corresponding_key) > 1:
            corresponding_keys = corresponding_key.copy()
        elif len(corresponding_key) == 1:
            return list(corresponding_key)[0] 

        if len(corresponding_keys) > 1 or len(corresponding_keys) ==0:
            result_set = corresponding_keys.copy()
            corresponding_key = set({}) 
            for i in result_set if len(corresponding_keys) > 1 else data_list:
                for item_list in data_list.get(i):
                    if item_list['rule'] == "Open Domain":
                        corresponding_key.add(i)  # Add the current key to the set
            if len(corresponding_key) > 1:
                return list(corresponding_key)[0] 
            elif len(corresponding_key) == 1:
                return list(corresponding_key)[0] 
        return False
    def process(self):
        cronjob_email_log.debug(f"Requested id : {str(self.email_request.id)}")
        self.update_usernmae_or_email()
        # Use find_categories_by_url_or_domain to get all actions and durations associated with the URL or domain
        categories_data = self.find_categories_by_url_or_domain(self.email_request.requested_website)
        single,cate_key = self.has_data_in_single_key(categories_data)
        cronjob_email_log.debug(f"customer id : {self.email_request.customer_id}. categories_data : {str(categories_data)}")
        cronjob_email_log.debug(f"customer id : {self.email_request.customer_id}. signle categories key  :{single} {str(cate_key)}")
        if single:
            if self.cate_process(categories_data.get(cate_key)):
                if self.all_urls:
                    if not self.sync_data_with_netfree(self.all_urls):
                        cronjob_email_log.debug(f"customer id : {self.email_request.customer_id}. data sync faild  requested id : {str(self.email_request.id)}")
                        return False
                if self.actions_done:
                    self.email_request.action_done = " ,".join(self.actions_done)
                    self.email_request.save()
                    cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. total action done : {str(self.actions_done)}")
                    cronjob_email_log.info(f"email request saving process end for customer id : {self.email_request.customer_id} ")
                    return True
                
        if not single and self.category_count>0:
            lowest_rank_key = self.calculate_min_rank(categories_data)
            cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. lowest_rank_key : {str(lowest_rank_key)}")
            if lowest_rank_key and self.cate_process(categories_data.get(lowest_rank_key)):
                if self.all_urls:
                    if not self.sync_data_with_netfree(self.all_urls):
                        cronjob_email_log.debug(f"customer id : {self.email_request.customer_id}. data sync faild  requested id : {str(self.email_request.id)}")
                        return False
                if self.actions_done:
                    self.email_request.action_done = " ,".join(self.actions_done)
                    self.email_request.save()
                    cronjob_email_log.info(f"customer id : {self.email_request.customer_id}. total action done : {str(self.actions_done)}")
                    cronjob_email_log.info(f"email request saving process end for customer id : {self.email_request.customer_id} ")
                    return True
        return False