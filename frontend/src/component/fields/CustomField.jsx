import React from 'react'
import { DateFieldConstants, NumberFieldConstants, TextFieldConstants, checkBoxConstants } from '../../lib/FieldConstants';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomCheckBox from './checkbox';

function CustomField(props) {
    const { data_type, required, enum_values } = props.field
    const { onChange, onBlur, value } = props;
    const handleNumberkeyPress = (e) => {
        if (e.key == "e") {
            e.preventDefault();
        } else {
            if (data_type === "number" && e.key == ".") {
                e.preventDefault();
            }
        }
    }
    return (
        <>
            {TextFieldConstants.includes(data_type) &&
                <input
                    type={data_type}
                    className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                />}
            {NumberFieldConstants.includes(data_type) &&
                <input
                    type="number"
                    min="0"
                    step={data_type === "number" ? "1" : "0.01"}
                    onKeyDown={handleNumberkeyPress}
                    className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                />}
            {data_type === "select" &&
                <select
                    className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Select"
                >
                    {
                        enum_values?.choices?.map(el => {
                            return (
                                el !== "" ? <option key={el.id} value={el.id}>{el.value}</option> : null
                            );
                        })
                    }
                </select>}
            {
                checkBoxConstants.includes(data_type) &&
                <CustomCheckBox
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                />
            }
            {DateFieldConstants.includes(data_type) &&
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        className="shadow appearance-none outline-none border-0 rounded w-full p-0 text-black"
                        defaultValue={dayjs(Date.now())}
                        format="DD/MM/YYYY"
                        onChange={onChange}
                        onBlur={onBlur}
                        value={dayjs(value)}
                        sx={{
                            border: 0,
                            "& .MuiInputBase-input": {
                                padding: 1.5,
                            }
                        }}
                    />
                </LocalizationProvider>}
        </>
    )
}

export default CustomField