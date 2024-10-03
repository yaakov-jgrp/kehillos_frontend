import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loader from "../component/common/Loader";
import { FormControl, MenuItem, Select } from "@mui/material";
import ErrorMessage from "../component/common/ErrorMessage";
import { IoIosAdd } from "react-icons/io";
import clientsService from "../services/clients";
import BinIcon from "../assets/images/bin.svg";
import SendMail from "../component/automation/SendEmail";
import automationService from "../services/automation";
import UpdateFields from "../component/automation/UpdateFields";

function AutomationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [fullFormData, setFullFormData] = useState(null);
  const [action, setAction] = useState(null);
  const [displayFields, setDisplayFields] = useState([]);
  const [displayFormValues, setDisplayFormValues] = useState({});

  const validationSchema = yup.object().shape({
    workflow_name: yup.string().required("Workflow name is required."),
    workflow_description: yup.string(),
    status: yup.string(),
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
          attribute: yup
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
  // react-hook-form initialization with validation schema
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
      filters: [],
      actions: []
    },
  });

  // Use watch to observe triggerType changes
  const triggerType = watch("triggerType");
  const filtersData = watch("filters");

  console.log("errors", errors);

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
      setDisplayFormValues(result);
      setDisplayFields(formFields);
      setFullFormData(formFields);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("filters????", getValues("filters"));

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

  const submitFormHandler = async (data, e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('data>>>',data);
    
    const payload = {
      workflow_name: data?.workflow_name,
      workflow_description: data?.workflow_description,
      Target_module: "Clients",
      status: data?.status,
      trigger_type: data?.triggerType,
      ...(data?.triggerType === "updated" && { recurrence: data?.recurrence }),
      conditions: filtersData,
      actions: [
        {
          action_title: "send welcome message",
          status: true,
          action_type: "send_email",
          from_email: "myfreeid13@gmail.com",
          to_email: "prashantsainiiftm@gmail.com",
          subject: "testing email",
          design: { id: "gv" },
          html: "this for testing email",
        },
        {
          action_title: "Update fields",
          status: true,
          action_type: "update_fields",
          fields: [
            {
              field_name: "last_name",
              field_value: "test",
            },
          ],
        },
      ],
    };
    try {
      const response = automationService.createWorkflow(lang, payload);
      if (response?.status === 200 || response?.status === 201) {
        console.log('response>>>>>>>>>', response);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('error>>>>',error);
      setIsLoading(false);
      
    }
    // Handle form submission
    console.log("Form Submitted Data:", data);
    
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  useEffect(() => {
    fetchFullFormData();
    fetchFilterOptions();
  }, []);

  return (
    <form onSubmit={handleSubmit((data, e) => submitFormHandler(data, e))}>
      {/* {isLoading && <Loader />} */}
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
          </div>
          {errors.triggerType && (
            <span className="text-red-500">{errors.triggerType.message}</span>
          )}
        </div>

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

      <div className="px-6 py-4 w-full bg-white rounded-3xl shadow-custom mt-2">
        <div className="flex flex-col gap-3">
          <div className="w-full flex flex-col">
            <label
              className={`block break-words capitalize text-gray-11 text-lg font-medium ${
                lang === "he" ? "ml-6" : "mr-6"
              }`}
            >
              {t("clients.conditions")}
            </label>
            <div className="">
              <p className="font-normal text-lg">
                {t("messages.andConditionsMessage")}
              </p>
              {conditions
                ?.filter((item) => item.operator === "AND")
                .map((filterCondition, i) => {
                  return (
                    <div
                      className="flex w-full gap-4 my-2 flex-wrap items-center"
                      key={i}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-normal text-[16px]">
                          {t("netfree.First_Name_Owner")}
                        </p>
                        <FormControl sx={{ minWidth: "200px" }} size="small">
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded-lg outline-none w-full p-2 text-black bg-white"
                            value={filterCondition?.attribute}
                            MenuProps={{
                              sx: {
                                maxHeight: "250px",
                              },
                            }}
                            onChange={(e) =>
                              filterFieldConditionUpdate(
                                "attribute",
                                e.target.value,
                                filterCondition?.id
                              )
                            }
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            {fullFormData
                              .filter(
                                (item) => item?.data_type.value !== "file"
                              )
                              .map((field, i) => (
                                <MenuItem value={field?.field_slug} key={i}>
                                  {field.field_name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors?.filters?.length > 0 &&
                            errors?.filters[0]?.attribute && (
                              <ErrorMessage
                                message={errors?.filters[0]?.attribute.message}
                              />
                            )}
                        </FormControl>
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="font-normal text-[16px]">
                          {t("netfree.Equals")}
                        </p>
                        <FormControl sx={{ minWidth: "200px" }} size="small">
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                            value={filterCondition?.condition}
                            MenuProps={{
                              sx: {
                                maxHeight: "250px",
                              },
                            }}
                            onChange={(e) =>
                              filterFieldConditionUpdate(
                                "condition",
                                e.target.value,
                                filterCondition?.id
                              )
                            }
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            {filterOptions
                              .filter(
                                (filterOption) =>
                                  filterOption.datatype ===
                                  fullFormData.filter(
                                    (field) =>
                                      field?.field_slug ===
                                      filterCondition?.attribute
                                  )[0]?.data_type.value
                              )[0]
                              .conditions?.map((condition, i) => (
                                <MenuItem value={condition?.condition} key={i}>
                                  {condition?.label}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors?.filters?.length > 0 &&
                            errors?.filters[0]?.condition && (
                              <ErrorMessage
                                message={errors?.filters[0]?.condition.message}
                              />
                            )}
                        </FormControl>
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="font-normal text-[16px]">יצחק יעקב</p>
                        <FormControl sx={{ minWidth: "200px" }} size="small">
                          <input
                            className="pl-2 appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full py-[10px] text-gray-11 font-normal"
                            value={filterCondition?.value}
                            onChange={(e) =>
                              filterFieldConditionUpdate(
                                "value",
                                e.target.value,
                                filterCondition?.id
                              )
                            }
                          />
                          {errors?.filters?.length > 0 &&
                            errors?.filters[0]?.value && (
                              <ErrorMessage
                                message={errors?.filters[0]?.value.message}
                              />
                            )}
                        </FormControl>
                      </div>

                      <img
                        src={BinIcon}
                        alt="BinIcon"
                        className="mx-1 self-center text-blueSecondary h-[22px] w-[22px] hover:cursor-pointer"
                        onClick={() =>
                          deleteFilterCondition(filterCondition?.id)
                        }
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          <button
            className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
            onClick={() => addConditionHandler("AND")}
          >
            <IoIosAdd style={{ color: "#0B99FF" }} size="1.5rem" />{" "}
            {t("clients.addCondition")}
          </button>
        </div>

        <div className="border-b border-[#E3E5E6]"></div>

        <div className="flex flex-col gap-3">
          <div className="w-full flex">
            <div className="">
              <p className="font-normal text-lg">
                {t("messages.orConditionsMessage")}
              </p>
              {conditions
                ?.filter((item) => item.operator === "OR")
                .map((filterCondition, i) => {
                  return (
                    <div
                      className="flex w-full gap-4 my-2 flex-wrap items-center"
                      key={i}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-normal text-[16px]">
                          {t("netfree.First_Name_Owner")}
                        </p>
                        <FormControl sx={{ minWidth: "200px" }} size="small">
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                            value={filterCondition?.attribute}
                            MenuProps={{
                              sx: {
                                maxHeight: "250px",
                              },
                            }}
                            onChange={(e) =>
                              filterFieldConditionUpdate(
                                "attribute",
                                e.target.value,
                                filterCondition?.id
                              )
                            }
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            {fullFormData
                              .filter(
                                (item) => item?.data_type.value !== "file"
                              )
                              .map((field, i) => (
                                <MenuItem value={field?.field_slug} key={i}>
                                  {field.field_name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors?.filters?.length > 0 &&
                            errors?.filters[0]?.attribute && (
                              <ErrorMessage
                                message={errors?.filters[0]?.attribute.message}
                              />
                            )}
                        </FormControl>
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="font-normal text-[16px]">
                          {t("netfree.Equals")}
                        </p>
                        <FormControl sx={{ minWidth: "200px" }} size="small">
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                            value={filterCondition?.condition}
                            MenuProps={{
                              sx: {
                                maxHeight: "250px",
                              },
                            }}
                            onChange={(e) =>
                              filterFieldConditionUpdate(
                                "condition",
                                e.target.value,
                                filterCondition?.id
                              )
                            }
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            {filterOptions
                              .filter(
                                (filterOption) =>
                                  filterOption.datatype ===
                                  fullFormData.filter(
                                    (field) =>
                                      field?.field_slug ===
                                      filterCondition?.attribute
                                  )[0]?.data_type.value
                              )[0]
                              .conditions?.map((condition, i) => (
                                <MenuItem value={condition?.condition} key={i}>
                                  {condition?.label}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors?.filters?.length > 0 &&
                            errors?.filters[0]?.condition && (
                              <ErrorMessage
                                message={errors?.filters[0]?.condition.message}
                              />
                            )}
                        </FormControl>
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="font-normal text-[16px]">יצחק יעקב</p>
                        <FormControl sx={{ minWidth: "200px" }} size="small">
                          <input
                            className="pl-2 appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full py-[10px] text-gray-11 font-normal"
                            value={filterCondition?.value}
                            onChange={(e) =>
                              filterFieldConditionUpdate(
                                "value",
                                e.target.value,
                                filterCondition?.id
                              )
                            }
                          />
                          {errors?.filters?.length > 0 &&
                            errors?.filters[0]?.value && (
                              <ErrorMessage
                                message={errors?.filters[0]?.value.message}
                              />
                            )}
                        </FormControl>
                      </div>

                      <img
                        src={BinIcon}
                        alt="BinIcon"
                        className="mx-1 self-center text-blueSecondary h-[22px] w-[22px] hover:cursor-pointer"
                        onClick={() =>
                          deleteFilterCondition(filterCondition?.id)
                        }
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          <button
            className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
            onClick={() => addConditionHandler("OR")}
          >
            <IoIosAdd style={{ color: "#0B99FF" }} size="1.5rem" />{" "}
            {t("clients.addCondition")}
          </button>
        </div>
      </div>
      <div className="px-6 py-4 w-full bg-white rounded-3xl shadow-custom mt-2">
        <FormControl fullWidth>
          <h1 className="text-gray-11 font-medium text-2xl pb-2">
            {t("automation.actions")}
          </h1>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded-lg outline-none w-full p-2 text-black bg-white"
            value={action}
            MenuProps={{
              sx: {
                maxHeight: "250px",
                maxWidth: "250px",
              },
            }}
            onChange={(e) => handleActionChange(e)}
          >
            <MenuItem value="" disabled>
              Select
            </MenuItem>
            <MenuItem value="sendmail">Send Mail</MenuItem>
            <MenuItem value="updateFields">Update Fields</MenuItem>
          </Select>
        </FormControl>
        {action === "sendmail" && <SendMail />}
        {action === "updateFields" && <UpdateFields conditions={conditions} fullFormData={fullFormData}/>}
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        {t("automation.submit")}
      </button>
    </form>
  );
}

export default AutomationDetails;
