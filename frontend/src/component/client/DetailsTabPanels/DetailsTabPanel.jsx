import React from 'react';
import Box from '@mui/material/Box';
import CustomAccordion from '../../common/Accordion';
import CustomField from '../../fields/CustomField';
import { useTranslation } from "react-i18next";
import { DateFieldConstants, checkBoxConstants } from '../../../lib/FieldConstants';
import { Accordion } from '@chakra-ui/react';
import dayjs from 'dayjs';

function DetailsTabPanel(props) {
    const { children, value, index, clientData, ...other } = props;
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
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
                    <Accordion>
                        {clientData && clientData.blocks.map((blockData, index) => <CustomAccordion key={index} showAddButton={false} title={lang === "he" ? blockData.field_name_language.he : blockData.block} >
                            {blockData.field.length > 0 ?
                                <>
                                    {
                                        blockData.field.map((field, index) => {
                                            const isCheckBox = checkBoxConstants.includes(field.data_type);
                                            let value;
                                            if (DateFieldConstants.includes(field.data_type)) {
                                                value = dayjs(field?.value).format("DD/MM/YYYY");
                                            } else if (field.data_type === "select") {
                                                value = field?.value[1];
                                            } else {
                                                value = field?.value;
                                            }


                                            return (
                                                <div className={`mb-2 ${isCheckBox ? "flex items-center justify-end flex-row-reverse" : ""}`} key={index}>
                                                    <div className={`flex items-center justify-between ${isCheckBox ? "ml-2 w-full" : "mb-1"}`}>
                                                        <div className='flex'>
                                                            <label className={`block text-black text-sm font-bold`}>
                                                                {lang === "he" ? field?.field_name_language.he : field?.field_name}
                                                            </label>
                                                            <p className='text-sm ml-1 capitalize text-gray-900'>{` : ${value}`}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </> : <p>{t("clients.noFields")}</p>}
                        </CustomAccordion>)}
                    </Accordion>
                </Box>
            )}
        </div>
    );
}

export default DetailsTabPanel

