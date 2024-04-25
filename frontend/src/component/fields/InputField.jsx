import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Icons for showing/hiding the password

function InputField(props) {
  const {
    label,
    id,
    extra,
    type,
    placeholder,
    variant,
    state,
    disabled,
    onChange,
    name,
    value,
    isPasswordInput, // new prop to determine if it is a password field
  } = props;
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  // State to manage if the password is visible
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Determine input type
  const inputType = isPasswordInput && !passwordVisible ? "password" : type;

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-gray-11 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        }`}
      >
        {label}
      </label>
      <div className="relative mt-2">
        <input
          disabled={disabled}
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className={`w-full h-12 rounded-lg border-[1px] border-[#E0E5F2] bg-white/0 p-3 text-sm outline-none ${
            disabled === true
              ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
              : state === "error"
              ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
              : state === "success"
              ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
              : variant === "auth"
              ? "border-gray-200 dark:!border-white/10 dark:text-white placeholder:text-gray-10 dark:placeholder:!text-gray-10"
              : "border-gray-200 dark:!border-white/10 dark:text-white"
          }`}
        />
        {isPasswordInput && (
          <div
            className={`absolute inset-y-0 ${
              lang === "he" ? "left-1" : "right-0"
            } flex items-center pr-3 cursor-pointer`}
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputField;
