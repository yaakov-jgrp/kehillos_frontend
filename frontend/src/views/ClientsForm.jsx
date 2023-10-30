import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import clientsService from '../services/clients';
import Loader from '../component/common/Loader';
import BlockButton from '../component/client/BlockButton';

const ClientsForm = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [fullFormData, setFullFormData] = useState(null);
    const [activeBlock, setActiveBlock] = useState(0);

    const fetchFullformDataHandler = async () => {
        setIsLoading(true);
        const res = await clientsService.getFullformData();
        setFullFormData(res.data.result)
        console.log(res.data.result);
        setTimeout(() => {
            setIsLoading(false);
        }, 500)
    }

    useEffect(() => {
        fetchFullformDataHandler();
    }, [])

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
                    <h5 className='text-start text-[12px] py-2 md:text-[16px] font-bold text-[#2B3674] w-[100%]'>{t('clients.sections')}</h5>
                    {fullFormData && fullFormData.map((blockData, index) => {
                        return <BlockButton key={index} active={activeBlock === index}>
                            {blockData.block}
                        </BlockButton>
                    })}
                </div>
                <div className='flex-2 w-3/4 p-2'>
                    <h5 className='text-start text-[12px] py-2 md:text-[16px] font-bold text-[#2B3674] w-[100%]'>{t('clients.fields')}</h5>
                </div>
            </div>
        </div>
    )
}

export default ClientsForm
