// React imports
import React, { useEffect, useState } from "react";

// UI Imports
import { Box, MenuItem, Select, Typography } from "@mui/material";

// UI Components Imports
import ErrorMessage from "../common/ErrorMessage";
import CustomCheckBox from "../fields/checkbox";
import Loader from "../common/Loader";

// Third part Imports
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// API services
import clientsService from "../../services/clients";

// Icon imports
import { MdCancel } from "react-icons/md";
import CrossIcon from "../../assets/images/cross.svg";

// Utils imports
import {
  BlockFieldCheckValues,
  checkBoxValues,
  dataTypes,
} from "../../lib/FieldConstants";
import { fetchFormDataByBlockIdHandler } from "../../lib/CommonFunctions";

function BlockFieldModal({
  block,
  blockId,
  setShowModal,
  onClick,
  editData,
  setIsLoading,
}) {
  const { t } = useTranslation();
  const [selectValue, setSelectValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [blockFormData, setBlockFormData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(
    block
      ? {
          name: "",
          field_name_language: {
            he: "",
          },
          is_block_created: true,
        }
      : {
          name: "",
          field_name_language: {
            he: "",
          },
          block_id: blockId,
          value: "",
          data_type: dataTypes[0],
          required: false,
          defaultvalue: "",
          unique: false,
          display: true,
        }
  );

  const schema = block
    ? yup.object().shape({
        name: yup
          .string()
          .min(
            3,
            `${t("netfree.name")} ${t("messages.mustContain")} 3 ${t(
              "messages.characters"
            )}`
          )
          .required(
            `${t("netfree.name")} ${t("clients.is")} ${t("clients.required")}`
          ),
      })
    : yup.object().shape({
        name: yup
          .string()
          .min(
            3,
            `${t("netfree.name")} ${t("messages.mustContain")} 3 ${t(
              "messages.characters"
            )}`
          )
          .required(
            `${t("netfree.name")} ${t("clients.is")} ${t("clients.required")}`
          ),
        block_id: yup.string().required(),
        data_type: yup
          .string()
          .required(
            `${t("clients.dataType")} ${t("clients.is")} ${t(
              "clients.required"
            )}`
          ),
        value: yup.string().when("data_type", {
          is: "select",
          then: () =>
            yup
              .string()
              .required(
                `${t("messages.minimum")} ${t("messages.one")} ${t(
                  "messages.value"
                )} ${t("clients.is")} ${t("clients.required")}`
              ),
          otherwise: () => yup.string().notRequired(),
        }),
        required: yup.boolean().required(),
        defaultvalue: yup.string().notRequired(),
        unique: yup.boolean().required(),
        display: yup.boolean().required(),
      });

  const {
    control,
    setValue,
    reset,
    watch,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const initModal = () => {
    setFormLoading(true);
    if (editData) {
      setValue("field_name_language", editData?.field_name_language);
      if (block) {
        setValue("name", editData?.block);
      } else {
        if (editData?.data_type.value === "select") {
          const choices = editData?.enum_values?.choices?.map(
            (item) => item.value
          );
          setValue("value", choices.join(","));
          setSelectedValues(choices);
        }
        setValue("name", editData?.field_name);
        setValue("data_type", editData?.data_type.value);
        setValue("defaultvalue", editData?.defaultvalue || "");
        setValue("required", editData?.required);
        setValue("unique", editData?.unique);
        setValue("display", editData?.display);
      }
    }
    setTimeout(() => {
      setFormLoading(false);
    }, 500);
  };

  const selectValueHandler = () => {
    if (selectValue !== "") {
      const values = [selectValue, ...selectedValues].join(",");
      setSelectedValues((prev) => [selectValue, ...prev]);
      setValue("value", values, { shouldValidate: true, shouldDirty: true });
      setSelectValue("");
    }
  };

  const deleteSelectedValuesHandler = (index) => {
    const values = selectedValues.filter(
      (item, itemIndex) => index !== itemIndex
    );
    setSelectedValues(values);
    setValue("value", values.join(","), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const submitForm = async (data, e) => {
    e.preventDefault();
    if (editData) {
      let updatedData;
      const updateArray = [];
      if (block) {
        for (const dirtyField in dirtyFields) {
          updateArray.push({
            [dirtyField]: data[dirtyField],
          });
        }
        const updateValues = updateArray.reduce(
          (acc, curr) => Object.assign(acc, curr),
          {}
        );
        updatedData = {
          fields: [
            {
              id: editData?.block_id,
              other_columns_added: selectedFields?.map((i, index) => ({
                field_id: i,
                display_order: index + 1,
              })),
              ...updateValues,
            },
          ],
          is_block: true,
        };
      } else {
        for (const dirtyField in dirtyFields) {
          if (!BlockFieldCheckValues.includes(dirtyField)) {
            updateArray.push({
              [dirtyField]: data[dirtyField],
            });
          }
        }
        for (const value of BlockFieldCheckValues) {
          updateArray.push({
            [value]: data[value],
          });
        }
        const updateValues = updateArray.reduce(
          (acc, curr) => Object.assign(acc, curr),
          {}
        );
        updatedData = {
          fields: [
            {
              id: editData.id,
              other_columns_added: selectedFields?.map((i, index) => ({
                field_id: i,
                display_order: index + 1,
              })),
              ...updateValues,
            },
          ],
        };
      }

      clientsService
        .updateBlockField(updatedData)
        .then((res) => {
          reset();
          setShowModal(false);
          onClick();
        })
        .catch((err) => console.log(err));
    } else {
      let newDataValues = [];
      for (const newValue in data) {
        newDataValues.push(
          {
            [newValue]: data[newValue],
          },
          {
            other_columns_added: selectedFields?.map((i, index) => ({
              field_id: i,
              display_order: index + 1,
            })),
          }
        );
      }
      const newValues = newDataValues.reduce(
        (acc, curr) => Object.assign(acc, curr),
        {}
      );

      clientsService
        .createBlockField({
          ...newValues,
        })
        .then((res) => {
          reset();
          setShowModal(false);
          onClick();
        })
        .catch((err) => console.log(err));
    }
  };

  const addSelectValueHandler = (e) => {
    if (e.target.value !== "") {
      setSelectValue(e.target.value);
      setValue("defaultvalue", e.target.value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleChange = (event) => {
    setSelectedFields(event.target.value);
  };

  useEffect(() => {
    initModal();
  }, []);

  useEffect(() => {
    if (blockId && editData?.id) {
      fetchFormDataByBlockIdHandler(
        setIsLoading,
        setFieldData,
        `field_id=${editData?.id}&block_id=${editData?.block}`
      );
    } else {
      fetchFormDataByBlockIdHandler(
        setIsLoading,
        setBlockFormData,
        `block_fields=True&block_id=${blockId}`
      );
    }
  }, [blockId]);

  const blockMap = blockFormData?.flatMap((block) =>
    block?.field?.map((field) => ({
      id: field.id,
      field_name: field.field_name,
    }))
  );

  const fieldMap = fieldData?.map((field) => ({
    id: field.id,
    field_name: field.field_name,
    // selected: field?.selected,
  }));

  const modalFields =
    blockId && editData?.id
      ? fieldMap
      : blockFormData?.map((field) => ({
          id: field.id,
          field_name: field.field_name,
        }));

  useEffect(() => {
    if (editData?.id) {
      const defaultSelected = fieldData
        ?.filter((i) => i?.selected === true)
        .map((i) => i.id);
      setSelectedFields(defaultSelected || []);
    }
  }, [editData, fieldData]);

  return (
    <div className="fixed left-0 bottom-0 z-[1000] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="min-w-[300px] max-w-[300px] md:min-w-[400px] md:max-w-[400px] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
              <div className="flex items-center justify-between p-5 border-b border-solid border-[#E3E5E6] rounded-t ">
                <h3 className="text-lg font-medium text-gray-11">
                  {editData
                    ? t(block ? "clients.editBlock" : "clients.editField")
                    : t(block ? "clients.addBlock" : "clients.addField")}
                </h3>

                <button
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() => setShowModal(false)}
                >
                  <img src={CrossIcon} alt="CrossIcon" />
                </button>
              </div>

              {!formLoading ? (
                <div className="relative p-6 flex flex-col gap-2 max-h-[calc(90vh-170px)] overflow-y-auto">
                  <div className="my-1">
                    <label className="block text-gray-11 text-md font-normal my-1">
                      {t("netfree.name")}
                    </label>

                    <Controller
                      name="name"
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <input
                          value={value}
                          className="appearance-none outline-none border rounded-lg w-full py-2 px-3 text-gray-11 placeholder:text-gray-10 text-md"
                          onChange={onChange}
                          onBlur={onBlur}
                          placeholder={`${t(
                            "clients.addBlockInputPlaceholder"
                          )}`}
                        />
                      )}
                    />
                  </div>

                  {errors.name && (
                    <ErrorMessage message={errors.name.message} />
                  )}

                  {!block && (
                    <>
                      <div className="my-1">
                        <label className="block text-gray-11 text-md font-normal my-1">
                          {t("clients.dataType")}
                        </label>
                        <Controller
                          name="data_type"
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Select
                              MenuProps={{
                                sx: {
                                  maxHeight: "250px",
                                },
                              }}
                              className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded-lg outline-none w-full p-2 text-black bg-white"
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              disabled={editData ? true : false}
                              placeholder="Select Data Type"
                            >
                              {dataTypes?.map((el) => {
                                return el ? (
                                  <MenuItem key={el} value={el}>
                                    {t(`dataTypes.${el}`)}
                                  </MenuItem>
                                ) : null;
                              })}
                            </Select>
                          )}
                        />
                      </div>
                      {errors.data_type && (
                        <ErrorMessage message={errors.data_type.message} />
                      )}
                      {watch("data_type") === "select" ? (
                        <div className="my-1">
                          <label className="block text-gray-11 text-md font-normal my-1">
                            {t("clients.value")}
                          </label>
                          <div className="w-full flex justify-between items-center mb-2">
                            <input
                              value={selectValue}
                              className="shadow appearance-none outline-none border rounded w-3/4 py-2 px-2 text-black"
                              onChange={addSelectValueHandler}
                            />
                            <button
                              type="button"
                              className={`rounded-full w-1/5 py-1 px-4 h-fit text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
                              onClick={selectValueHandler}
                            >
                              {t("clients.add")}
                            </button>
                          </div>
                          {errors.value && (
                            <ErrorMessage message={errors.value.message} />
                          )}
                          <div className="flex flex-wrap">
                            {selectedValues.map((value, index) => (
                              <p
                                className="bg-[#ffffff] shadow-md rounded-md w-fit p-1 px-2 m-1 flex items-center"
                                key={index}
                              >
                                {value}
                                <MdCancel
                                  className="text-red-500 ml-1 w-4 h-4 hover:cursor-pointer"
                                  onClick={() =>
                                    deleteSelectedValuesHandler(index)
                                  }
                                />
                              </p>
                            ))}
                          </div>
                          {selectedValues.length > 0 && (
                            <>
                              <label className="block text-gray-11 text-md font-normal my-1">
                                {t("clients.defaultValue")}
                              </label>
                              <Controller
                                name="defaultvalue"
                                control={control}
                                render={({
                                  field: { value, onChange, onBlur },
                                }) => (
                                  <Select
                                    MenuProps={{
                                      sx: {
                                        maxHeight: "250px",
                                      },
                                    }}
                                    className="shadow [&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Select Default Value"
                                  >
                                    {selectedValues?.map((el) => {
                                      return el ? (
                                        <MenuItem key={el} value={el}>
                                          {el}
                                        </MenuItem>
                                      ) : null;
                                    })}
                                  </Select>
                                )}
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          {watch("data_type") === "checkbox" ? (
                            <div className="my-1">
                              <label className="block text-gray-11 text-md font-normal my-1">
                                {t("clients.defaultValue")}
                              </label>
                              <Controller
                                name="defaultvalue"
                                control={control}
                                render={({
                                  field: { value, onChange, onBlur },
                                }) => (
                                  <Select
                                    MenuProps={{
                                      sx: {
                                        maxHeight: "250px",
                                      },
                                    }}
                                    className="shadow [&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Select Default Value"
                                  >
                                    <MenuItem value="">
                                      {t("common.select")}
                                    </MenuItem>
                                    {checkBoxValues.map((el) => {
                                      return el !== "" ? (
                                        <MenuItem key={el} value={el}>
                                          {t(`dataTypes.${JSON.stringify(el)}`)}
                                        </MenuItem>
                                      ) : null;
                                    })}
                                  </Select>
                                )}
                              />
                            </div>
                          ) : (
                            <>
                              {["date", "file"].includes(
                                watch("data_type")
                              ) ? null : (
                                <div className="my-1">
                                  <label className="block text-gray-11 text-md font-normal my-1">
                                    {t("clients.defaultValue")}
                                  </label>
                                  <Controller
                                    name="defaultvalue"
                                    control={control}
                                    render={({
                                      field: { value, onChange, onBlur },
                                    }) => (
                                      <input
                                        value={value}
                                        className="appearance-none outline-none border rounded-lg w-full py-2 px-3 text-black"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        placeholder="Enter"
                                      />
                                    )}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}

                      {editData?.other_row_added === false ||
                      editData === null ? (
                        <div className="my-1">
                          <label className="block text-gray-11 text-md font-normal my-1">
                            Select Fields
                          </label>

                          <Select
                            multiple
                            value={selectedFields}
                            onChange={handleChange}
                            disabled={modalFields?.length ? false : true}
                            className="[&_div]:p-0.5 [&_fieldset]:border-none disabled:cursor-not-allowed appearance-none border rounded-lg outline-none w-full p-2 text-black bg-white"
                            placeholder="Select any field"
                          >
                            {modalFields?.map((item) => (
                              <MenuItem key={item?.id} value={item?.id}>
                                {item?.field_name}
                              </MenuItem>
                            ))}
                          </Select>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              marginTop: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            {selectedFields?.map((value) => (
                              <div
                                key={value}
                                className="border-2 border-[#3f51b5] px-4 py-2 rounded-full"
                              >
                                <Typography variant="body2">
                                  {
                                    modalFields?.find(
                                      (item) => item.id === value
                                    )?.field_name
                                  }
                                </Typography>
                              </div>
                            ))}
                            {/* {modalFields?.find((item) => item?.id === selectedFields)?.field_name} */}
                          </Box>
                        </div>
                      ) : null}

                      <div className="flex flex-col mt-2">
                        <div className="flex my-2 gap-6">
                          <Controller
                            name="required"
                            control={control}
                            render={({ field: { value, onChange, name } }) => {
                              return (
                                <CustomCheckBox
                                  className="mr-2"
                                  checked={value}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                          <label className="block text-gray-11 text-md font-normal">
                            {t("clients.required")}
                          </label>
                        </div>
                        <div className="flex my-2 gap-6">
                          <Controller
                            name="unique"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <CustomCheckBox
                                className="mr-2"
                                checked={value}
                                onChange={onChange}
                              />
                            )}
                          />
                          <label className="block text-gray-11 text-md font-normal">
                            {t("clients.unique")}
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-[50vh] w-full flex justify-center items-center">
                  <Loader />
                </div>
              )}

              <div className="flex items-center justify-center gap-2 pb-6">
                <button
                  className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  {t("netfree.close")}
                </button>

                <button
                  className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                  type="submit"
                >
                  {t("netfree.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockFieldModal;
