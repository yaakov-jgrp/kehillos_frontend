import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react'
import categoryService from '../../../services/category';
import { useTranslation } from "react-i18next";
import Loader from '../../common/Loader';
import FieldLabel from '../../fields/FormLabel';

function ClientNetfreeTabPanel(props) {
    const { children, value, index, clientData, isLoading, setIsloading, ...other } = props;
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const { t } = useTranslation();
    const [netfreeprofile, setNetfreeProfile] = useState({});

    const fetchNetfreeProfiles = () => {
        setIsloading(true);
        try {
            categoryService.getProfilesList().then((res) => {
                const netfreeProfiles = res.data.data;
                if (clientData && netfreeProfiles.length > 0) {
                    const { netfree_profile } = clientData;
                    const matchingProfile = netfreeProfiles.filter((profile) => profile.id === netfree_profile)[0];
                    setNetfreeProfile(matchingProfile);
                    setIsloading(false);
                }
            }).catch((err) => {
                console.log(err);
                setIsloading(false);
            })
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchNetfreeProfiles();
    }, [lang]);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {isLoading ? <Loader /> :
                        <>
                            <div className={`mb-6 flex w-full items-start`}>
                                <FieldLabel className="mr-6">
                                    {t("netfree.netfreeProfile")}
                                </FieldLabel>
                                :
                                <div className='ml-6'>
                                    <p className='capitalize'>{netfreeprofile?.name}</p>
                                    <p className='capitalize text-gray-700'>({netfreeprofile?.description})</p>
                                </div>
                            </div>
                        </>
                    }
                </Box>
            )}
        </div>
    )
}

export default ClientNetfreeTabPanel