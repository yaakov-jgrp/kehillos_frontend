import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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

const UpdateFields = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      actions: [{ fieldName: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "actions",
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data.actions);
  };

  return (
    <div className="mt-4">
      <div className="flex mb-2 w-full gap-4">
        <td className="w-1/2 md:w-1/5">{t("emails.templateName")}</td>
        <input
          className="text-[13px] rounded-md h-[40px]"
          id="templateName"
          type="text"
          value={"formdata.name"}
          name="name"
          placeholder={t("emails.templateName")}
        />
      </div>
      <div className="flex mb-2 items-center gap-3">
        <label>Status</label>
        <ToggleSwitch />
      </div>

      {fields.map((item, index) => (
        <Grid container item spacing={2} key={item.id}>
          {/* Dropdown Field using MUI Select */}
          <Grid item xs={5}>
            <Controller
              name={`actions[${index}].fieldName`}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Select Field</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                    {...field}
                    label="Select Field"
                  >
                    <MenuItem value="field1">Field 1</MenuItem>
                    <MenuItem value="field2">Field 2</MenuItem>
                    <MenuItem value="field3">Field 3</MenuItem>
                    {/* Add more options as needed */}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* Value Field */}
          <Grid item xs={5}>
            <Controller
              name={`actions[${index}].value`}
              control={control}
              render={({ field }) => (
                <TextField fullWidth label="Enter Value" {...field} />
              )}
            />
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
      <Button
        variant="contained"
        onClick={() => append({ fieldName: "", value: "" })}
        style={{ marginTop: "16px" }}
      >
        Add Row
      </Button>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={handleSubmit(onSubmit)}
        style={{ marginLeft: "16px", marginTop: "16px" }}
      >
        Submit
      </Button>
    </div>
  );
};

export default UpdateFields;
