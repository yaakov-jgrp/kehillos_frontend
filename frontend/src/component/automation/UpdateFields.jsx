import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
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
import BinIcon from "../../assets/images/bin.svg";
import ToggleSwitch from "../common/ToggleSwitch";
import { useTranslation } from "react-i18next";

// Yup validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Template Name is required"),
  actions: Yup.array()
    .of(
      Yup.object().shape({
        fieldName: Yup.string().required("Field Name is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .required("At least one action is required"),
});

const UpdateFields = ({
  fullFormData,
  conditions,
  actionArray,
  setActionArray,
}) => {
  const { t } = useTranslation();

  // useForm hook with Yup validation
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      actions: [{ fieldName: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "actions",
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data.actions);
    // Add form values to actionArray
    setActionArray([...actionArray, ...data.actions]);

    // Optional: Reset form after submission
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="flex w-full gap-4">
        <td className="w-1/2 md:w-1/5">{t("emails.templateName")}</td>
        <input
          id="workflow_name"
          type="text"
          className={`appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10 ${
            errors.name ? "border-red-500" : ""
          }`}
          {...register("name")}
          placeholder={t("emails.templateName")}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex my-5 items-center gap-3">
        <label>Status</label>
        <ToggleSwitch />
      </div>

      {fields.map((item, index) => (
        <Grid container item spacing={2} key={item.id} className="row-gap-2">
          {/* Dropdown Field using MUI Select */}
          <Grid item xs={5}>
            <FormControl fullWidth>
              <InputLabel>Select Field</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                {...register(`actions[${index}].fieldName`)}
                defaultValue=""
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
                      {field.field_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {errors.actions?.[index]?.fieldName && (
              <p className="text-red-500">
                {errors.actions[index].fieldName.message}
              </p>
            )}
          </Grid>

          {/* Value Field */}
          <Grid item xs={5}>
            <input
              id={`actions[${index}].value`}
              type="text"
              className={`appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 ${
                errors.actions?.[index]?.value ? "border-red-500" : ""
              }`}
              {...register(`actions[${index}].value`)}
            />
            {errors.actions?.[index]?.value && (
              <p className="text-red-500">
                {errors.actions[index].value.message}
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
        onClick={() => append({ fieldName: "", value: "" })}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
      >
        Add Row
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Submit
      </button>
    </form>
  );
};

export default UpdateFields;
