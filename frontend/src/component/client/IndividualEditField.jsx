import React, { useEffect, useState } from 'react'
import EditButtonIcon from '../common/EditButton';
import { DateFieldConstants } from '../../lib/FieldConstants';
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next";
import CustomField from '../fields/CustomField';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../common/ErrorMessage";
import clientsService from '../../services/clients';
import { errorsToastHandler } from '../../lib/CommonFunctions';
import utc from 'dayjs/plugin/utc';

function IndividualEditField({ field, clientData, setClientData }) {
    const emptyValues = ["", null, undefined];
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const { t } = useTranslation();
    dayjs.extend(utc);
    const [fieldValue, setfieldValue] = useState("");
    const [edit, setEdit] = useState(false);
    const [defaultValues, setDefaultValues] = useState({
        [field?.field_slug]: field?.value
    });

    const isDate = DateFieldConstants.includes(field.data_type.value);
    const isFile = field?.data_type?.value === "file";

    const schemaHandler = (type, name, required) => {
        let validation;
        if (type.value === "email") {
            validation = required ? yup.string().email(`${name} must be a valid mail`).required(`${name} is required`) : yup.string().email().notRequired();
        } else if (type.value === "file") {
            validation = required ? yup.mixed()
                .required(`${name} string is required`) : yup.mixed().notRequired();
        } else {
            validation = required ? yup.string().required(`${name} is required`) : validation = yup.string().notRequired();
        }
        return validation;
    }

    const schema = yup.object().shape(
        [field].reduce((acc, key) => {
            return {
                ...acc, [key.field_slug]: schemaHandler(key.data_type, key.field_name, key.required),
            };
        }, {})
    );

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

    const editShowHandler = () => {
        setEdit(!edit);
    }


    const submitForm = async (data, e) => {
        e.preventDefault();
        const formData = new FormData();
        let fieldsArray = [];

        for (const field in data) {
            if (field !== "netfree_profile" && typeof data[field] !== "object") {
                fieldsArray.push({
                    [field]: data[field]
                })
            }
            if (typeof data[field] === "object") {
                formData.append(field, data[field])
            }
        };

        const detailsData = {
            fields: fieldsArray
        }

        formData.append("data", JSON.stringify(detailsData));
        let clientCopy = clientData
        let blockIndex, fieldIndex;
        clientCopy.blocks.forEach((block, i) => block.field.forEach((item, j) => {
            if (item.field_slug === field?.field_slug) {
                blockIndex = i;
                fieldIndex = j;
            }
        }));
        const blockData = clientCopy.blocks[blockIndex];
        const fieldData = blockData.field[fieldIndex];
        switch (field?.data_type?.value) {
            case "select":
                const selectValue = fieldData?.enum_values?.choices.filter((item) => item.id == data[fieldData?.field_slug])[0];
                fieldData.value = selectValue.id;
                setfieldValue(selectValue.label);
                break;
            case "file":
                fieldData.value = data[fieldData?.field_slug].name;
                break;
            case "date":
                setfieldValue(dayjs(data[fieldData?.field_slug]).format("DD/MM/YYYY"))
            default:
                fieldData.value = data[fieldData?.field_slug];
                break;
        }
        blockData[fieldIndex] = fieldData;
        clientCopy[blockIndex] = blockData;
        if (fieldData?.data_type?.value !== "select" && fieldData?.data_type?.value !== "date") {
            setfieldValue(fieldData.value);
        }
        setClientData(clientCopy);
        clientsService.updateClient(formData, clientData.client_id).then((res) => {
            reset();
            setEdit(false);
        }).catch((err) => {
            errorsToastHandler(err?.response?.data?.error);
        });
    }

    useEffect(() => {
        let defaultValue;
        if (DateFieldConstants.includes(field.data_type.value) && !emptyValues.includes(field?.value)) {
            defaultValue = dayjs(field?.value)
            setfieldValue(dayjs(field?.value).format("DD/MM/YYYY"));
        } else if (field.data_type.value === "select") {
            defaultValue = field?.value[0];
            setfieldValue(field?.value[1]);
        } else if (field.data_type.value === "file") {
            defaultValue = field?.value.file_name?.split("upload/")[1];
        } else {
            defaultValue = field?.value;
        }
        if (field?.data_type?.value !== "select" && field?.data_type?.value !== "date") {
            setfieldValue(defaultValue);
        }
        setValue(field?.field_slug, defaultValue);
    }, [])

    return (
        <div className={`mb-2 ${lang === "he" ? "pr-6" : "pl-6"}`}>
            <div className={`flex items-center justify-between mb-1`}>
                <div className='flex w-full'>
                    <label className={`block text-black text-md kvfont-semibold w-1/5`}>
                        {lang === "he" ? field?.field_name_language.he : field?.field_name}
                    </label>
                    :
                    <div className='flex items-center justify-between w-full px-2'>
                        {
                            edit ?
                                <form
                                    style={{
                                        width: "100%",
                                        position: "relative",
                                    }}
                                    className='flex flex-col items-start'
                                    method="post"
                                    noValidate
                                    autoComplete="off"
                                    onSubmit={handleSubmit((data, e) => submitForm(data, e))}
                                >
                                    <div className='flex w-full'>
                                        <div className='flex flex-col items-start w-full'>
                                            <Controller
                                                name={field.field_slug}
                                                control={control}
                                                render={({ field: { value, onChange, onBlur } }) => {
                                                    return (
                                                        <CustomField setValue={setValue} disabled={false} field={field} onChange={(e) => {
                                                            if (isDate) {
                                                                setValue(field.field_slug, dayjs(e).utc(true).toISOString(), {
                                                                    shouldDirty: true,
                                                                    shouldValidate: true
                                                                })
                                                            } else if (isFile) {
                                                                setValue(field.field_slug, e.target.files[0], {
                                                                    shouldDirty: true,
                                                                    shouldValidate: true
                                                                })
                                                            } else {
                                                                onChange(e);
                                                            }
                                                        }}
                                                            value={value}
                                                            onBlur={onBlur}
                                                        />
                                                    )
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-end rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1"
                                                type="button"
                                                onClick={editShowHandler}
                                            >
                                                {t('netfree.close')}
                                            </button>
                                            <button
                                                className="text-white text-[14px] font-small transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 uppercase px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                                type="submit"
                                            >
                                                {t('netfree.save')}
                                            </button>
                                        </div>
                                    </div>
                                    {errors[field.field_slug] && <ErrorMessage message={errors[field.field_slug].message} />}
                                </form> :
                                <>
                                    <p className='text-sm mx-4 text-gray-900'>{`${emptyValues.includes(fieldValue) ? "" : fieldValue}`}</p>
                                    <EditButtonIcon extra="mr-2 justify-self-end" onClick={editShowHandler} />
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndividualEditField