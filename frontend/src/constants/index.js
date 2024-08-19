import { formatDate } from "../utils/helpers";

export const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
export const REFRESH_TOKEN_KEY = "REFRESH_TOKEN";
export const DEFAULT_LANGUAGE = "DEFAULT_LANGUAGE";
export const USER_DETAILS = "user_details";
export const ACTIVE_FORM = {
  id: Math.random() + Date.now(),
  isPined: false,
  name: "",
  description: "",
  blocks: [],
  fields: [],
  conditions: [],
  createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
  lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
};
export const FORM_FIELD_CONDITIONS = {
  date: [
    { id: 1, name: "Equals", slug: "equals" },
    { id: 2, name: "Not Equals", slug: "not_equals" },
    { id: 3, name: "Is Before", slug: "is_before" },
    { id: 4, name: "Is After", slug: "is_after" },
    { id: 5, name: "Today", slug: "today" },
    { id: 6, name: "Current Week", slug: "current_week" },
    { id: 7, name: "Current Month", slug: "current_month" },
    { id: 8, name: "Last 3 Months", slug: "last_three_months" },
    { id: 9, name: "Last 1 Month", slug: "last_one_month" },
    { id: 10, name: "Tomorrow", slug: "tomorrow" },
    { id: 11, name: "Next Month", slug: "next_month" },
  ],
  other: [
    { id: 1, name: "Equals", slug: "equals" },
    { id: 2, name: "Not Equals", slug: "not_equals" },
    { id: 3, name: "Starts With", slug: "starts_with" },
    { id: 4, name: "Doesn't Starts With", slug: "not_starts_with" },
    { id: 5, name: "Ends With", slug: "ends_with" },
    { id: 6, name: "Doesn't Ends With", slug: "not_ends_with" },
    { id: 7, name: "Contains", slug: "contains" },
    { id: 8, name: "Doesn't Contains", slug: "not_contains" },
    { id: 9, name: "Is empty", slug: "is_empty" },
    { id: 10, name: "Is not empty", slug: "is_not_empty" },
  ],
};

export const CLIENTS = {
  data: {
    success: true,
    field: [
      {
        last_form_date: "Last form date",
      },
      {
        marksheet: "Marksheet",
      },
      {
        age: "Age",
      },
      {
        hok_donor: "Hok donor",
      },
      {
        first_name_4: "First name",
      },
      {
        "style_-_source": "Style - source",
      },
      {
        car: "Car",
      },
      {
        language_at_home: "Language at home",
      },
      {
        "husband's_occupation": "Husband's occupation",
      },
      {
        "woman's_occupation": "Woman's occupation",
      },
      {
        "first_name_-_owner": "First name - owner",
      },
      {
        "first_name_-_woman": "First name - woman",
      },
      {
        "b.r.": "B.r.",
      },
      {
        home_phone_1: "Home phone",
      },
      {
        woman_phone: "Woman phone",
      },
      {
        email: "Email",
      },
      {
        home_phone: "Home phone",
      },
      {
        city: "City",
      },
      {
        street: "Street",
      },
      {
        house_number: "House number",
      },
      {
        personnel_id_plus: "Personnel id plus",
      },
      {
        "שווער_-_חתן": "שווער - חתן",
      },
      {
        parent_id_number: "Parent id number",
      },
      {
        mom_id_number: "Mom id number",
      },
      {
        zip_code: "Zip code",
      },
      {
        children_at_home: "Children at home",
      },
      {
        married_children: "Married children",
      },
      {
        full_name: "Full name",
      },
      {
        email_1: "Email",
      },
      {
        first_name: "First name",
      },
      {
        last_name_1: "Last name",
      },
    ],
    data: [
      {
        last_form_date: "2023-03-16T08:23:32Z",
        marksheet: "",
        age: "",
        hok_donor: "",
        first_name_4: "",
        "style_-_source": "",
        car: true,
        language_at_home: "",
        "husband's_occupation": "",
        "woman's_occupation": "",
        "first_name_-_owner": "יצחק יעקב",
        "first_name_-_woman": "",
        "b.r.": "",
        home_phone_1: "+972583230207",
        woman_phone: "+972583230205",
        email: "012yyh@gmail.com",
        home_phone: "+97225630349",
        city: "ירושלים",
        street: "אלקנה",
        house_number: "14",
        personnel_id_plus: "",
        "שווער_-_חתן": "",
        parent_id_number: "",
        mom_id_number: "",
        zip_code: "",
        children_at_home: "",
        married_children: "",
        full_name: "",
        email_1: "",
        first_name: "",
        last_name_1: "",
        id: 2,
        netfree_profile: 1,
        last_name: "הרשברג",
        submit_form_4014: true,
      },
      {
        last_form_date: "2023-12-06T11:01:01.920000Z",
        marksheet: "",
        age: "",
        hok_donor: false,
        first_name_4: "",
        "style_-_source": "",
        car: "",
        language_at_home: "",
        "husband's_occupation": "",
        "woman's_occupation": "",
        "first_name_-_owner": "משה",
        "first_name_-_woman": "שרה",
        "b.r.": "",
        home_phone_1: "+97232561236",
        woman_phone: "+972536547896",
        email: "rctrlaltdel@gmail.com",
        home_phone: "+972586453215",
        city: "בני ברק",
        street: "יזון איש",
        house_number: "15",
        personnel_id_plus: "",
        "שווער_-_חתן": "",
        parent_id_number: "",
        mom_id_number: "",
        zip_code: "",
        children_at_home: "",
        married_children: "",
        full_name: "",
        email_1: "",
        first_name: "",
        last_name_1: "",
        id: 3,
        netfree_profile: 2,
        submit_form_4014: false,
        last_name: "שרה",
      },
      {
        last_form_date: "",
        marksheet: "",
        age: "",
        hok_donor: true,
        first_name_4: "",
        "style_-_source": "",
        car: "",
        language_at_home: "",
        "husband's_occupation": "",
        "woman's_occupation": "",
        "first_name_-_owner": "יוחנן",
        "first_name_-_woman": "חנה",
        "b.r.": "",
        home_phone_1: "+972533109179",
        woman_phone: "+972556736906",
        email: "b1225425@gmail.com",
        home_phone: "",
        city: "בני ברק",
        street: "אמרי ברוך",
        house_number: "",
        personnel_id_plus: "",
        "שווער_-_חתן": "",
        parent_id_number: "",
        mom_id_number: "",
        zip_code: "",
        children_at_home: "",
        married_children: "",
        full_name: "",
        email_1: "",
        first_name: "",
        last_name_1: "",
        id: 4,
        netfree_profile: 3,
        last_name: "טווערסקי",
        submit_form_4014: false,
      },
    ],
    page: 1,
    num_pages: 1,
    next: null,
    previous: null,
    count: 3,
  },
};
