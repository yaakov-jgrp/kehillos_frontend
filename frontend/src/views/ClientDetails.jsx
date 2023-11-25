import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import clientsService from '../services/clients';
import { useTranslation } from "react-i18next";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DetailsTabPanel from '../component/client/ClientTabPanels/DetailsTabPanel';
import RequestsTabPanel from '../component/client/ClientTabPanels/RequestsTabPanel';
import ClientNetfreeTabPanel from '../component/client/ClientTabPanels/ClientNetfreeTabPanel';
import { FaUser } from 'react-icons/fa';
import categoryService from '../services/category';

function ClientDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const tabs = ["Details", "Netfree", "Requests"];
    const [isLoading, setIsloading] = useState(false);
    const [clientData, setClientData] = useState(null);
    const [value, setValue] = useState(0);
    const [netfreeprofile, setNetfreeProfile] = useState(null);

    const getClientDataHandler = async () => {
        setIsloading(true);
        try {
            const profilesData = await categoryService.getProfilesList();
            const netfreeProfiles = profilesData.data.data;
            clientsService.getClient(id).then((res) => {
                setClientData(res.data);
                setIsloading(false);
                if (netfreeProfiles.length > 0) {
                    const { netfree_profile } = res.data;
                    const matchingProfile = netfreeProfiles.filter((profile) => profile.id === netfree_profile)[0];
                    setNetfreeProfile(matchingProfile);
                }
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
        getClientDataHandler();
    }, [lang])

    return (
        <>
            <div className='w-full h-full bg-white rounded-3xl p-5'>
                {clientData && !isLoading ?
                    <Box sx={{ width: '100%', height: "100%", overflow: "auto" }}>
                        <div className='flex p-2'>
                            <div className='p-2 mr-2 rounded-lg shadow-md'>
                                <FaUser color='lightgrey' size={80} />
                            </div>
                            <div className='ml-2 flex flex-col w-[80%] text-sm'>
                                <div className={`mb-1 flex w-full items-start`}>
                                    <span className='font-semibold w-1/6'>ID</span>
                                    <p>  : {clientData?.client_id}</p>
                                </div>
                                <div className={`mb-1 flex w-full items-start`}>
                                    <span className='font-semibold w-1/6'>Netfree Profile</span>
                                    :
                                    <div className='ml-1'>
                                        <p className='capitalize'>{netfreeprofile?.name}</p>
                                        <p className='capitalize text-gray-700'>({netfreeprofile?.description})</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        {value === 0 && <DetailsTabPanel isLoading={isLoading} clientData={clientData} value={value} index={0} />}
                        {value === 1 && <ClientNetfreeTabPanel isLoading={isLoading} netfreeprofile={netfreeprofile} value={value} index={1} />}
                        {value === 2 && <RequestsTabPanel id={id} value={value} index={2} />}
                    </Box>
                    : t('clients.noClientFound') + " " + id
                }
            </div>
        </>
    )
}

export default ClientDetails