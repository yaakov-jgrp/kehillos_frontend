import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  TextField,
  IconButton,
  MenuItem,
  Grid,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import BinIcon from "../../assets/images/bin.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CrossIcon from "../../assets/images/cross.svg";
import ToggleSwitch from "../common/ToggleSwitch";
import { useParams } from "react-router-dom";

function FieldsModal({
  setShowModal,
  onClick,
  isEdit,
  setIsEdit,
  editData,
  fullFormData,
  actionType,
  actionArray,
  setActionArray,
  handleActionArrayManupulation,
}) {
  const { t } = useTranslation();

  console.log("editData", editData);
  const { id } = useParams();

  const validationSchema = Yup.object().shape({
    action_title: Yup.string().required("Action Title is required"),
    status: Yup.boolean(),
    fields: Yup.array()
      .of(
        Yup.object().shape({
          field_name: Yup.string().required("Field Name is required"),
          field_value: Yup.string().required("Value is required"),
        })
      )
      .required("At least one action is required"),
  });

  // console.log("editData", editData);
  // console.log("isEdit", isEdit);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      action_title: isEdit ? editData?.action_title : "",
      status: isEdit ? editData?.status === 'active' ? true : false : false,
      fields: isEdit ? id ? editData?.fields : editData?.fields : [{ field_name: "", field_value: "" }],
    },
  });

  console.log("errors", errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const onSubmit = (data) => {
    const formDataWithStatus = {
      ...data,
      id: editData?.id || (Math.random() + 1).toString(36).substring(7), // If in edit mode, retain the existing id
      action_type: actionType,
      status: data?.status === true ? 'active' : 'inactive'
    };

    console.log("formDataWithStatus", formDataWithStatus);

    handleActionArrayManupulation(editData, actionArray, formDataWithStatus);

    setShowModal("");
    reset();
  };

  // const onSubmit = (data) => {
  //   const formDataWithStatus = {
  //     ...data,
  //     id: (Math.random() + 1).toString(36).substring(7),
  //     action_type: actionType,
  //   };

  //   console.log("formDataWithStatus", formDataWithStatus);

  //   // if (editData?.id) {
  //   //   // Edit mode: update the existing action in the actionArray
  //   //   const updatedActions = actionArray.map((action) =>
  //   //     action.id === editData.id ? formDataWithStatus : action
  //   //   );
  //   //   setActionArray(updatedActions);
  //   // } else {
  //   // Create mode: add a new action
  //   setActionArray([...actionArray, { ...formDataWithStatus }]);
  //   // }

  //   setShowModal("");
  //   reset();
  // };

  // useEffect(() => {
  //   if (isEdit) {
  //     //   setValue("action_title", editData?.action_title);
  //     //     // setValue("fields", editData?.update_fields?.fields?.length ? editData?.update_fields?.fields : actionArray);
  //     setValue("status", editData?.status);

  //     defaultValues = {
  //       action_title: editData?.action_title,
  //       status: editData?.status,
  //       fields: editData?.fields,
  //     };
  //   }
  // }, [isEdit]);

  // const watchActionType = watch("action_title")
  // const watchFields = watch("fields")
  const watchStatus = watch("status");

  // console.log('watchFields',watchFields);

  return (
    <div className="fixed w-full left-0 bottom-0 z-[1000] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-3xl">
          <div className=" max-h-[90vh] min-w-[300px] max-w-[90%] md:min-w-[90%] p-5 md:max-w-[90%] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between pb-4 border-b border-solid border-[#E3E5E6] rounded-t ">
              <h3 className="text-lg font-medium text-gray-11">
                {isEdit ? t("clients.editField") : t("clients.addField")}
              </h3>
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => {
                  setShowModal("");
                  setIsEdit(false);
                }}
              >
                <img src={CrossIcon} alt="CrossIcon" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="flex w-full gap-4">
                <td className="w-1/2 md:w-1/5">
                  {t("automation.actionTitle")}
                </td>
                <input
                  id="workflow_action_title"
                  type="text"
                  // value={watchActionType}
                  className={`appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10 ${
                    errors.action_title ? "border-red-500" : ""
                  }`}
                  {...register("action_title")}
                  placeholder={t("automation.actionTitle")}
                />
                {errors.action_title && (
                  <p className="text-red-500">{errors.action_title.message}</p>
                )}
              </div>

              <div className="flex my-5 items-center gap-3">
                <label>Status</label>
                <ToggleSwitch
                  clickHandler={(e) => setValue("status", e.target.checked)}
                  selected={watchStatus}
                />
              </div>

              {fields?.map((item, index) => (
                <Grid
                  container
                  item
                  spacing={2}
                  key={item.id}
                  className="row-gap-2"
                >
                  {/* Dropdown Field using MUI Select */}
                  <Grid item xs={5}>
                    <FormControl fullWidth>
                      <InputLabel>Select Field</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                        {...register(`fields[${index}].field_name`)}
                        defaultValue={item?.field_slug || item?.field_name}
                        MenuProps={{
                          sx: {
                            maxHeight: "250px",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        {fullFormData
                          .filter((item) => item?.data_type.value !== "file")
                          .map((field, i) => (
                            <MenuItem value={field?.field_slug} key={i}>
                              {field?.field_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {errors.fields?.[index]?.field_name && (
                      <p className="text-red-500">
                        {errors.fields[index].field_name.message}
                      </p>
                    )}
                  </Grid>

                  {/* Value Field */}
                  <Grid item xs={5}>
                    <input
                      id={`fields[${index}].field_value`}
                      type="text"
                      name="field_value"
                      className={`appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 ${
                        errors.fields?.[index]?.field_value
                          ? "border-red-500"
                          : ""
                      }`}
                      {...register(`fields[${index}].field_value`)}
                    />
                    {errors.fields?.[index]?.field_value && (
                      <p className="text-red-500">
                        {errors.fields[index].field_value.message}
                      </p>
                    )}
                  </Grid>

                  {/* Delete Button */}
                  <Grid item xs={2}>
                    <IconButton onClick={() => remove(index)}>
                      <img
                        src={BinIcon}
                        alt="BinIcon"
                        className="mx-1 self-center text-blueSecondary h-[22px] w-[22px] hover:cursor-pointer"
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={() => append({ field_name: "", field_value: "" })}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
              >
                Add Row
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {isEdit ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldsModal;
