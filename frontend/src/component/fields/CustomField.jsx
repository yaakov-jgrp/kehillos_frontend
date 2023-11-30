import React from 'react'
import { DateFieldConstants, NumberFieldConstants, TextFieldConstants, checkBoxConstants } from '../../lib/FieldConstants';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomCheckBox from './checkbox';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
import he from 'react-phone-number-input/locale/he'
import { MdOutlineUploadFile } from "react-icons/md";
import { useTranslation } from "react-i18next";

function CustomField(props) {
    const { t } = useTranslation();
    const { data_type, required, enum_values, defaultvalue } = props.field
    const { onChange, onBlur, value, disabled } = props;
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");

    const handleNumberkeyPress = (e) => {
        if (e.key == "e") {
            e.preventDefault();
        } else {
            if (data_type.value === "number" && e.key == ".") {
                e.preventDefault();
            }
        }
    }


    return (
        <>
            {TextFieldConstants.includes(data_type.value) &&
                <input
                    type={data_type.value}
                    className="shadow appearance-none outline-none border rounded w-full p-2 text-black"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disabled={disabled}
                    placeholder={defaultvalue}
                />}
            {NumberFieldConstants.includes(data_type.value) &&
                <input
                    type="number"
                    min="0"
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
                data_type.value === "phone" &&
                <PhoneInput
                    labels={lang === "en" ? en : he}
                    className='shadow appearance-none outline-none border rounded w-full p-2 text-black [&>input]:outline-none [&>input]:bg-white'
                    placeholder={t("clients.enterNumber")}
                    defaultCountry={lang === 'he' ? "IL" : "IN"}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                />
            }
            {
                data_type.value === "file" &&
                <label
                    className="shadow text-md flex items-center w-full appearance-none outline-none border rounded p-2 text-black"
                >
                    <MdOutlineUploadFile style={{
                        marginRight: "5px",
                        fontSize: "1.25rem"
                    }} />
                    {value.name}
                    <input
                        type={data_type.value}
                        required={required}
                        onChange={onChange}
                        onBlur={onBlur}
                        hidden
                        disabled={disabled}
                    />
                </label>
            }
            {data_type.value === "select" &&
                <select
                    className="shadow appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                    required={required}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
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
                checkBoxConstants.includes(data_type.value) &&
                <CustomCheckBox
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={value === "true" || value === true ? true : false}
                    disabled={disabled}
                />
            }
            {DateFieldConstants.includes(data_type.value) &&
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