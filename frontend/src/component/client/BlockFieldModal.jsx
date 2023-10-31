import React from 'react'
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../common/ErrorMessage";
import clientsService from '../../services/clients';
import { dataTypes } from '../../lib/FieldConstants';



function BlockFieldModal({ block, blockId, setShowModal, onClick }) {
    const { t } = useTranslation();
    const defaultValues = block ? { name: "", is_block_created: true } :
        {
            name: "",
            block_id: blockId,
            value: "",
            data_type: dataTypes[0],
            required: true,
            defaultvalue: "",
            unique: false,
            display: true
        };
    const schema = block ? yup.object().shape({
        name: yup.string().min(3, "Name must contain atleast 3 characters").required(),
    }) : yup.object().shape({
        name: yup.string().min(3, "Name must contain atleast 3 characters").required(),
        block_id: yup.string().required(),
        data_type: yup.string().required("Data type is required"),
        value: yup.string().when('data_type', {
            is: "select",
            then: yup.string().required('Minimum one value is required'),
            otherwise: yup.string(),
        }),
        required: yup.boolean().required(),
        defaultValue: yup.string().notRequired(),
        unique: yup.boolean().required(),
        display: yup.boolean().required(),
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
        const formData = new FormData()
        if (block) {
            for (const value in data) {
                formData.append(value, data[value])
            }
            const res = await clientsService.createBlockField(formData);
            setShowModal(false);
            onClick();
        }
    }

    return (
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
                                <h3 className="text-2xl font-semibold">{t(block ? 'clients.addBlock' : 'clients.addField')}</h3>
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
                                    {t('netfree.name')}
                                </label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required onChange={onChange} onBlur={onBlur} />
                                    )}
                                />
                                {errors.name && <ErrorMessage message={errors.name.message} />}
                                {!block &&
                                    <>
                                        <label className="block text-black text-sm font-bold mb-1">
                                            {t('clients.dataType')}
                                        </label>
                                        <Controller
                                            name="data_type"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <select className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white" onChange={onChange} value={value} placeholder="Select Profile">
                                                    {
                                                        dataTypes?.map(el => {
                                                            return (
                                                                el ? <option key={el} value={el}>{el}</option> : null
                                                            );
                                                        })
                                                    }
                                                </select>
                                            )}
                                        />
                                    </>}
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
    )
}

export default BlockFieldModal