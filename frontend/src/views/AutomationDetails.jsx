import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loader from "../component/common/Loader";
import clientsService from "../services/clients";
import automationService from "../services/automation";
import FieldsModal from "../component/automation/FieldsModal";
import EmailModal from "../component/automation/EmailModal";
import ConditonForm from "../component/automation/ConditonForm";
import ActionForm from "../component/automation/ActionForm";
// import Scheduled from "../component/automation/Scheduled";
import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function AutomationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [fullFormData, setFullFormData] = useState([]);
  const [action, setAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [actionArray, setActionArray] = useState([]);
  const [editActionData, setEdtActionData] = useState({});
  const [selectedSchedule, setSelectedSchedule] = useState("hourly");
  const [selectedWeekDay, setSelectedWeekDay] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);
  const [time, setTime] = useState("");
  const [specificDate, setSpecificDate] = useState(null);
  const [yearlyDate, setYearlyDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const validationSchema = yup.object().shape({
    workflow_name: yup.string().required("Workflow name is required."),
    workflow_description: yup.string(),
    status: yup.string(),
    time: yup.string().required("Time is required."),
    triggerType: yup.string().required("Trigger type is required."),
    recurrence: yup.string().when("triggerType", {
      is: "updated",
      then: (schema) =>
        schema.required(
          "Recurrence is required when trigger type is 'updated'."
        ),
      otherwise: (schema) => schema.optional(),
    }),
    condition: yup.string(),
    //   .required(
    //     `${t("clients.condition")} ${t("clients.is")} ${t("clients.required")}`
    //   ),
    value: yup
      .string()
      .notRequired(
        `${t("clients.condition")} ${t("clients.value")} ${t("clients.is")} ${t(
          "clients.required"
        )}`
      ),

    filters: yup
      .array()
      .of(
        yup.object().shape({
          field_slug: yup
            .string()
            .required(
              `${t("clients.condition")} ${t("clients.field")} ${t(
                "clients.is"
              )} ${t("clients.required")}`
            ),
          condition: yup
            .string()
            .required(
              `${t("clients.condition")} ${t("clients.is")} ${t(
                "clients.required"
              )}`
            ),
          value: yup
            .string()
            .notRequired(
              `${t("clients.condition")} ${t("clients.value")} ${t(
                "clients.is"
              )} ${t("clients.required")}`
            ),
        })
      )
      .min(1, t("clients.minimumConditions"))
      .required(
        `${t("clients.conditions")} ${t("clients.are")} ${t(
          "clients.required"
        )}`
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      workflow_name: "",
      workflow_description: "",
      status: "active",
      triggerType: "created",
      recurrence: "once",
      frequency: "hourly",
      selectedWeekDay: "Monday",
      selectedDay: 1,
      time: "00:00:00",
      filters: [],
      actions: [],
    },
  });

  // Use watch to observe triggerType changes
  const triggerType = watch("triggerType");
  const filtersData = watch("filters");

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const fetchFullFormData = async () => {
    try {
      const formData = await clientsService.getFullformData();
      let formFields = [];
      formData.data.result.forEach((block) => {
        block.field.forEach((field) => {
          formFields.push(field);
        });
      });

      // Array of objects
      const arr = formFields.map((item) => {
        return {
          [item.field_slug]: item.display,
        };
      });

      // Combine all objects into a single object
      const result = arr.reduce((acc, curr) => Object.assign(acc, curr), {});
      //   const searchFields = arr.reduce((acc, curr) => {
      //     Object.keys(curr).forEach((key) => {
      //       acc[key] = "";
      //     });
      //     return acc;
      //   }, {});
      setFullFormData(formFields);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    // Add the new date only if it's not already selected
    if (!selectedDates.includes(formattedDate)) {
      setSelectedDates([...selectedDates, formattedDate]);
    }
    setCurrentDate(null); // Reset the date picker after selection
  };

  const handleDelete = (dateToDelete) => {
    setSelectedDates(selectedDates.filter((date) => date !== dateToDelete));
  };

  const fetchFilterOptions = async () => {
    setIsLoading(true);
    try {
      const filterOptions = await clientsService.getClientFilterOptions();
      setFilterOptions(filterOptions.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const addConditionHandler = (type) => {
    setConditions((prev) => [
      ...prev,
      {
        id: (Math.random() + 1).toString(36).substring(7),
        attribute: fullFormData[0]?.field_slug,
        condition: "",
        value: "",
        operator: type,
      },
    ]);
  };

  const deleteFilterCondition = (id) => {
    const conditionsData = conditions.filter((item) => item.id !== id);
    setConditions(conditionsData);
    setValue("filters", conditionsData, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleActionArrayManupulation = (
    editData,
    actionArray,
    formDataWithStatus
  ) => {
    if (editData?.id) {
      // Edit mode: update the existing action in the actionArray
      const updatedActions = actionArray.map((action) =>
        action.id === editData.id ? formDataWithStatus : action
      );
      setActionArray(updatedActions);
    } else {
      // Create mode: add a new action
      setActionArray([...actionArray, { ...formDataWithStatus }]);
    }
  };

  const filterFieldConditionUpdate = (type, value, id) => {
    const filteredConditions = conditions;
    const condition = conditions.filter((condition) => id === condition.id)[0];
    const index = conditions.findIndex((condition) => condition.id === id);
    condition[type] = value;
    filteredConditions[index] = condition;
    setConditions((prev) => [...filteredConditions]);
    setValue("filters", filteredConditions, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTimeChange = (newValue) => {
    setTime(newValue);
    // setTime(newValue.target.value);
    // setValue("time", newValue);
  };

  const prepareRequestData = filtersData?.map(({ id, ...rest }) => rest);

  const dateObjects = selectedDates.map((date) => {
    const dateObj = dayjs(date);
    return {
      month: dateObj.month() + 1, // month() is 0-indexed, so we add 1
      day: dateObj.date(),
    };
  });

  const convertToDateStrings = (dates) => {
    return dates.map(({ month, day }) => {
      const year = dayjs().year(); // Assuming current year, change this if necessary
      return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
    });
  };

  const submitFormHandler = async (data, e) => {
    e.preventDefault();
    setIsLoading(true);

    const createPayload = (value) => {
      let payload = {};

      // Conditionally set payload based on dropdown selection
      if (value === "hourly") {
        payload = { frequency: "hourly" };
      } else if (value === "daily") {
        payload = { frequency: "daily", time: time };
      } else if (value === "weekly") {
        payload = {
          frequency: "weekly",
          time: time,
          days_of_week: selectedWeekDay,
        };
      } else if (value === "specific_date") {
        payload = {
          frequency: "specific_date",
          time: time,
          specific_date: specificDate,
        };
      } else if (value === "monthly_by_date") {
        payload = {
          frequency: "monthly_by_date",
          time: time,
          monthly_by_date: selectedDay,
        };
      } else if (value === "yearly_by_date") {
        payload = {
          frequency: "yearly_by_date",
          time: time,
          specific_dates_year: dateObjects,
        };
      }

      return payload;
    };

    console.log('createPayload(data?.frequency, data)',createPayload(data?.frequency, data));
    

    const payload = {
      workflow_name: data?.workflow_name,
      workflow_description: data?.workflow_description,
      Target_module: "Clients",
      status: data?.status,
      trigger_type: data?.triggerType,
      // frequency: data?.frequency,
      ...(data?.triggerType === "updated" && { recurrence: data?.recurrence }),
      ...(data?.triggerType === "scheduled" &&
        createPayload(selectedSchedule)),
      conditions: id ? filtersData : prepareRequestData,
      actions: actionArray?.length ? actionArray : [],
      ...(id && { id: id }),
    };

    console.log('data',data);
    
    const updatePayload = {
      id: id,
      workflow_name: data?.workflow_name,
      workflow_description: data?.workflow_description,
      Target_module: "Clients",
      status: data?.status,
      trigger_type: data?.triggerType,
      ...(data?.triggerType === "updated" && { recurrence: data?.recurrence }),
      ...(data?.triggerType === "scheduled" &&
        createPayload(selectedSchedule, data)),
      conditions: filtersData,
      actions: actionArray?.length ? actionArray : [],
    };
    try {
      const response = id
        ? await automationService.updateWorkflow(id, updatePayload)
        : await automationService.createWorkflow(lang, payload);
      if (response?.status === 200 || response?.status === 201) {
        navigate("/settings/automation");
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error>>>>", error);
      setIsLoading(false);
    }
  };

  const handleActionChange = (value) => {
    setAction(value);
  };

  const handleScheduleChange = (event) => {
    setSelectedSchedule(event.target.value);
    setValue("frequency", event.target.value);
  };
  const handleWeekDayChange = (event) => {
    setSelectedWeekDay(event.target.value);
    setValue("selectedWeekDay", event.target.value);
  };
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setValue("selectedDay", event.target.value);
  };

  console.log('selectedDates',selectedDates);
  

  const fetchAutomationDataById = async () => {
    try {
      const response = await automationService.getAutomationListById(id);
      if (response?.status === 200 || response?.status === 201) {
        setValue("workflow_name", response?.data?.workflow_name);
        setValue("workflow_description", response?.data?.workflow_description);
        setValue("status", response?.data?.status);
        setValue("triggerType", response?.data?.trigger_type);
        setValue("recurrence", response?.data?.recurrence);
        setValue("frequency", response?.data?.frequency);
        setSelectedSchedule(response?.data?.frequency);
        setValue("filters", response?.data?.conditions);
        setConditions(response?.data?.conditions);
        setActionArray(response?.data?.actions);
        setAction("addAction");
        setTime(response?.data?.time);
        setSelectedWeekDay(response?.data?.days_of_week || []);
        setSelectedDates(convertToDateStrings(response?.data?.specific_dates_year) || []);
        console.log("response>>>>>", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAction = (item) => {
    setIsEdit(true);
    setEdtActionData(item);
    setAction(item?.action_type);
  };

  const handleDeleteAction = (id) => {
    const filteredItems = actionArray.filter((item) => item.id !== id);
    setActionArray(filteredItems);
  };

  useEffect(() => {
    fetchFullFormData();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (id) {
      fetchAutomationDataById();
    }
  }, [id]);

  const timeOptions = [
    { label: "12:00 AM", value: "00:00:00" },
    { label: "12:30 AM", value: "00:30:00" },
    { label: "01:00 AM", value: "01:00:00" },
    { label: "01:30 AM", value: "01:30:00" },
    { label: "02:00 AM", value: "02:00:00" },
    { label: "02:30 AM", value: "02:30:00" },
    { label: "03:00 AM", value: "03:00:00" },
    { label: "03:30 AM", value: "03:30:00" },
    { label: "04:00 AM", value: "04:00:00" },
    { label: "04:30 AM", value: "04:30:00" },
    { label: "05:00 AM", value: "05:00:00" },
    { label: "05:30 AM", value: "05:30:00" },
    { label: "06:00 AM", value: "06:00:00" },
    { label: "06:30 AM", value: "06:30:00" },
    { label: "07:00 AM", value: "07:00:00" },
    { label: "07:30 AM", value: "07:30:00" },
    { label: "08:00 AM", value: "08:00:00" },
    { label: "08:30 AM", value: "08:30:00" },
    { label: "09:00 AM", value: "09:00:00" },
    { label: "09:30 AM", value: "09:30:00" },
    { label: "10:00 AM", value: "10:00:00" },
    { label: "10:30 AM", value: "10:30:00" },
    { label: "11:00 AM", value: "11:00:00" },
    { label: "11:30 AM", value: "11:30:00" },
    { label: "12:00 PM", value: "12:00:00" },
    { label: "12:30 PM", value: "12:30:00" },
    { label: "01:00 PM", value: "13:00:00" },
    { label: "01:30 PM", value: "13:30:00" },
    { label: "02:00 PM", value: "14:00:00" },
    { label: "02:30 PM", value: "14:30:00" },
    { label: "03:00 PM", value: "15:00:00" },
    { label: "03:30 PM", value: "15:30:00" },
    { label: "04:00 PM", value: "16:00:00" },
    { label: "04:30 PM", value: "16:30:00" },
    { label: "05:00 PM", value: "17:00:00" },
    { label: "05:30 PM", value: "17:30:00" },
    { label: "06:00 PM", value: "18:00:00" },
    { label: "06:30 PM", value: "18:30:00" },
    { label: "07:00 PM", value: "19:00:00" },
    { label: "07:30 PM", value: "19:30:00" },
    { label: "08:00 PM", value: "20:00:00" },
    { label: "08:30 PM", value: "20:30:00" },
    { label: "09:00 PM", value: "21:00:00" },
    { label: "09:30 PM", value: "21:30:00" },
    { label: "10:00 PM", value: "22:00:00" },
    { label: "10:30 PM", value: "22:30:00" },
    { label: "11:00 PM", value: "23:00:00" },
    { label: "11:30 PM", value: "23:30:00" },
  ];

  return isLoading ? (
    <div className="h-[calc(100vh-210px)] w-full flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <>
      <form onSubmit={handleSubmit((data, e) => submitFormHandler(data, e))}>
        <div className="px-6 py-4 w-full bg-white rounded-3xl shadow-custom">
          <h1 className="text-gray-11 font-medium text-2xl">
            {t("automation.basicInformation")}
          </h1>

          <div className="flex items-center gap-4 my-4">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="workflow_name">
                {t("automation.workflowName")}
              </label>
              <input
                id="workflow_name"
                type="text"
                className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                {...register("workflow_name")}
              />
              {errors.workflow_name && (
                <span className="text-red-500">
                  {errors.workflow_name.message}
                </span>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="workflow_description">
                {t("automation.workflowDescription")}
              </label>
              <input
                id="workflow_description"
                type="text"
                className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                {...register("workflow_description")}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="w-full flex flex-col gap-2">
              <label>{t("automation.status")}</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="w-5 h-5"
                    {...register("status")}
                    value="active"
                  />
                  {t("automation.active")}
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="w-5 h-5"
                    {...register("status")}
                    value="inactive"
                  />
                  {t("automation.inactive")}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 w-full bg-white rounded-3xl shadow-custom mt-2">
          <h1 className="text-gray-11 font-medium text-2xl">
            {t("automation.workflowTrigger")}
          </h1>

          <div className="w-full flex flex-col mt-4 gap-2">
            <label>{t("automation.triggerType")}</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="w-5 h-5"
                  {...register("triggerType")}
                  value="created"
                />
                {t("automation.created")}
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="w-5 h-5"
                  {...register("triggerType")}
                  value="updated"
                />
                {t("automation.updated")}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="w-5 h-5"
                  {...register("triggerType")}
                  value="scheduled"
                />
                {t("automation.scheduled")}
              </label>
            </div>
            {errors.triggerType && (
              <span className="text-red-500">{errors.triggerType.message}</span>
            )}
          </div>

          {triggerType === "scheduled" && (
            <div className=" my-4">
              <label className="">{t("automation.frequency")}</label>
              {/* <Scheduled/> */}
              <div className="flex gap-3 items-center px-6 py-4 w-full bg-white rounded-3xl mt-2">
                <label className="w-1/4">{t("automation.runWorkFlow")}</label>

                {/* MUI Select Dropdown */}
                <FormControl className="w-1/4">
                  {/* <label className="flex items-center gap-2">{t("automation.addAction")}</label> */}
                  <Select
                    value={selectedSchedule}
                    {...register("frequency")}
                    // label={t("automation.addAction")}
                    onChange={handleScheduleChange}
                  >
                    <MenuItem value="hourly">{t("automation.hourly")}</MenuItem>
                    <MenuItem value="daily">{t("automation.daily")}</MenuItem>
                    <MenuItem value="weekly">{t("automation.weekly")}</MenuItem>
                    <MenuItem value="specific_date">
                      {t("automation.specificDate")}
                    </MenuItem>
                    <MenuItem value="monthly_by_date">
                      {t("automation.monthlyByDate")}
                    </MenuItem>
                    <MenuItem value="yearly_by_date">{t("automation.yearly")}</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {selectedSchedule === "weekly" && (
                <div className="flex gap-3 items-center px-6 py-4 w-full bg-white rounded-3xl mt-2">
                  <label className="w-1/4">{t("automation.onTheseDays")}</label>

                  <FormControl className="w-1/4">
                    {/* <label className="flex items-center gap-2">{t("automation.addAction")}</label> */}
                    <Select
                      multiple
                      value={selectedWeekDay}
                      {...register("selectedWeekDay")}
                      // label={t("automation.addAction")}
                      onChange={handleWeekDayChange}
                    >
                      <MenuItem value="Monday">
                        {t("automation.monday")}
                      </MenuItem>
                      <MenuItem value="Tuesday">
                        {t("automation.tuesday")}
                      </MenuItem>
                      <MenuItem value="Wednesday">
                        {t("automation.wednesday")}
                      </MenuItem>
                      <MenuItem value="Thursday">
                        {t("automation.thursday")}
                      </MenuItem>
                      <MenuItem value="Friday">
                        {t("automation.friday")}
                      </MenuItem>
                      <MenuItem value="Saturday">
                        {t("automation.saturday")}
                      </MenuItem>
                      <MenuItem value="Sunday">
                        {t("automation.sunday")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}
              {selectedSchedule === "monthly_by_date" && (
                <div className="flex gap-3 items-center px-6 py-4 w-full bg-white rounded-3xl mt-2">
                  <label className="w-1/4">{t("automation.onTheseDays")}</label>

                  <FormControl className="w-1/4">
                    {/* <label className="flex items-center gap-2">{t("automation.addAction")}</label> */}
                    <Select
                      multiple
                      value={selectedDay}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Set maximum height for the dropdown menu
                          },
                        },
                      }}
                      {...register("selectedDay")}
                      // label={t("automation.addAction")}
                      onChange={handleDayChange}
                    >
                      {[
                        1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                        18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                      ]?.map((i, index) => (
                        <MenuItem key={index} value={i}>
                          {i}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
              {selectedSchedule === "specific_date" && (
                <div className="flex gap-3 items-center px-6 py-4 w-full bg-white rounded-3xl mt-2">
                  <label className="w-1/4">{t("automation.choose_date")}</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="w-1/4"
                      // label="Select Specific Date"
                      value={specificDate}
                      onChange={(newValue) => {
                        setSpecificDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              )}
              {selectedSchedule === "yearly_by_date" && (
                <div className="flex gap-3 items-center px-6 py-4 w-full bg-white rounded-3xl mt-2">
                  <label className="w-1/4">{t("automation.select_date")}</label>
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      // label="Select Specific Date"
                      value={yearlyDate}
                      onChange={(newValue) => {
                        setYearlyDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="w-1/4"
                      label="Select a Date"
                      value={currentDate}
                      onChange={(newValue) => handleDateChange(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedDates.map((date) => (
                      <Chip
                        key={date}
                        label={date}
                        onDelete={() => handleDelete(date)}
                        color="primary"
                      />
                    ))}
                  </Box>
                </div>
              )}
              {selectedSchedule !== "hourly" && (
                <div className="flex gap-3 items-center px-6 py-4 w-full bg-white rounded-3xl mt-2">
                  <label className="w-1/4">{t("automation.atTime")}</label>
                  <div className="w-1/4">
                    {" "}
                    {/* <TimePicker
                      label={t("automation.selectTime")}
                      value={time}
                      onChange={handleTimeChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    /> */}
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        {...register("time")}
                        // ampm={false}
                        openTo="hours"
                        views={["hours", "minutes", "seconds"]}
                        inputFormat="HH:mm:ss"
                        mask="__:__:__"
                        label="Select Time"
                        value={time}
                        onChange={handleTimeChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider> */}
                    <Select
                      labelId="time-select-label"
                      value={time}
                      className="automation-time-dropdown w-full"
                      onChange={handleChange}
                      sx={{ width: "100%" }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Set maximum height for the dropdown menu
                          },
                        },
                      }}
                      // label="Select Time"
                    >
                      {timeOptions.map((time) => (
                        <MenuItem key={time.value} value={time.value}>
                          {time.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <input
                      type="time"
                      value={time}
                      onChange={handleTimeChange}
                      step="1" // Ensures time precision to minutes
                    /> */}
                    {errors.time && (
                      <span className="text-red-500">
                        {errors.time.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {triggerType === "updated" && (
            <div className="flex items-center gap-4 my-4">
              <div className="w-full flex flex-col gap-2">
                <label>{t("automation.recurrence")}</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      {...register("recurrence")}
                      value="once"
                    />
                    {t("automation.once")}
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      {...register("recurrence")}
                      value="every_time"
                    />
                    {t("automation.every_time")}
                  </label>
                </div>
                {errors.recurrence && (
                  <span className="text-red-500">
                    {errors.recurrence.message}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <ConditonForm
          conditions={conditions}
          filterFieldConditionUpdate={filterFieldConditionUpdate}
          fullFormData={fullFormData}
          errors={errors}
          filterOptions={filterOptions}
          deleteFilterCondition={deleteFilterCondition}
          addConditionHandler={addConditionHandler}
        />

        <ActionForm
          action={action}
          handleActionChange={handleActionChange}
          toggleModal={toggleModal}
          lang={lang}
          actionArray={actionArray}
          handleEditAction={handleEditAction}
          handleDeleteAction={handleDeleteAction}
        />

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {t("automation.submit")}
        </button>
      </form>
      {action === "update_fields" && (
        <FieldsModal
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editData={editActionData}
          setEdtActionData={setEdtActionData}
          conditions={conditions}
          fullFormData={fullFormData}
          setShowModal={setAction}
          actionArray={actionArray}
          actionType={action}
          setActionArray={setActionArray}
          handleActionArrayManupulation={handleActionArrayManupulation}
        />
      )}
      {action === "send_email" && (
        <EmailModal
          handleActionArrayManupulation={handleActionArrayManupulation}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editData={editActionData}
          setEdtActionData={setEdtActionData}
          setShowModal={setAction}
          setActionArray={setActionArray}
          actionArray={actionArray}
          actionType={action}
        />
      )}
    </>
  );
}

export default AutomationDetails;
