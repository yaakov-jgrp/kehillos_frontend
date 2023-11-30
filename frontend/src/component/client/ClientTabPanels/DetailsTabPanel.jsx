import React from 'react';
import Box from '@mui/material/Box';
import CustomAccordion from '../../common/Accordion';
import { useTranslation } from "react-i18next";
import { DateFieldConstants, checkBoxConstants } from '../../../lib/FieldConstants';
import { Accordion } from '@chakra-ui/react';
import dayjs from 'dayjs';
import Loader from '../../common/Loader';

function DetailsTabPanel(props) {
    const { children, value, index, clientData, isLoading, ...other } = props;
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
                    {isLoading ? <Loader /> :
                        <Accordion defaultIndex={[0]} allowMultiple>
                            {clientData && clientData.blocks.map((blockData, index) => <CustomAccordion key={index} showAddButton={false} title={lang === "he" ? blockData.field_name_language.he : blockData.block} >
                                {blockData.field.length > 0 ?
                                    <>
                                        {
                                            blockData.field.map((field, index) => {
                                                const emptyValues = ["", null, undefined];
                                                let value;
                                                if (DateFieldConstants.includes(field.data_type.value) && !emptyValues.includes(field?.value)) {
                                                    value = dayjs(field?.value).format("DD/MM/YYYY");
                                                } else if (field.data_type.value === "select") {
                                                    value = field?.value[1];
                                                } else if (field.data_type.value === "file") {
                                                    value = field?.value.file_name?.split("upload/")[1];
                                                } else {
                                                    value = field?.value;
                                                }

                                                return (
                                                    <div className={`mb-2 ${lang === "he" ? "pr-6" : "pl-6"}`} key={index}>
                                                        <div className={`flex items-center justify-between mb-1`}>
                                                            <div className='flex w-full'>
                                                                <label className={`block text-black text-md font-semibold w-1/5`}>
                                                                    {lang === "he" ? field?.field_name_language.he : field?.field_name}
                                                                </label>
                                                                :
                                                                <p className='text-sm mx-4 capitalize text-gray-900'>{`${emptyValues.includes(value) ? t("clients.noValueFound") : value}`}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </> : <p>{t("clients.noFields")}</p>
                                }
                            </CustomAccordion>
                            )}
                        </Accordion>
                    }
                </Box>
            )}
        </div>
    );
}

export default React.memo(DetailsTabPanel)

