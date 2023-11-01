import React, { useState } from 'react'
import { DateFieldConstants, NumberFieldConstants, TextFieldConstants, checkBoxConstants } from '../../lib/FieldConstants';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomCheckBox from './checkbox';

function CustomField({ field, rest }) {
    const { data_type, required, defaultvalue, enum_values } = field
    return (
        <>
            {TextFieldConstants.includes(data_type) && <input type={data_type} className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required={required} defaultValue={defaultvalue} {...rest} />}
            {NumberFieldConstants.includes(data_type) && <input type="number" className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" required={required} defaultValue={defaultvalue} {...rest} />}
            {data_type === "select" &&
                <select className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white" required={required} defaultValue={defaultvalue} {...rest} placeholder="Select">
                    {
                        enum_values?.choices?.map(el => {
                            return (
                                el ? <option key={el.id} value={el.id}>{el.value}</option> : null
                            );
                        })
                    }
                </select>}
            {
                checkBoxConstants.includes(data_type) && <CustomCheckBox />
            }
            {/* {DateFieldConstants.includes(data_type) &&
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Basic date picker"
                        defaultValue={dayjs('2022-04-17')}
                        {...rest}
                    />
                </LocalizationProvider>} */}
        </>
    )
}

export default CustomField