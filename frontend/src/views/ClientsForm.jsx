import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import clientsService from '../services/clients';
import Loader from '../component/common/Loader';
import BlockButton from '../component/client/BlockButton';
import { Accordion } from '@chakra-ui/react';
import CustomAccordion from '../component/common/Accordion';
import BlockFieldModal from '../component/client/BlockFieldModal';
import AddButtonIcon from '../component/common/AddButton';
import CustomField from '../component/fields/CustomField';
import { checkBoxConstants } from '../lib/FieldConstants';
import {
    MdDelete,
} from "react-icons/md";
import EditButtonIcon from "../component/common/EditButton";
import { Draggable } from "react-drag-reorder";
import { FiSettings } from 'react-icons/fi';
import { PiDotsSixVerticalBold } from 'react-icons/pi'
import DisplayFieldsModal from '../component/client/DisplayFieldsModal';

const ClientsForm = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [fullFormData, setFullFormData] = useState(null);
    const [activeBlock, setActiveBlock] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isAddBlock, setIsAddBlock] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showDisplayModal, setShowDisplayModal] = useState(false);
    const [displayFields, setDisplayFields] = useState([]);
    const [displayFormValues, setDisplayFormValues] = useState({});

    const fetchFullformDataHandler = useCallback(async () => {
        setIsLoading(true);
        const res = await clientsService.getFullformData();
        setFullFormData(res.data.result)
        let displayfields = [];
        res.data.result.forEach((block) => {
            const data = block?.field.map((fieldData) => {
                return ({
                    id: fieldData?.id,
                    name: fieldData?.field_name,
                    slug: fieldData?.field_slug,
                    display: fieldData?.display
                })
            })
            data.forEach((item) => {
                displayfields.push(item)
            })
        });
        // Array of objects
        const arr = displayfields.map((item) => {
            return {
                [item.slug]: item.display
            }
        });

        // Combine all objects into a single object
        const result = arr.reduce((acc, curr) => Object.assign(acc, curr), {});

        setDisplayFormValues(result);
        setDisplayFields(displayfields);
        setTimeout(() => {
            setIsLoading(false);
        }, 500)
    }, []);


    const showModalHandler = () => {
        setShowModal(!showModal);
    }

    const addBlockFieldModalHandler = (value, id) => {
        setEditData(null);
        setIsAddBlock(value);
        showModalHandler();
        activeBlockHandler(id);
    }

    const activeBlockHandler = useCallback((value) => {
        setActiveBlock(value);
    }, []);

    const deleteBlockFieldHandler = async (id, isBlock) => {
        const formData = {
            id: id,
            is_block: isBlock
        }
        const res = await clientsService.deleteBlockField(formData);
        fetchFullformDataHandler();
    }

    const editBlockFieldModalHandler = (data, isBlock) => {
        let editableData = JSON.parse(JSON.stringify(data));
        if (isBlock) {
            delete editableData["field"];
        }
        setIsAddBlock(isBlock);
        setEditData(editableData);
        showModalHandler();
    }

    const orderChangeHandler = (curr, now, items, isBlock) => {
        const reorderedItems = items;
        const draggedItem = reorderedItems[curr];
        reorderedItems.splice(curr, 1);
        reorderedItems.splice(now, 0, draggedItem);
        const updated = reorderedItems.map((item, index) => {
            return {
                id: isBlock ? item.block_id : item.id,
                display_order: index + 1
            }
        });
        return updated;
    }

    const getChangedFieldsPos = async (currentPos, newPos, isBlock, blockId) => {
        let updatedData;
        if (isBlock) {
            const blocksData = JSON.parse(JSON.stringify(fullFormData));
            delete blocksData.field;
            const updateFields = orderChangeHandler(currentPos, newPos, blocksData, true)
            // Update the order attribute based on the new order
            updatedData = {
                fields: updateFields,
                is_block: true
            };

        } else {
            const blockData = fullFormData.filter((block) => block.block_id === blockId);
            const updateFields = orderChangeHandler(currentPos, newPos, blockData[0].field, false)
            // Update the order attribute based on the new order
            updatedData = {
                fields: updateFields
            };
        }

        const res = await clientsService.updateBlockField(updatedData);
    };

    useEffect(() => {
        fetchFullformDataHandler();
    }, [fetchFullformDataHandler]);

    return (
        <div className='w-full bg-white rounded-3xl'>
            {
                isLoading &&
                <div className='h-[90vh] w-full flex justify-center items-center'>
                    <Loader />
                </div>
            }
            <div className='h-[calc(100vh-100px)] flex overflow-y-auto overflow-x-auto mx-5 px-2'>
                <div className='flex-1 w-1/4 p-2'>
                    <h5 className='text-start text-[12px] py-2 md:text-[16px] font-bold text-[#2B3674] w-[100%] flex items-center justify-between'>{t('clients.sections')} <AddButtonIcon onClick={() => addBlockFieldModalHandler(true)} /></h5>
                    {
                        fullFormData && !isLoading && fullFormData.length > 0 ? <Draggable onPosChange={(currentPos, newPos,) => getChangedFieldsPos(currentPos, newPos, true)}>
                            {fullFormData.map((blockData, index) =>
                                <BlockButton
                                    classes="flex items-center justify-between custom-word-break"
                                    key={index}
                                    onClick={() => activeBlockHandler(blockData.block_id)}
                                    active={activeBlock === blockData.block_id}>
                                    {blockData.block}
                                    <div className='flex items-center'>
                                        {blockData?.is_editable && <EditButtonIcon extra="mr-2" onClick={() => editBlockFieldModalHandler(blockData, true)} />}
                                        {blockData?.is_delete && <MdDelete className="mr-2 text-blueSecondary w-4 h-4 hover:cursor-pointer" onClick={() => deleteBlockFieldHandler(blockData.block_id, true)} />}
                                        <PiDotsSixVerticalBold className='cursor-grab z-20' />
                                    </div>
                                </BlockButton>
                            )}
                        </Draggable> : <p>{t("clients.noSections")}</p>
                    }

                </div>
                <div className='flex-2 w-3/4 p-2'>
                    <h5 className='text-start flex items-center justify-between text-[12px] py-2 md:text-[16px] font-bold text-[#2B3674] w-[100%]'>
                        {t('clients.fields')}
                        <label className={`w-fit rounded-full flex items-center py-1 px-3 mr-1 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`} onClick={() => setShowDisplayModal(!showDisplayModal)}>
                            {t("clients.display")}
                            <FiSettings className={`rounded-full text-white ml-1 w-3 h-3 hover:cursor-pointer`} />
                        </label>
                    </h5>
                    <Accordion defaultIndex={[0]} allowMultiple>
                        {fullFormData && !isLoading && fullFormData.map((blockData, index) => <CustomAccordion key={index} title={blockData.block} onClick={() => addBlockFieldModalHandler(false, blockData.block_id)} >
                            {blockData.field.length > 0 ?
                                <>
                                    <Draggable onPosChange={(currentPos, newPos,) => getChangedFieldsPos(currentPos, newPos, false, blockData.block_id)}>
                                        {
                                            blockData.field.map((field, index) => {
                                                const isCheckBox = checkBoxConstants.includes(field.data_type);
                                                return (
                                                    <div className={`mb-2 ${isCheckBox ? "flex items-center justify-end flex-row-reverse" : ""}`} key={index}>
                                                        <label className={`block text-black text-sm flex items-center justify-between font-bold ${isCheckBox ? "ml-2 w-full" : "mb-1"}`}>
                                                            {field?.field_name}
                                                            <div className='flex items-center'>
                                                                {field?.is_editable && <EditButtonIcon extra="mr-2" onClick={() => editBlockFieldModalHandler(field, false)} />}
                                                                {field?.is_delete && <MdDelete className="mr-2 text-blueSecondary w-4 h-4 hover:cursor-pointer" onClick={() => deleteBlockFieldHandler(field?.id, false)} />}
                                                                <PiDotsSixVerticalBold className='cursor-grab z-20' />
                                                            </div>
                                                        </label>
                                                        <CustomField field={field} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Draggable>
                                </> : <p>{t("clients.noFields")}</p>}
                        </CustomAccordion>)}
                    </Accordion>
                </div>
                {
                    showModal && <BlockFieldModal editData={editData} block={isAddBlock} blockId={activeBlock} onClick={() => fetchFullformDataHandler()} setShowModal={setShowModal} />
                }
                {
                    showDisplayModal && <DisplayFieldsModal formValues={displayFormValues} displayFields={displayFields} onClick={() => fetchFullformDataHandler()} showModal={showDisplayModal} setShowModal={setShowDisplayModal} />
                }
            </div>
        </div>
    )
}

export default ClientsForm
