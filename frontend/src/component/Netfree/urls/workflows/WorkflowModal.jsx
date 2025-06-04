// React imports
import React, { useEffect } from "react";

// Third part Imports
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

// UI Components
import ErrorMessage from "../../../common/ErrorMessage";
import CrossIcon from "../../../../assets/images/cross.svg";

// API Services
import workflowRulesServices from "../../../../services/workflowRules";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";

function WorkflowModal({
  setShowModal,
  editWorkflow,
  setEditWorkflow,
  onClick,
  refetchWorkflows,
}) {
  const { t } = useTranslation();

  const defaultValues = {
    workflow_name: "",
    workflow_type: "open",
    frequency: "once",
  };

  const workflowTypeList = [
    {
      id: "open",
      label: t("automation.open"),
    },
    {
      id: "close",
      label: t("automation.close"),
    },
  ];

  const frequencyList = [
    {
      id: "once",
      label: t("automation.once"),
    },
    {
      id: "twice",
      label: t("automation.twice"),
    },
  ];

  const schema = yup.object().shape({
    workflow_name: yup.string().required(t("messages.workflowNameRequired")),

    workflow_type: yup
      .string()
      .oneOf(["open", "close"], t("messages.workflowTypeInvalid"))
      .required(t("messages.workflowTypeRequired")),

    frequency: yup
      .string()
      .oneOf(["once", "twice"], t("messages.frequencyInvalid"))
      .required(t("messages.frequencyRequired")),
  });

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const { mutate: createWorkflowHandler, isPending: isCreatingWorkflow } =
    useMutation({
      mutationKey: ["addWorkflow"],
      mutationFn: (data) => workflowRulesServices.createWorkflow(data),
    });

  const { mutate: editWorkflowHandler, isPending: isEditingWorkflow } =
    useMutation({
      mutationKey: ["editWorkflow"],
      mutationFn: (data) =>
        workflowRulesServices.editWorkflow(data, editWorkflow.id),
    });

  const submitForm = async (data, e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("workflow_name", data.workflow_name);
      formData.append("workflow_type", data.workflow_type);
      formData.append("frequency", data.frequency);
      const res = editWorkflow
        ? editWorkflowHandler(formData, {
            onSuccess: () => {
              reset();
              setShowModal(false);
              onClick();
              toast.success(t("messages.workflowEditSuccess"));
              setEditWorkflow(null);
              refetchWorkflows();
            },
            onError: () => {
              toast.error(t("messages.workflowEditError"));
            },
          })
        : createWorkflowHandler(formData, {
            onSuccess: () => {
              reset();
              setShowModal(false);
              onClick();
              toast.success(t("messages.workflowAddSuccess"));
              setEditWorkflow(null);
              refetchWorkflows();
            },
            onError: () => {
              toast.error(t("messages.workflowAddError"));
            },
          });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editWorkflow) {
      setValue("workflow_name", editWorkflow.workflow_name);
      setValue("workflow_type", editWorkflow.workflow_type);
      setValue("frequency", editWorkflow.frequency);
    }
  }, [editWorkflow]);

  return (
    <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="min-w-300px border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <form
              style={{
                width: "100%",
                position: "relative",
              }}
              method="post"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit((data, e) => submitForm(data, e))}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-b-[#E3E5E6] rounded-t">
                <h3 className="text-lg font-medium">
                  {t(
                    `${
                      editWorkflow
                        ? "netfree.editWorkflow"
                        : "netfree.addWorkflow"
                    }`
                  )}
                </h3>
                <button
                  type="button"
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() => {
                    setEditWorkflow(null);
                    setShowModal(false);
                  }}
                >
                  <img src={CrossIcon} alt="CrossIcon" />
                </button>
              </div>

              <div className="relative px-6 py-3 flex-auto">
                <label className="block text-gray-11 text-md mb-1">
                  {t("automation.workflowName")}
                </label>
                <Controller
                  name="workflow_name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="appearance-none outline-none border rounded-lg w-full py-2 px-2 text-gray-11"
                    />
                  )}
                />
                {errors.workflow_name && (
                  <ErrorMessage message={errors.workflow_name.message} />
                )}
              </div>

              <div className="relative px-6 py-3 flex-auto">
                <label className="block text-gray-11 text-md mb-1">
                  {t("automation.workflowType")}
                </label>
                <Controller
                  name="workflow_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      MenuProps={{
                        sx: {
                          zIndex: 9999,
                        },
                      }}
                      className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                      {...field}
                      placeholder="Select Action"
                    >
                      <MenuItem value={"selectAction"} disabled>
                        {t("netfree.selectAction")}
                      </MenuItem>
                      {workflowTypeList?.map((el) => {
                        return el ? (
                          <MenuItem key={el.id} value={el.id}>
                            {el.label}
                          </MenuItem>
                        ) : null;
                      })}
                    </Select>
                  )}
                />
                {errors.workflow_type && (
                  <ErrorMessage message={errors.workflow_type.message} />
                )}
              </div>
              <div className="relative px-6 py-3 flex-auto">
                <label className="block text-gray-11 text-md mb-1">
                  {t("automation.frequency")}
                </label>
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      MenuProps={{
                        sx: {
                          zIndex: 9999,
                        },
                      }}
                      className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                      {...field}
                      placeholder="Select Action"
                    >
                      <MenuItem value={"selectAction"} disabled>
                        {t("netfree.selectAction")}
                      </MenuItem>
                      {frequencyList?.map((el) => {
                        return el ? (
                          <MenuItem key={el.id} value={el.id}>
                            {el.label}
                          </MenuItem>
                        ) : null;
                      })}
                    </Select>
                  )}
                />
                {errors.frequencyList && (
                  <ErrorMessage message={errors.frequencyList.message} />
                )}
              </div>

              <div className="flex items-center justify-center gap-2 my-4">
                <button
                  className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                  type="button"
                  onClick={() => {
                    setEditWorkflow(null);
                    setShowModal(false);
                  }}
                >
                  {t("netfree.close")}
                </button>
                <button
                  className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                  type="submit"
                >
                  {isCreatingWorkflow || isEditingWorkflow ? (
                    <CircularProgress className="!text-white mt-1" size={16} />
                  ) : (
                    <>{t("netfree.save")}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(WorkflowModal);
