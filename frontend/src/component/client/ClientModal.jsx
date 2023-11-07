import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clientsService from "../../services/clients";
import ErrorMessage from "../common/ErrorMessage";
import { errorsToastHandler } from "../../lib/CommonFunctions";
import CustomField from "../fields/CustomField";
import EditButtonIcon from "../common/EditButton";
import { MdDelete } from "react-icons/md";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { NumberFieldConstants, checkBoxConstants } from "../../lib/FieldConstants";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';


const ClientModal = ({ showModal, setShowModal, client, newClient, onClick, clientLists, netfreeProfiles, fullFormData }) => {
    const { t } = useTranslation();
    dayjs.extend(utc);
    // Array of objects
    const arr = fullFormData.map((item) => {
        let value = "";
        if (item.data_type === "select") {
            value = item.enum_values.choices[0].id;
        }
        if (item.data_type === "date") {
            value = dayjs(Date.now());
        }
        return {
            [item.field_slug]: value
        }
    });

    arr.push({
        netfree_profile: netfreeProfiles[0].id,
    })

    // Combine all objects into a single object
    const result = arr.reduce((acc, curr) => Object.assign(acc, curr), {});
    const defaultValues = result;

    const schemaHandler = (type, required) => {
        let validation;
        if (type === "email") {
            validation = required ? validation = yup.string().email().required() : validation = yup.string().email().notRequired();
        } else {
            validation = required ? yup.string().required() : validation = yup.string().notRequired();
        }
        return validation;
    }

    const schema = yup.object().shape(
        fullFormData.reduce((acc, key) => {
            return {
                ...acc, [key.field_slug]: schemaHandler(key.data_type, key.required),
            };
        }, {})
    );

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

    const submitForm = async (data, e) => {
        e.preventDefault();
        let fieldsArray = [];
        for (const field in data) {
            if (field !== "netfree_profile") {
                if (field.includes("date")) {
                    fieldsArray.push({
                        [field]: dayjs(data[field]).utc(true).toISOString()
                    })
                } else {
                    fieldsArray.push({
                        [field]: data[field]
                    })
                }
            }
        };
        const formData = {
            netfree_profile: data.netfree_profile,
            fields: fieldsArray
        }
        if (newClient) {
            clientsService.saveClient(formData).then((res) => {
                reset();
                setShowModal(!showModal);
                onClick();
            }).catch((err) => {
                if (err.response.data.error.length > 0) {
                    errorsToastHandler(err.response.data.error);
                }
            });
        } else {
            const updateData = {
                ...formData,
                fields: formData.fields.filter((field) => !field["id"])
            }
            clientsService.updateClient(updateData, data.id).then((res) => {
                reset();
                setShowModal(!showModal);
                onClick();
            }).catch((err) => {
                if (err.response.data.error.length > 0) {
                    errorsToastHandler(err.response.data.error);
                }
            });
        }
    }


    useEffect(() => {
        reset();
        if (clientLists && netfreeProfiles && client) {
            let data;
            if (!newClient) {
                data = client;
                setValue("netfree_profile", client.netfree_profile);
            } else {
                setValue("netfree_profile", netfreeProfiles[0].id);
            }
            for (let value in data) {
                if (value !== "netfree_profile") {
                    setValue(value, typeof data[value] === "object" ? data[value].id : data[value]);
                }
            }
        }
    }, [JSON.stringify(client), newClient]);

    return (
        <>
            {showModal && fullFormData.length > 0 ? (
                <div className="fixed left-0 bottom-0 z-[99] h-screen w-screen bg-[#00000080] flex justify-center items-center">
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="w-[100%] min-w-[300px] md:min-w-[400px] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                        <h3 className="text-2xl font-semibold">{t('netfree.addClient')}</h3>
                                        <button
                                            className="bg-transparent border-0 text-black float-right"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                                                x
                                            </span>
                                        </button>
                                    </div>
                                    <div className="relative p-6 flex-auto max-h-[calc(90vh-170px)] overflow-y-auto">
                                        <label className="block text-black text-sm font-bold mb-1">
                                            {t('netfree.netfreeProfile')}
                                        </label>
                                        <Controller
                                            name="netfree_profile"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <select className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white" onChange={onChange} value={value} placeholder="Select Profile">
                                                    {
                                                        netfreeProfiles?.map(el => {
                                                            return (
                                                                el ? <option key={el.id} value={el.id}>{el.name}</option> : null
                                                            );
                                                        })
                                                    }
                                                </select>
                                            )}
                                        />
                                        {errors.netfree_profile && <ErrorMessage message={errors.netfree_profile.message} />}
                                        {
                                            fullFormData.map((field, index) => {
                                                const isCheckBox = checkBoxConstants.includes(field.data_type);
                                                return (
                                                    <div className={`mb-2 ${isCheckBox ? "flex items-center justify-end flex-row-reverse" : ""}`} key={index}>
                                                        <label className={`block text-black text-sm flex items-center justify-between font-bold ${isCheckBox ? "ml-2 w-full" : "mb-1"}`}>
                                                            {field?.field_name}
                                                        </label>
                                                        <Controller
                                                            name={field.field_slug}
                                                            control={control}
                                                            render={({ field: { value, onChange, onBlur } }) => (
                                                                <CustomField field={field} onChange={onChange} value={value} onBlur={onBlur} />
                                                            )}
                                                        />
                                                        {errors[field.field_slug] && <ErrorMessage message={errors[field.field_slug].message} />}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={() => setShowModal(false)}
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default React.memo(ClientModal);