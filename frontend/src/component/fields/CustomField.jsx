import React from 'react'
import { DateFieldConstants, NumberFieldConstants, TextFieldConstants, checkBoxConstants } from '../../lib/FieldConstants';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomCheckBox from './checkbox';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

function CustomField(props) {
    const { data_type, required, field_slug, enum_values, defaultvalue } = props.field
    const { onChange, onBlur, value, disabled } = props;
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");

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
                    className="shadow appearance-none outline-none border rounded w-full p-2 text-black"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disabled={disabled}
                    placeholder={defaultvalue}
                />}
            {NumberFieldConstants.includes(data_type) &&
                <input
                    type="number"
                    min="0"
                    step={data_type === "number" ? "1" : "0.01"}
                    onKeyDown={handleNumberkeyPress}
                    className="shadow appearance-none outline-none border rounded w-full p-2 text-black"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disabled={disabled}
                    placeholder={defaultvalue}
                />}
            {
                data_type === "phone" &&
                <PhoneInput
                    className='shadow appearance-none outline-none border rounded w-full p-2 text-black [&>input]:outline-none [&>input]:bg-white'
                    placeholder="Enter phone number"
                    defaultCountry={lang === 'he' ? "IL" : "IN"}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                />
            }
            {data_type === "select" &&
                <select
                    className="shadow appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    defaultValue={enum_values?.choices?.filter((item) => item.value === defaultvalue)[0]?.id}
                    disabled={disabled}
                    placeholder="Select"
                >
                    {
                        enum_values?.choices?.map(el => {
                            return (
                                el !== "" ? <option key={el.id} value={el.id}>{el.value}</option> : null
                            );
                        })
                    }
                </select>
            }
            {
                checkBoxConstants.includes(data_type) &&
                <CustomCheckBox
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={value === "true" || value === true ? true : false}
                    disabled={disabled}
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
                        disabled={disabled}
                        sx={{
                            border: 0,
                            "& .MuiInputBase-input": {
                                padding: 1.5,
                                border: "none"
                            }
                        }}
                    />
                </LocalizationProvider>}
        </>
    )
}

export default CustomField