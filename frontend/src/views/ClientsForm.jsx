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

const ClientsForm = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [fullFormData, setFullFormData] = useState(null);
    const [activeBlock, setActiveBlock] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isAddBlock, setIsAddBlock] = useState(false);

    const fetchFullformDataHandler = useCallback(async () => {
        setIsLoading(true);
        const res = await clientsService.getFullformData();
        setFullFormData(res.data.result)
        setTimeout(() => {
            setIsLoading(false);
        }, 500)
    }, [])

    const showModalHandler = () => {
        setShowModal(!showModal);
    }

    const addBlockFieldModalHandler = (value, id) => {
        setIsAddBlock(value);
        showModalHandler();
        activeBlockHandler(id);
    }

    const activeBlockHandler = useCallback((value) => {
        setActiveBlock(value);
    }, []);

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
                    {fullFormData && fullFormData.map((blockData, index) =>
                        <BlockButton
                            key={index}
                            onClick={() => activeBlockHandler(blockData.block_id)}
                            active={activeBlock === blockData.block_id}>
                            {blockData.block}
                        </BlockButton>
                    )}
                </div>
                <div className='flex-2 w-3/4 p-2'>
                    <h5 className='text-start text-[12px] py-2 md:text-[16px] font-bold text-[#2B3674] w-[100%]'>{t('clients.fields')}</h5>
                    <Accordion defaultIndex={[0]} allowMultiple>
                        {fullFormData && fullFormData.map((blockData, index) => <CustomAccordion key={index} title={blockData.block} onClick={() => addBlockFieldModalHandler(false, blockData.block_id)} >
                            {blockData.field.length > 0 ?
                                <>
                                    {
                                        blockData.field.map((field, index) => {
                                            const isCheckBox = checkBoxConstants.includes(field.data_type);
                                            return (
                                                <div className={isCheckBox && "flex items-center justify-end flex-row-reverse"}>
                                                    <label className={`block text-black text-sm font-bold ${isCheckBox ? "ml-2" : "mb-1"}`}>
                                                        {field?.field_name}
                                                    </label>
                                                    <CustomField field={field} />
                                                </div>
                                            )
                                        })
                                    }
                                </> : "No fields"}
                        </CustomAccordion>)}
                    </Accordion>
                </div>
                {
                    showModal && <BlockFieldModal block={isAddBlock} blockId={activeBlock} onClick={() => fetchFullformDataHandler()} setShowModal={setShowModal} />
                }
            </div>
        </div>
    )
}

export default ClientsForm
