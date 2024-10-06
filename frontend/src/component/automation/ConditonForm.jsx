import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { IoIosAdd } from "react-icons/io";
import ErrorMessage from "../common/ErrorMessage";
import { useTranslation } from "react-i18next";
import BinIcon from "../../assets/images/bin.svg";

const ConditonForm = ({
  conditions,
  filterFieldConditionUpdate,
  fullFormData,
  errors,
  filterOptions,
  deleteFilterCondition,
  addConditionHandler
}) => {
  const { t } = useTranslation();
  return (
    <div className="px-6 py-4 w-full bg-white rounded-3xl shadow-custom mt-2">
      <div className="flex flex-col gap-3">
        <div className="w-full flex flex-col">
          {/* <label
                className={`block break-words capitalize text-gray-11 text-lg font-medium ${
                  lang === "he" ? "ml-6" : "mr-6"
                }`}
              >
                {t("clients.conditions")}
              </label> */}
          <h1 className="text-gray-11 font-medium text-2xl mb-4">
            {t("automation.conditions")}
          </h1>
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
                          value={filterCondition?.field_slug}
                          MenuProps={{
                            sx: {
                              maxHeight: "250px",
                            },
                          }}
                          onChange={(e) =>
                            filterFieldConditionUpdate(
                              "field_slug",
                              e.target.value,
                              filterCondition?.id
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            {t("automation.select")}
                          </MenuItem>
                          {fullFormData
                            ?.filter((item) => item?.data_type.value !== "file")
                            .map((field, i) => (
                              <MenuItem value={field?.field_slug} key={i}>
                                {field.field_name}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors?.filters?.length > 0 &&
                          errors?.filters[0]?.field_slug && (
                            <ErrorMessage
                              message={errors?.filters[0]?.field_slug.message}
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
                            ?.filter(
                              (filterOption) =>
                                filterOption.datatype ===
                                fullFormData?.filter(
                                  (field) =>
                                    field?.field_slug ===
                                    filterCondition?.field_slug
                                )[0]?.data_type.value
                            )[0]
                            ?.conditions?.map((condition, i) => (
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
                      onClick={() => deleteFilterCondition(filterCondition?.id)}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <button
          type="button"
          className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
          onClick={() => addConditionHandler("AND")}
        >
          <IoIosAdd style={{ color: "#0B99FF" }} size="1.5rem" />{" "}
          {t("clients.addCondition")}
        </button>
      </div>

      <div className="border-b my-3 border-[#E3E5E6]"></div>

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
                          value={filterCondition?.field_slug}
                          MenuProps={{
                            sx: {
                              maxHeight: "250px",
                            },
                          }}
                          onChange={(e) =>
                            filterFieldConditionUpdate(
                              "field_slug",
                              e.target.value,
                              filterCondition?.id
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            {t("automation.select")}
                          </MenuItem>
                          {fullFormData
                            ?.filter((item) => item?.data_type.value !== "file")
                            .map((field, i) => (
                              <MenuItem value={field?.field_slug} key={i}>
                                {field.field_name}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors?.filters?.length > 0 &&
                          errors?.filters[0]?.field_slug && (
                            <ErrorMessage
                              message={errors?.filters[0]?.field_slug.message}
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
                            {t("automation.select")}
                          </MenuItem>
                          {filterOptions
                            .filter(
                              (filterOption) =>
                                filterOption.datatype ===
                                fullFormData.filter(
                                  (field) =>
                                    field?.field_slug ===
                                    filterCondition?.field_slug
                                )[0]?.data_type.value
                            )[0]
                            ?.conditions?.map((condition, i) => (
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
                      onClick={() => deleteFilterCondition(filterCondition?.id)}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <button
          type="button"
          className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
          onClick={() => addConditionHandler("OR")}
        >
          <IoIosAdd style={{ color: "#0B99FF" }} size="1.5rem" />{" "}
          {t("clients.addCondition")}
        </button>
      </div>
    </div>
  );
};

export default ConditonForm;
