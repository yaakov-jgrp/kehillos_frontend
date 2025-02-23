// React imports
import React, { useEffect, useState } from "react";

// UI Imports
import { Select, MenuItem, FormControl, Popover } from "@mui/material";
import FilterIcon from "../../assets/images/filter_alt.svg";

// UI Components Imports
import NoDataFound from "../common/NoDataFound";
import EditButtonIcon from "../common/EditButton";
import AddButtonIcon from "../common/AddButton";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import CustomCheckBox from "../fields/checkbox";
import FieldLabel from "../fields/FormLabel";

// Third part Imports
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BinIcon from "../../assets/images/bin.svg";
import CrossIcon from "../../assets/images/cross.svg";

// API services
import clientsService from "../../services/clients";

// Icon imports
import { FaFilter } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosAdd } from "react-icons/io";
import { FORM_FIELD_CONDITIONS } from "../../constants";

function FilterModal({
  fullFormData,
  filters,
  fetchClientsData,
  fetchFullFormData,
  applyFilterHandler,
  fetchFiltersHandler,
  setFilters,
  setAppliedFilter,
  writePermission,
  deletePermission,
  updatePermission
}) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [newFilter, setNewFilter] = useState(true);
  const [editFilter, setEditFilter] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuanchorEl, setMenuAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(0);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterMenuClick = (event, id) => {
    setMenuId(id);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const open2 = Boolean(menuanchorEl);

  const defaultValues = {
    filter_name: "",
    default: false,
    filters: [],
  };

  const schema = yup.object().shape({
    filter_name: yup
      .string()
      .min(3, t("clients.filterNameMinCondition"))
      .required(
        `${t("clients.filterName")} ${t("clients.is")} ${t("clients.required")}`
      ),
    filters: yup
      .array()
      .of(
        yup.object().shape({
          attr_name: yup
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
          operator: yup.string().required(),
        })
      )
      .min(1, t("clients.minimumConditions"))
      .required(
        `${t("clients.conditions")} ${t("clients.are")} ${t(
          "clients.required"
        )}`
      ),
    default: yup.boolean().notRequired(),
  });

  const {
    control,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const addConditionHandler = (type) => {
    setConditions((prev) => [
      ...prev,
      {
        id: (Math.random() + 1).toString(36).substring(7),
        attr_name: fullFormData[0]?.name,
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

  const submitForm = async (data, e) => {
    e.preventDefault();
    console.log("::Form submitted with data::");
    console.log(data);
    setFilters((prev) => {
      let payload = prev;
      if (data?.default) {
        payload = payload.map((data) => ({ ...data, default: false }));
      }
      if (newFilter) {
        const newItem = { id: Math.random(), ...data };
        payload = [...payload, newItem];
        localStorage.setItem("clientFormsFilters", JSON.stringify(payload));
        return payload;
      } else {
        payload = payload.map((item) => {
          if (item.id === editFilter.id) {
            return {
              id: editFilter.id,
              ...data,
            };
          }
          return item;
        });
        localStorage.setItem("clientFormsFilters", JSON.stringify(payload));
        return payload;
      }
    });
    setShowForm(false);
    setShowModal(false);
  };

  const deleteFilterHandler = async (id) => {
    try {
      console.log("::Filter to be deleted id is::");
      console.log(id);
      const filteredFilters = filters.filter((item) => item.id != id);
      setFilters(filteredFilters);
      localStorage.setItem(
        "clientFormsFilters",
        JSON.stringify(filteredFilters)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const editFilterHandler = (filter) => {
    console.log("::Edit filter is called::");
    console.log(filter);
    handleFilterClose();
    handleFilterMenuClose();
    setShowModal(true);
    setNewFilter(false);
    setEditFilter(filter);
    setShowForm(true);
    setValue("filter_name", filter?.filter_name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setConditions(filter?.filters);
    setValue("filters", filter?.filters, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("default", filter?.default, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCloseFilter = () => {
    setShowModal(false);
    setShowForm(false);
  };

  const openFilterModal = () => {
    handleFilterClose();
    handleFilterMenuClose();
    setConditions([]);
    setEditFilter(null);
    setNewFilter(true);
    setShowForm(true);
    setShowModal(true);
    reset();
  };

  useEffect(() => {
    console.log("::Full Form Data Is::");
    console.log(fullFormData);
  }, [fullFormData]);

  useEffect(() => {
    fetchFiltersHandler();
  }, []);

  useEffect(() => {
    fetchFullFormData();
  }, [lang]);

  return (
    <>
      <button
        disabled={writePermission}
        className={`w-[90px] disabled:cursor-not-allowed rounded-lg py-1 text-[14px] font-medium dark:bg-brand-400 text-[#0B99FF] dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex gap-1 justify-center items-center border border-[#0B99FF]`}
        onClick={handleFilterClick}
      >
        <img src={FilterIcon} alt="visibility_icon" />
        {t("clients.filters")}
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: "320px",
              marginTop: "10px",
              // boxShadow: "none",
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <>
          <div className="flex items-center justify-between px-2 p-1 py-3 shadow-md rounded-t border border-b-[#E3E5E6]">
            <h3 className="text-lg font-medium">{t("clients.filters")}</h3>
            <AddButtonIcon onClick={openFilterModal} />
          </div>
          {filters && filters?.length > 0 ? (
            <div className="max-h-[calc(60vh-170px)] overflow-y-auto">
              {filters.map((filter, i) => {
                return (
                  <div
                    className={`group flex ${
                      filter?.default && "bg-gray-200"
                    } items-center cursor-pointer justify-between p-3 border-solid`}
                    key={i}
                  >
                    {filter.filter_name}
                    <HiDotsVertical
                      onClick={(e) => handleFilterMenuClick(e, i)}
                      className="m-1"
                    />
                    <Popover
                      open={i === menuId ? open2 : false}
                      anchorEl={menuanchorEl}
                      onClose={handleFilterMenuClose}
                      slotProps={{
                        paper: {
                          sx: {
                            marginTop: "5px",
                            marginLeft: "10px",
                            boxShadow: "0px 0px 12px 0px #00000014",
                            padding: "0.2rem 0",
                          },
                        },
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <div className="flex items-center p-2 gap-2">
                        {filter?.default ? (
                          <button
                           disabled={deletePermission}
                            className="text-red-500 background-transparent font-semibold uppercase px-3 py-1 text-sm outline-none focus:outline-none"
                            type="button"
                            onClick={() => {
                              applyFilterHandler(filter, false);
                              setMenuAnchorEl(null);
                            }}
                          >
                            {t("netfree.remove")}
                          </button>
                        ) : (
                          <button
                          disabled={writePermission}
                            className="text-white disabled:cursor-not-allowed mx-1 text-sm transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 px-3 py-1 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none"
                            type="button"
                            onClick={writePermission ? ()=>{} : () => {
                              applyFilterHandler(filter, true);
                              setMenuAnchorEl(null);
                            }}
                          >
                            {t("clients.apply")}
                          </button>
                        )}
                        {!filter.default && (
                          <div className="w-[1.3px] h-6 bg-[#CCCCCC]"></div>
                        )}
                        <EditButtonIcon
                          extra={`mx-1 h-[18px] w-[18px] ${updatePermission ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
                          onClick={updatePermission ? ()=>{} : () => editFilterHandler(filter)}
                        />
                        <img
                          src={BinIcon}
                          alt="BinIcon"
                          className={deletePermission ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}
                          onClick={deletePermission ? ()=>{} : () => deleteFilterHandler(filter?.id)}
                        />
                      </div>
                    </Popover>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoDataFound description="No filters found" />
          )}
        </>
      </Popover>
      {showModal ? (
        <div className="fixed left-0 bottom-0 font-semibold z-[1000] h-screen w-screen bg-[#00000080] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto min-w-[90vw] max-w-[90vw]">
              <div
                className={`w-[100%] ${
                  !showForm
                    ? "max-w-[400px]"
                    : "min-w-[80vw] md:min-w-[70vw] lg:min-w-[60vw]"
                }  overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none`}
              >
                <div className="flex items-center justify-between p-5 rounded-t border-b border-[#E3E5E6]">
                  <h3 className="text-xl text-gray-11 font-medium">
                    {t("clients.filters")}
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                    type="button"
                  >
                    <img src={CrossIcon} alt="cross-icon" />
                  </button>
                </div>
                {showForm && (
                  <>
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <form
                        style={{
                          width: "100%",
                          position: "relative",
                        }}
                        method="post"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit((data, e) =>
                          submitForm(data, e)
                        )}
                      >
                        <div className="relative p-6 flex flex-col gap-6 max-h-[calc(90vh-170px)] overflow-y-auto">
                          <div className="flex w-full items-center gap-4">
                            <div className="-mt-1">
                              <Controller
                                name="default"
                                control={control}
                                render={({
                                  field: { value, onChange, onBlur },
                                }) => (
                                  <CustomCheckBox
                                    checked={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                  />
                                )}
                              />
                            </div>
                            <FieldLabel
                              className={`${
                                lang === "he" ? "ml-6" : "mr-6"
                              } text-[10px]`}
                            >
                              {t("clients.setAsDefault")}
                            </FieldLabel>
                          </div>

                          <div className="flex flex-col gap-1 w-full">
                            <FieldLabel
                              className={`${
                                lang === "he" ? "ml-6" : "mr-6"
                              } text-[14px]`}
                            >
                              {t("clients.filterName")}
                            </FieldLabel>
                            <div className="">
                              <Controller
                                name="filter_name"
                                control={control}
                                render={({
                                  field: { value, onChange, onBlur },
                                }) => (
                                  <input
                                    className="appearance-none outline-none border border-[#E3E5E6] text-lg rounded-lg w-full p-2 text-gray-11 font-normal placeholder:text-gray-10 placeholder:font-normal placeholder:text-lg"
                                    placeholder="Enter"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                  />
                                )}
                              />
                              {errors?.filter_name && (
                                <p className="my-1 text-[#ff0000] capitalize text-lg">
                                  {errors.filter_name.message}
                                </p>
                              )}
                            </div>
                          </div>

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
                                            {t("forms.field")}
                                          </p>
                                          <FormControl
                                            sx={{ minWidth: "200px" }}
                                            size="small"
                                          >
                                            <Select
                                              labelId="demo-select-small-label"
                                              id="demo-select-small"
                                              className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded-lg outline-none w-full p-2 text-black bg-white"
                                              value={filterCondition?.attr_name}
                                              MenuProps={{
                                                sx: {
                                                  maxHeight: "250px",
                                                },
                                              }}
                                              onChange={(e) =>
                                                filterFieldConditionUpdate(
                                                  "attr_name",
                                                  e.target.value,
                                                  filterCondition?.id
                                                )
                                              }
                                            >
                                              <MenuItem value="" disabled>
                                                Select
                                              </MenuItem>
                                              <MenuItem value="name">
                                                Name
                                              </MenuItem>
                                              <MenuItem value="clientId">
                                                Client Id
                                              </MenuItem>
                                              <MenuItem value="createdAt">
                                                Date Filled Out
                                              </MenuItem>
                                              <MenuItem value="lastEditedAt">
                                                Date Last Edited
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <p className="font-normal text-[16px]">
                                            {t("forms.condition")}
                                          </p>
                                          <FormControl
                                            sx={{ minWidth: "200px" }}
                                            size="small"
                                          >
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
                                              {FORM_FIELD_CONDITIONS[
                                                "other"
                                              ].map((field, i) => (
                                                <MenuItem
                                                  value={field?.slug}
                                                  key={i}
                                                >
                                                  {/* {field.name} */}
                                                  {lang === "he" ? field.name.he : field.name.en}

                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <p className="font-normal text-[16px]">
                                            {t("forms.value")}
                                          </p>
                                          <FormControl
                                            sx={{ minWidth: "150px" }}
                                            size="small"
                                          >
                                            <input
                                              className="pl-2 appearance-none outline-none border border-[#E3E5E6] rounded-md w-full py-[10px] text-gray-11 font-normal text-sm"
                                              value={filterCondition?.value}
                                              onChange={(e) =>
                                                filterFieldConditionUpdate(
                                                  "value",
                                                  e.target.value,
                                                  filterCondition?.id
                                                )
                                              }
                                            />
                                          </FormControl>
                                        </div>

                                        <div className="mt-8">
                                          <img
                                            src={BinIcon}
                                            alt="BinIcon"
                                            className="mx-1 self-center text-blueSecondary h-[22px] w-[22px] hover:cursor-pointer"
                                            onClick={() =>
                                              deleteFilterCondition(
                                                filterCondition?.id
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>

                            <button
                              className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
                              onClick={() => addConditionHandler("AND")}
                            >
                              <IoIosAdd
                                style={{ color: "#0B99FF" }}
                                size="1.5rem"
                              />
                              <span className="text-lg">
                                {t("clients.addCondition")}
                              </span>
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
                                            {t("forms.field")}
                                          </p>
                                          <FormControl
                                            sx={{ minWidth: "200px" }}
                                            size="small"
                                          >
                                            <Select
                                              labelId="demo-select-small-label"
                                              id="demo-select-small"
                                              className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                                              value={filterCondition?.attr_name}
                                              MenuProps={{
                                                sx: {
                                                  maxHeight: "250px",
                                                },
                                              }}
                                              onChange={(e) =>
                                                filterFieldConditionUpdate(
                                                  "attr_name",
                                                  e.target.value,
                                                  filterCondition?.id
                                                )
                                              }
                                            >
                                              <MenuItem value="" disabled>
                                                Select
                                              </MenuItem>
                                              <MenuItem value="name">
                                                Name
                                              </MenuItem>
                                              <MenuItem value="clientId">
                                                Client Id
                                              </MenuItem>
                                              <MenuItem value="createdAt">
                                                Date Filled Out
                                              </MenuItem>
                                              <MenuItem value="lastEditedAt">
                                                Date Last Edited
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <p className="font-normal text-[16px]">
                                            {t("forms.condition")}
                                          </p>
                                          <FormControl
                                            sx={{ minWidth: "200px" }}
                                            size="small"
                                          >
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
                                              {FORM_FIELD_CONDITIONS[
                                                "other"
                                              ].map((field, i) => (
                                                <MenuItem
                                                  value={field?.slug}
                                                  key={i}
                                                >
                                                  {/* {field.name} */}
                                                  {lang === "he" ? field.name.he : field.name.en}
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <p className="font-normal text-[16px]">
                                            {t("forms.value")}
                                          </p>
                                          <FormControl
                                            sx={{ minWidth: "150px" }}
                                            size="small"
                                          >
                                            <input
                                              className="pl-2 appearance-none outline-none border border-[#E3E5E6] rounded-md w-full py-[10px] text-gray-11 font-normal text-sm"
                                              value={filterCondition?.value}
                                              onChange={(e) =>
                                                filterFieldConditionUpdate(
                                                  "value",
                                                  e.target.value,
                                                  filterCondition?.id
                                                )
                                              }
                                            />
                                          </FormControl>
                                        </div>

                                        <div className="mt-8">
                                          <img
                                            src={BinIcon}
                                            alt="BinIcon"
                                            className="mx-1 self-center text-blueSecondary h-[22px] w-[22px] hover:cursor-pointer"
                                            onClick={() =>
                                              deleteFilterCondition(
                                                filterCondition?.id
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>

                            <button
                              className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
                              onClick={() => addConditionHandler("OR")}
                            >
                              <IoIosAdd
                                style={{ color: "#0B99FF" }}
                                size="1.5rem"
                              />
                              <span className="text-lg">
                                {t("clients.addCondition")}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-4">
                          <button
                            className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                            type="button"
                            onClick={handleCloseFilter}
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
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default FilterModal;
