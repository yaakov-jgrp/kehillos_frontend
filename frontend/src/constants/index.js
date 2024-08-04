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
