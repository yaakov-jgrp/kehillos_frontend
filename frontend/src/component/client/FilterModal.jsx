import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NoDataFound from "../common/NoDataFound";
import EditButtonIcon from "../common/EditButton";
import { MdDelete } from "react-icons/md";
import AddButtonIcon from "../common/AddButton";
import clientsService from "../../services/clients";
import Loader from "../common/Loader";
import { IoIosAdd } from "react-icons/io";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../common/ErrorMessage";
import CustomCheckBox from "../fields/checkbox";
import FieldLabel from "../fields/FormLabel";

function FilterModal({ showModal, setShowModal, fullFormData, filters, fetchClientsData }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [conditions, setConditions] = useState([
        {
            attr_name: fullFormData[0]?.field_slug,
            condition: "",
            value: "",
        }
    ]);
    const [filterOptions, setFilterOptions] = useState([]);
    const [newFilter, setNewFilter] = useState(true);
    const [editFilter, setEditFilter] = useState(null);
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");

    const defaultValues = {
        filter_name: "",
        default: false,
        filters: [
            {
                attr_name: fullFormData[0]?.field_slug,
                condition: "",
                value: "",
            }
        ]
    }

    const schema = yup.object().shape({
        filter_name: yup.string().min(3, t("clients.filterNameMinCondition")).required(`${t("clients.filterName")} ${t("clients.is")} ${t("clients.required")}`),
        filters: yup.array().of(
            yup.object().shape({
                attr_name: yup.string().required(`${t("clients.condition")} ${t("clients.field")} ${t("clients.is")} ${t("clients.required")}`),
                condition: yup.string().required(`${t("clients.condition")} ${t("clients.is")} ${t("clients.required")}`),
                value: yup.string().required(`${t("clients.condition")} ${t("clients.value")} ${t("clients.is")} ${t("clients.required")}`),
            })
        ).min(1, t("clients.minimumConditions")).required(`${t("clients.conditions")} ${t("clients.are")} ${t("clients.required")}`),
        default: yup.boolean().notRequired()
    });

    const {
        control,
        setValue,
        reset,
        watch,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues,
        mode: "onBlur",
        resolver: yupResolver(schema),
    });

    const fetchFilterOptions = async () => {
        setIsloading(true);
        try {
            const filterOptions = await clientsService.getClientFilterOptions();
            setFilterOptions(filterOptions.data);
            setIsloading(false);
        } catch (error) {
            console.log(error);
            setIsloading(false);
        }
    };

    const addConditionHandler = () => {
        setConditions((prev) => [
            ...prev,
            {
                attr_name: fullFormData[0]?.field_slug,
                condition: "",
                value: "",
            },
        ]);
    };

    const filterFieldConditionUpdate = (type, value, index) => {
        const filteredConditions = conditions;
        const condition = conditions.filter((condition, i) => index === i)[0];
        condition[type] = value;
        filteredConditions[index] = condition;
        setConditions((prev) => [...filteredConditions]);
        setValue("filters", filteredConditions, {
            shouldDirty: true,
            shouldValidate: true
        });
    }

    const submitForm = async (data, e) => {
        e.preventDefault();
        if (newFilter) {
            const res = await clientsService.createFilter(data);
            console.log(res);
        } else {
            const updateData = { filter_group_id: editFilter?.id, name: data.filter_name, ...data }
            const res = await clientsService.updateFilterGroup(updateData);
            console.log(res);
        }
        fetchClientsData();
        setShowForm(false);
    };

    const deleteFilterHandler = async (id) => {
        try {
            const res = await clientsService.deleteFilter({
                filter_group_id: id
            });
            fetchClientsData();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFilterCondition = (index) => {
        const conditionsData = conditions;
        conditionsData.splice(index, 1);
        setConditions(conditionsData);
        setValue("filters", conditionsData, {
            shouldDirty: true,
            shouldValidate: true
        })
    }

    const editFilterHandler = (filter) => {
        setNewFilter(false);
        setEditFilter(filter);
        setShowForm(true);
        setValue("filter_name", filter?.name, {
            shouldDirty: true,
            shouldValidate: true
        });
        setConditions(filter?.filters);
        setValue("filters", filter?.filters, {
            shouldDirty: true,
            shouldValidate: true
        })
        setValue("default", filter?.fg_default, {
            shouldDirty: true,
            shouldValidate: true
        });
    }

    const applyFilterHandler = async (filter, value) => {
        const filterData = filter;
        filterData["fg_default"] = value;
        const updateData = { filter_group_id: filter?.id, default: value, ...filterData };
        const res = await clientsService.updateFilterGroup(updateData);
        fetchClientsData();
        setShowModal(false);
    }

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    return (
        <>
            {showModal ? (
                <div className="fixed left-0 bottom-0 z-[999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-7xl">
                            <div className={`w-[100%] ${!showForm ? "max-w-[400px]" : "min-w-[80vw] md:min-w-[70vw] lg:min-w-[60vw]"}  overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none`}>
                                <div className="flex items-start justify-between p-5 shadow-md rounded-t ">
                                    <h3 className="text-2xl font-semibold">
                                        {t("clients.filters")}
                                    </h3>
                                    {!showForm && <AddButtonIcon onClick={() => {
                                        setEditFilter(null);
                                        setNewFilter(true);
                                        setShowForm(true);
                                        reset();
                                    }} />}
                                </div>
                                {showForm ? (
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
                                                onSubmit={handleSubmit((data, e) => submitForm(data, e))}
                                            >
                                                <div className="relative p-6 flex-auto max-h-[calc(90vh-170px)] overflow-y-auto">
                                                    <div className="mb-6 flex w-full">
                                                        <FieldLabel className={`w-[30%] ${lang === "he" ? "ml-6" : "mr-6"}`}>
                                                            {t("clients.filterName")}
                                                        </FieldLabel>
                                                        <div className="w-[60%]">
                                                            <Controller
                                                                name="filter_name"
                                                                control={control}
                                                                render={({ field: { value, onChange, onBlur } }) => (
                                                                    <input
                                                                        className="shadow appearance-none outline-none border rounded w-full p-2 text-black"
                                                                        value={value}
                                                                        onChange={onChange}
                                                                        onBlur={onBlur}
                                                                    />
                                                                )}
                                                            />
                                                            {errors?.filter_name && <ErrorMessage message={errors.filter_name.message} />}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex mb-6">
                                                        <FieldLabel className={`w-[30%] ${lang === "he" ? "ml-6" : "mr-6"}`}>
                                                            {t("clients.conditions")}
                                                        </FieldLabel>
                                                        <div className="w-[60%]">
                                                            {conditions.length > 0 &&
                                                                conditions.map((filterCondition, i) => {
                                                                    return (
                                                                        <div className="flex w-full flex-wrap" key={i}>
                                                                            <FormControl
                                                                                sx={{ m: 1, minWidth: "200px" }}
                                                                                size="small"
                                                                            >
                                                                                <Select
                                                                                    labelId="demo-select-small-label"
                                                                                    id="demo-select-small"
                                                                                    value={filterCondition?.attr_name}
                                                                                    MenuProps={{
                                                                                        sx: {
                                                                                            maxHeight: "250px",
                                                                                        },
                                                                                    }}
                                                                                    onChange={(e) => filterFieldConditionUpdate("attr_name", e.target.value, i)}
                                                                                >
                                                                                    <MenuItem value="" disabled>
                                                                                        Select
                                                                                    </MenuItem>
                                                                                    {fullFormData.filter((item) => item?.data_type.value !== "file").map((field, i) => (
                                                                                        <MenuItem value={field?.field_slug} key={i} >
                                                                                            {field.field_name}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </Select>
                                                                                {errors?.filters?.length > 0 && errors?.filters[0]?.attr_name && <ErrorMessage message={errors?.filters[0]?.attr_name.message} />}
                                                                            </FormControl>
                                                                            <FormControl
                                                                                sx={{ m: 1, minWidth: "200px" }}
                                                                                size="small"
                                                                            >
                                                                                <Select
                                                                                    labelId="demo-select-small-label"
                                                                                    id="demo-select-small"
                                                                                    value={filterCondition?.condition}
                                                                                    MenuProps={{
                                                                                        sx: {
                                                                                            maxHeight: "250px",
                                                                                        },
                                                                                    }}
                                                                                    onChange={(e) => filterFieldConditionUpdate("condition", e.target.value, i)}
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
                                                                                                        filterCondition?.attr_name
                                                                                                )[0]?.data_type.value
                                                                                        )[0]
                                                                                        .conditions.map((condition, i) => (
                                                                                            <MenuItem
                                                                                                value={condition?.condition}
                                                                                                key={i}
                                                                                            >
                                                                                                {condition?.label}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                </Select>
                                                                                {errors?.filters?.length > 0 && errors?.filters[0]?.condition && <ErrorMessage message={errors?.filters[0]?.condition.message} />}
                                                                            </FormControl>
                                                                            <FormControl
                                                                                sx={{ m: 1, minWidth: "200px" }}
                                                                                size="small"
                                                                            >
                                                                                <input
                                                                                    className="shadow pl-2 appearance-none outline-none border rounded w-full py-2 text-black"
                                                                                    value={filterCondition?.value}
                                                                                    onChange={(e) => filterFieldConditionUpdate("value", e.target.value, i)}
                                                                                />
                                                                                {errors?.filters?.length > 0 && errors?.filters[0]?.value && <ErrorMessage message={errors?.filters[0]?.value.message} />}
                                                                            </FormControl>
                                                                            <MdDelete className="mx-1 self-center text-blueSecondary h-[22px] w-[22px] hover:cursor-pointer" onClick={() => deleteFilterCondition(i)} />
                                                                        </div>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex mb-6">
                                                        <FieldLabel className={`w-[30%] ${lang === "he" ? "ml-6" : "mr-6"}`}>
                                                        </FieldLabel>
                                                        <div className="w-[60%]">
                                                            <p className="w-fit p-3 rounded-md flex cursor-pointer items-center bg-gray-200" onClick={addConditionHandler}>
                                                                <IoIosAdd /> {t("clients.addCondition")}
                                                            </p>
                                                            {errors?.filters && <ErrorMessage message={errors.filters.message} />}
                                                        </div>
                                                    </div>
                                                    <div className="mb-6 flex w-full items-center">
                                                        <FieldLabel className={`w-[30%] ${lang === "he" ? "ml-6" : "mr-6"}`}>
                                                            {t("clients.setAsDefault")}
                                                        </FieldLabel>
                                                        <div className="w-[60%]">
                                                            <Controller
                                                                name="default"
                                                                control={control}
                                                                render={({ field: { value, onChange, onBlur } }) => (
                                                                    <CustomCheckBox
                                                                        checked={value}
                                                                        onChange={onChange}
                                                                        onBlur={onBlur}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end p-4 border-t border-solid border-blueGray-200 rounded-b">
                                                    <button
                                                        className="text-red-500 background-transparent font-bold uppercase px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1"
                                                        type="button"
                                                        onClick={() => setShowForm(false)}
                                                    >
                                                        {t("clients.goBack")}
                                                    </button>
                                                    <button
                                                        className="text-white text-[14px] font-small transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 uppercase px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                                        type="submit"
                                                    >
                                                        {t("netfree.save")}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {filters.length > 0 ? (
                                            <div className=" max-h-[calc(90vh-170px)] overflow-y-auto">
                                                {filters.map((filter, i) => {
                                                    return (
                                                        <div className="flex items-start justify-between p-6 border-solid rounded-t" key={i}>
                                                            {filter.name}
                                                            <div className="flex items-center ml-4">
                                                                {filter?.fg_default ? (
                                                                    <button
                                                                        className="text-red-500 mx-1 background-transparent font-semibold uppercase px-3 py-1 text-sm outline-none focus:outline-none"
                                                                        type="button"
                                                                        onClick={() => applyFilterHandler(filter, false)}
                                                                    >
                                                                        {t("netfree.remove")}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="text-white mx-1 text-sm transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 uppercase px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                                                                        type="button"
                                                                        onClick={() => applyFilterHandler(filter, true)}
                                                                    >
                                                                        {t("clients.apply")}
                                                                    </button>
                                                                )}
                                                                <EditButtonIcon extra="mx-1 h-[18px] w-[18px]" onClick={() => editFilterHandler(filter)} />
                                                                <MdDelete className="mx-1 text-blueSecondary h-[22px] w-[22px] hover:cursor-pointer" onClick={() => deleteFilterHandler(filter?.id)} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <NoDataFound description="No filters found" />
                                        )}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                {t("netfree.close")}
                                            </button>
                                        </div>
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
