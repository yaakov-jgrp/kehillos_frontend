import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import Loader from '../component/common/Loader';
import clientsService from '../services/clients';
import { useTranslation } from "react-i18next";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DetailsTabPanel from '../component/client/DetailsTabPanels/DetailsTabPanel';

function ClientDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const [isLoading, setIsloading] = useState(false);
    const [clientData, setClientData] = useState(null);
    const [value, setValue] = useState(0);

    const tabs = ["Details", "Netfree", "Requests"];

    const getClientDataHandler = () => {
        setIsloading(true);
        try {
            clientsService.getClient(id).then((res) => {
                setClientData(res.data);
                setIsloading(false);
            }).catch((err) => {
                console.log(err);
                setIsloading(false);
            });
        } catch (error) {
            console.log(err)
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    useEffect(() => {
        getClientDataHandler()
    }, [lang])

    return (
        <>
            {
                isLoading ? <Loader /> :
                    <div className='w-full h-full bg-white rounded-3xl p-5'>
                        {clientData ?
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        aria-label="basic tabs example"
                                    >
                                        {tabs.map((tabItem, i) => {
                                            return <Tab key={i} label={
                                                <>
                                                    <h5 className='text-start text-[12px] capitalize py-2 md:text-[16px] font-bold text-[#2B3674] w-[100%] flex items-center justify-between'>{tabItem}</h5>
                                                </>
                                            }
                                            />
                                        })}
                                    </Tabs>
                                </Box>
                                <DetailsTabPanel clientData={clientData} value={value} index={0} />
                            </Box>
                            : t('clients.noClientFound') + " " + id
                        }
                    </div>
            }
        </>
    )
}

export default ClientDetails