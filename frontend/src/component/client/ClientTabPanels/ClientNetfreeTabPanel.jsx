import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react'
import categoryService from '../../../services/category';
import { useTranslation } from "react-i18next";
import Loader from '../../common/Loader';
import FieldLabel from '../../fields/FormLabel';

function ClientNetfreeTabPanel(props) {
    const { children, value, index, netfreeprofile, isLoading, ...other } = props;
    const { t } = useTranslation();

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