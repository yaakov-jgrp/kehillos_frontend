import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../common/ErrorMessage";
import clientsService from '../../services/clients';
import { BlockFieldCheckValues, checkBoxValues, dataTypes } from '../../lib/FieldConstants';
import {
    MdCancel,
} from "react-icons/md";
import CustomCheckBox from '../fields/checkbox';
import Loader from '../common/Loader';



function BlockFieldModal({ block, blockId, setShowModal, onClick, editData }) {
    const { t } = useTranslation();
    const [selectValue, setSelectValue] = useState("");
    const [selectedValues, setSelectedValues] = useState([]);
    const [defaultValues, setDefaultValues] = useState(block ? {
        name: "",
        field_name_language: {
            he: ""
        },
        is_block_created: true
    } : {
        name: "",
        field_name_language: {
            he: ""
        },
        block_id: blockId,
        value: "",
        data_type: dataTypes[0],
        required: false,
        defaultvalue: "",
        unique: false,
        display: true
    });
    const [formLoading, setFormLoading] = useState(false);

    const schema = block ? yup.object().shape({
        name: yup.string().min(3, "Name must contain atleast 3 characters").required(),
        field_name_language: yup.object({
            he: yup.string().min(3, "Hebrew name must contain atleast 3 characters").required()
        }),
    }) : yup.object().shape({
        name: yup.string().min(3, "Name must contain atleast 3 characters").required(),
        field_name_language: yup.object({
            he: yup.string().min(3, "Hebrew name must contain atleast 3 characters").required()
        }),
        block_id: yup.string().required(),
        data_type: yup.string().required("Data type is required"),
        value: yup.string().when('data_type', {
            is: "select",
            then: () => yup.string().required('Minimum one value is required'),
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
                if (editData?.data_type === "select") {
                    const choices = editData?.enum_values?.choices?.map((item) => item.value);
                    setValue("value", choices.join(","));
                    setSelectedValues(choices);
                }
                setValue("name", editData?.field_name);
                setValue("data_type", editData?.data_type);
                setValue("defaultvalue", editData?.defaultvalue || "");
                setValue("required", editData?.required);
                setValue("unique", editData?.unique);
                setValue("display", editData?.display);
            }
        }
        setTimeout(() => {
            setFormLoading(false);
        }, 500)
    }

    const selectValueHandler = () => {
        if (selectValue !== "") {
            const values = [selectValue, ...selectedValues].join(",")
            setSelectedValues((prev) => ([selectValue, ...prev]))
            setValue("value", values, { shouldValidate: true, shouldDirty: true });
            setSelectValue("");
        }
    }

    const deleteSelectedValuesHandler = (index) => {
        const values = selectedValues.filter((item, itemIndex) => index !== itemIndex);
        setSelectedValues(values);
        setValue("value", values.join(","), { shouldValidate: true, shouldDirty: true });
    }

    const submitForm = async (data, e) => {
        e.preventDefault();
        if (editData) {
            let updatedData;
            const updateArray = [];
            if (block) {
                for (const dirtyField in dirtyFields) {
                    updateArray.push({
                        [dirtyField]: data[dirtyField],
                    })
                }
                const updateValues = updateArray.reduce((acc, curr) => Object.assign(acc, curr), {});
                updatedData = {
                    fields: [
                        {
                            id: editData?.block_id,
                            ...updateValues
                        }
                    ],
                    is_block: true
                };
            } else {
                for (const dirtyField in dirtyFields) {
                    if (!BlockFieldCheckValues.includes(dirtyField)) {
                        updateArray.push({
                            [dirtyField]: data[dirtyField],
                        })
                    }
                }
                for (const value of BlockFieldCheckValues) {
                    updateArray.push({
                        [value]: data[value],
                    })
                }
                const updateValues = updateArray.reduce((acc, curr) => Object.assign(acc, curr), {});
                updatedData = {
                    fields: [
                        {
                            id: editData.id,
                            ...updateValues
                        }
                    ]
                };
            }

            clientsService.updateBlockField(updatedData).then((res) => {
                reset();
                setShowModal(false);
                onClick();
            }).catch((err) => console.log(err));
        } else {
            let newDataValues = []
            for (const newValue in data) {
                newDataValues.push({
                    [newValue]: data[newValue]
                })
            }
            const newValues = newDataValues.reduce((acc, curr) => Object.assign(acc, curr), {});
            clientsService.createBlockField(newValues).then((res) => {
                reset();
                setShowModal(false);
                onClick();
            }).catch((err) => console.log(err));
        }

    }

    const addSelectValueHandler = (e) => {
        if (e.target.value !== "") {
            setSelectValue(e.target.value)
        }
    }

    useEffect(() => {
        initModal();
    }, [])

    return (
        <div className="fixed left-0 bottom-0 z-[99] h-screen w-screen bg-[#00000080] flex justify-center items-center">
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
                            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                <h3 className="text-2xl font-semibold">{editData ? t(block ? 'clients.editBlock' : 'clients.editField') : t(block ? 'clients.addBlock' : 'clients.addField')}</h3>
                                <button
                                    className="bg-transparent border-0 text-black float-right"
                                    onClick={() => setShowModal(false)}
                                >
                                    <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                                        x
                                    </span>
                                </button>
                            </div>
                            {!formLoading ? <div className="relative p-6 flex-auto max-h-[calc(90vh-170px)] overflow-y-auto">
                                <label className="block text-black text-sm font-bold my-1">
                                    {t('netfree.name')}
                                </label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" onChange={onChange} onBlur={onBlur} />
                                    )}
                                />
                                {errors.name && <ErrorMessage message={errors.name.message} />}
                                <label className="block text-black text-sm font-bold my-1">
                                    {t('netfree.nameHe')}
                                </label>
                                <Controller
                                    name="field_name_language.he"
                                    control={control}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" onChange={onChange} onBlur={onBlur} />
                                    )}
                                />
                                {errors?.field_name_language && <ErrorMessage message={errors?.field_name_language?.he?.message} />}
                                {!block &&
                                    <>
                                        <label className="block text-black text-sm font-bold my-1">
                                            {t('clients.dataType')}
                                        </label>
                                        <Controller
                                            name="data_type"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <select className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white" onChange={onChange} onBlur={onBlur} value={value} disabled={editData ? true : false} placeholder="Select Data Type">
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
                                        {errors.data_type && <ErrorMessage message={errors.data_type.message} />}
                                        {
                                            watch("data_type") === "select" ?
                                                <>
                                                    <label className="block text-black text-sm font-bold my-1">
                                                        {t('clients.value')}
                                                    </label>
                                                    <div className='w-full flex justify-between items-center mb-2'>
                                                        <input value={selectValue} className="shadow appearance-none outline-none border rounded w-3/4 py-2 px-1 text-black" onChange={addSelectValueHandler} />
                                                        <button type='button' className={`rounded-full w-1/5 py-1 px-4 h-fit text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`} onClick={selectValueHandler}>
                                                            {t("clients.add")}
                                                        </button>
                                                    </div>
                                                    {errors.value && <ErrorMessage message={errors.value.message} />}
                                                    <div className='flex flex-wrap'>
                                                        {selectedValues.map((value, index) => <p className='bg-[#ffffff] shadow-md rounded-md w-fit p-1 px-2 m-1 flex items-center' key={index}>{value}<MdCancel className="text-red-500 ml-1 w-4 h-4 hover:cursor-pointer" onClick={() => deleteSelectedValuesHandler(index)} /></p>)}
                                                    </div>
                                                    {selectedValues.length > 0 &&
                                                        <>
                                                            <label className="block text-black text-sm font-bold my-1">
                                                                {t('clients.defaultValue')}
                                                            </label>
                                                            <Controller
                                                                name="defaultvalue"
                                                                control={control}
                                                                render={({ field: { value, onChange, onBlur } }) => (
                                                                    <select className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white" onChange={onChange} onBlur={onBlur} value={value} placeholder="Select Default Value">
                                                                        {
                                                                            selectedValues?.map(el => {
                                                                                return (
                                                                                    el ? <option key={el} value={el}>{el}</option> : null
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                )}
                                                            />
                                                        </>
                                                    }
                                                </> :
                                                <>
                                                    {
                                                        watch("data_type") === "checkbox" ?
                                                            <>
                                                                <label className="block text-black text-sm my-1 font-bold">
                                                                    {t('clients.defaultValue')}
                                                                </label>
                                                                <Controller
                                                                    name="defaultvalue"
                                                                    control={control}
                                                                    render={({ field: { value, onChange, onBlur } }) => (
                                                                        <select className="shadow appearance-none border rounded  outline-none w-full py-2 px-1 text-black bg-white" onChange={onChange} onBlur={onBlur} value={value} placeholder="Select Default Value">
                                                                            {
                                                                                checkBoxValues.map(el => {
                                                                                    return (
                                                                                        el !== "" ? <option key={el} value={el}>{JSON.stringify(el)}</option> : null
                                                                                    );
                                                                                })
                                                                            }
                                                                        </select>
                                                                    )}
                                                                />
                                                            </>
                                                            : <>
                                                                {
                                                                    watch("data_type") === "date" ? null
                                                                        : <>
                                                                            <label className="block text-black text-sm font-bold my-1">
                                                                                {t('clients.defaultValue')}
                                                                            </label>
                                                                            <Controller
                                                                                name="defaultvalue"
                                                                                control={control}
                                                                                render={({ field: { value, onChange, onBlur } }) => (
                                                                                    <input value={value} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" onChange={onChange} onBlur={onBlur} />
                                                                                )}
                                                                            />
                                                                        </>
                                                                }
                                                            </>
                                                    }

                                                </>
                                        }
                                        <div className='flex my-2'>
                                            <Controller
                                                name="required"
                                                control={control}
                                                render={({ field: { value, onChange, name } }) => {
                                                    return (
                                                        <CustomCheckBox
                                                            className='mr-2'
                                                            checked={value}
                                                            defaultChecked={value}
                                                            onChange={onChange}
                                                        />
                                                    )
                                                }}
                                            />
                                            <label className="block text-black text-sm font-bold">
                                                {t('clients.required')}
                                            </label>
                                        </div>
                                        <div className='flex my-2'>
                                            <Controller
                                                name="unique"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomCheckBox
                                                        className='mr-2'
                                                        checked={value}
                                                        defaultChecked={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                            />
                                            <label className="block text-black text-sm font-bold">
                                                {t('clients.unique')}
                                            </label>
                                        </div>
                                        {/* <div className='flex my-2'>
                                            <Controller
                                                name="display"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomCheckBox
                                                        className='mr-2'
                                                        defaultChecked={value}
                                                        checked={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                            />
                                            <label className="block text-black text-sm font-bold">
                                                {t('clients.display')}
                                            </label>
                                        </div> */}
                                    </>
                                }
                            </div> :
                                <div className='h-[50vh] w-full flex justify-center items-center'>
                                    <Loader />
                                </div>
                            }
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