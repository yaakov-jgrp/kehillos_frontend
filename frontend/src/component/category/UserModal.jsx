import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../common/ErrorMessage";
import FieldLabel from "../fields/FormLabel";
import { toast } from "react-toastify";
import authService from "../../services/auth";

function UserModal({ showModal, setShowModal, user, newUser, onClick }) {
    const { t } = useTranslation();
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const [defaultValues, setDefaultValues] = useState({
        name: "",
        email: "",
        password: ""
    });

    const schema = yup.object().shape({
        name: yup.string().min(3, "Name must contain atleast 3 characters").required(),
        email: yup.string().email(`Email must be a valid mail`).required(`Email is required`),
        password: yup.lazy((value) => {
            if (newUser) {
                return yup.string().min(6, "Password must contain atleast 6 characters").required()
            }
            return yup.string().notRequired();
        }),
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

    const submitForm = async (data, e) => {
        e.preventDefault();
        try {
            if (newUser) {
                const res = await authService.createUser(data);
            } else {
                const res = await authService.editUser(data, user?.id);
            }
            setShowModal(false);
            reset();
            onClick();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!newUser) {
            setValue("name", user?.name);
            setValue("email", user?.email);
        }
    }, [])

    return (
        <>
            {showModal &&
                <div className="fixed left-0 bottom-0 z-[99] h-screen w-screen bg-[#00000080] flex justify-center items-center">
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-7xl">
                            <div className="w-[100%] min-w-[80vw] md:min-w-[70vw] lg:min-w-[60vw] overflow-y-auto border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
                                    <div className="flex items-start justify-between p-5 shadow-md rounded-t">
                                        <h3 className="text-xl font-bold">{newUser ? t('netfree.addUser') : t('netfree.editUser')}</h3>
                                        <button
                                            className="bg-transparent border-0 text-black float-right"
                                            onClick={() => setShowModal(false)}
                                            type="button"
                                        >
                                            <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                                                x
                                            </span>
                                        </button>
                                    </div>
                                    <div className="relative p-6 flex-auto max-h-[calc(90vh-170px)] overflow-y-auto">
                                        <div className="mb-6 flex w-full items-center">
                                            <FieldLabel className={`w-[30%] ${lang === "he" ? "ml-6" : "mr-6"}`}>
                                                {t('netfree.name')}
                                            </FieldLabel>
                                            <div className="w-[60%]">
                                                <Controller
                                                    name="name"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input
                                                            type="text"
                                                            className="shadow appearance-none outline-none border rounded w-full p-2 text-black"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.name && <ErrorMessage message={errors.name.message} />}
                                            </div>
                                        </div>
                                        <div className="mb-6 flex w-full items-center">
                                            <FieldLabel className={`w-[30%] ${lang === "he" ? "ml-6" : "mr-6"}`}>
                                                {t('netfree.email')}
                                            </FieldLabel>
                                            <div className="w-[60%]">
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input
                                                            type="text"
                                                            className="shadow appearance-none outline-none border rounded w-full p-2 text-black"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.email && <ErrorMessage message={errors.email.message} />}
                                            </div>
                                        </div>
                                        <div className="mb-6 flex w-full items-center">
                                            <FieldLabel className={`w-[30%] ${lang === "he" ? "ml-6" : "mr-6"}`}>
                                                {t('auth.password')}
                                            </FieldLabel>
                                            <div className="w-[60%]">
                                                <Controller
                                                    name="password"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input
                                                            type="text"
                                                            className="shadow appearance-none outline-none border rounded w-full p-2 text-black"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.password && <ErrorMessage message={errors.password.message} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end p-4 border-t border-solid border-blueGray-200 rounded-b">
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
            }
        </>
    )
}

export default UserModal