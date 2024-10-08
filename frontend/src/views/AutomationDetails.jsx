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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
      actions: [],
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
      setFullFormData(formFields);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("filters????", getValues("filters"));
  console.log("actionArray", actionArray);

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
  console.log("filtersData>>>", filtersData);

  const prepareRequestData = filtersData?.map(({ id, ...rest }) => rest);

  const submitFormHandler = async (data, e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("data>>>", data);

    // console.log("actionArray", actionArray);

    const payload = {
      workflow_name: data?.workflow_name,
      workflow_description: data?.workflow_description,
      Target_module: "Clients",
      status: data?.status,
      trigger_type: data?.triggerType,
      ...(data?.triggerType === "updated" && { recurrence: data?.recurrence }),
      conditions: id ? filtersData : prepareRequestData,
      actions: actionArray?.length ? actionArray : [],
      ...(id && { id: id }),
    };
    const updatePayload = {
      id: id,
      workflow_name: data?.workflow_name,
      workflow_description: data?.workflow_description,
      Target_module: "Clients",
      status: data?.status,
      trigger_type: data?.triggerType,
      ...(data?.triggerType === "updated" && { recurrence: data?.recurrence }),
      conditions: filtersData,
      actions: actionArray?.length ? actionArray : [],
    };
    try {
      const response = id
        ? await automationService.updateWorkflow(id, updatePayload)
        : await automationService.createWorkflow(lang, payload);
      console.log("response>>>>>>>>>", response);
      if (response?.status === 200 || response?.status === 201) {
        navigate("/settings/automation");
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error>>>>", error);
      setIsLoading(false);
    }
    console.log("Form Submitted Data payload", payload);
  };

  const handleActionChange = (value) => {
    setAction(value);
  };

  const fetchAutomationDataById = async () => {
    try {
      const response = await automationService.getAutomationListById(id);
      if (response?.status === 200 || response?.status === 201) {
        setValue("workflow_name", response?.data?.workflow_name);
        setValue("workflow_description", response?.data?.workflow_description);
        setValue("status", response?.data?.status);
        setValue("triggerType", response?.data?.trigger_type);
        setValue("recurrence", response?.data?.recurrence);
        setValue("filters", response?.data?.conditions);
        setConditions(response?.data?.conditions);
        setActionArray(response?.data?.actions);
        setAction("addAction");
        // setAction(response?.data?.trigger_type);
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
    const filteredItems = actionArray.filter(item => item.id !== id);
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
