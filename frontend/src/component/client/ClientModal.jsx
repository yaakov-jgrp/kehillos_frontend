import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clientsService from "../../services/clients";
import ErrorMessage from "../common/ErrorMessage";
import { errorsToastHandler } from "../../lib/CommonFunctions";

const intialValues = {
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    sector: "",
    netfree_profile: ""
}

const ClientModal = ({ showModal, setShowModal, client, newClient, onClick, clientLists, netfreeProfiles }) => {
    const { t } = useTranslation();
    const defaultValues = intialValues;
    const schema = yup.object().shape({
        user_id: yup
            .string()
            .required("Please enter valid User ID"),
        first_name: yup
            .string()
            .min(3, "Name must contain least 3 characters")
            .required("Please enter valid first name"),
        last_name: yup
            .string()
            .notRequired("Please enter valid last name"),
        email: yup.string().email().required("Please enter valid email"),
        phone: yup.string().notRequired("Please enter valid phone"),
        sector: yup.string().notRequired("Please enter valid sector"),
        netfree_profile: yup.string().required("Please select valid profile"),
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

    const submitForm = async (data, e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let field in data) {
            if (field !== "full_name" && field !== "name") {
                formData.append(field, data[field]);
            }
        }
        formData.append("full_name", `${data.first_name} ${data.last_name}`);
        formData.append("name", data.first_name);
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
            clientsService.updateClient(formData, data.id).then((res) => {
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
                data = intialValues;
                setValue("netfree_profile", netfreeProfiles[0].id);
            }
            for (let value in data) {
                if (value !== "netfree_profile") {
                    setValue(value, data[value]);
                }
            }
        }
    }, [JSON.stringify(client), newClient]);

    return (
        <>
            {showModal ? (
                <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="min-w-300px md:min-w-[400px] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
                                            {t('netfree.userID')}
                                        </label>
                                        <Controller
                                            name="user_id"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required onChange={onChange} onBlur={onBlur} />
                                            )}
                                        />
                                        {errors.user_id && <ErrorMessage message={errors.user_id.message} />}
                                        <label className="block text-black text-sm font-bold mb-1">
                                            {t('netfree.firstName')}
                                        </label>
                                        <Controller
                                            name="first_name"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required onChange={onChange} onBlur={onBlur} />
                                            )}
                                        />
                                        {errors.first_name && <ErrorMessage message={errors.first_name.message} />}
                                        <label className="block text-black text-sm font-bold mb-1">
                                            {t('netfree.lastName')}
                                        </label>
                                        <Controller
                                            name="last_name"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required onChange={onChange} onBlur={onBlur} />
                                            )}
                                        />
                                        {errors.last_name && <ErrorMessage message={errors.last_name.message} />}
                                        <label className="block text-black text-sm font-bold mb-1">
                                            {t('netfree.email')}
                                        </label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required onChange={onChange} onBlur={onBlur} />
                                            )}
                                        />
                                        {errors.email && <ErrorMessage message={errors.email.message} />}
                                        <label className="block text-black text-sm font-bold mb-1">
                                            {t('netfree.phone')}
                                        </label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required onChange={onChange} onBlur={onBlur} />
                                            )}
                                        />
                                        {errors.phone && <ErrorMessage message={errors.phone.message} />}
                                        <label className="block text-black text-sm font-bold mb-1">
                                            {t('netfree.sector')}
                                        </label>
                                        <Controller
                                            name="sector"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required onChange={onChange} onBlur={onBlur} />
                                            )}
                                        />
                                        {errors.sector && <ErrorMessage message={errors.sector.message} />}
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