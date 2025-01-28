// React imports
import React, { useEffect, useState } from "react";

// UI Imports
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";

// UI Components Imports
import ErrorMessage from "../../common/ErrorMessage";
import FieldLabel from "../../fields/FormLabel";

// Third part Imports
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CrossIcon from "../../../assets/images/cross.svg";

// API services
import authService from "../../../services/auth";

function UserModal({
  showModal,
  setShowModal,
  user,
  newUser,
  onClick,
  userTypes,
}) {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  const permissionObj = [
    {
      id: 1,
      title: "Clients",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 2,
      title: "Forms",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 3,
      title: "Requests",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 4,
      title: "FieldConfiguration",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 5,
      title: "Automation",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 6,
      title: "FormCreation",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 7,
      title: "ClientFields",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 8,
      title: "Users",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 9,
      title: "NetFree",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 10,
      title: "Emails",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
    {
      id: 11,
      title: "LogsHistory",
      permissionType: ["Read", "Write", "Update", 'Delete'],
    },
  ];
  
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    email: "",
    password: "",
    user_type: userTypes[0].value,
  });

  const [permissions, setPermissions] = useState(
    permissionObj.map((permission) => ({
      name: permission.title,
      read: false,
      write: false,
      update: false,
      delete: false,
    }))
  );

  const schema = yup.object().shape({
    name: yup
      .string()
      .min(
        3,
        `${t("netfree.name")} ${t("messages.mustContain")} 3 ${t(
          "messages.characters"
        )}`
      )
      .required(
        `${t("netfree.name")} ${t("clients.is")} ${t("clients.required")}`
      ),
    email: yup
      .string()
      .email(`${t("netfree.email")} ${t("messages.mustBeValid")}`)
      .required(
        `${t("netfree.email")} ${t("clients.is")} ${t("clients.required")}`
      ),
    password: yup.lazy((value) => {
      if (newUser) {
        return yup
          .string()
          .min(
            6,
            `${t("auth.password")} ${t("messages.mustContain")} 6 ${t(
              "messages.characters"
            )}`
          )
          .required(
            `${t("auth.password")} ${t("clients.is")} ${t("clients.required")}`
          );
      }
      return yup.string().notRequired();
    }),
    user_type: yup.string().required(),
  });

  const {
    control,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const selectedUserType = watch('user_type');

  const handleCheckboxChange = (permissionName, type, isChecked) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.name === permissionName
          ? { ...permission, [type.toLowerCase()]: isChecked}
          : permission
      )
    );
  };

  const submitForm = async (data, e) => {
    e.preventDefault();
    
    const payload = selectedUserType === 'normal_user' ? { ...data, permissions } : { ...data};
   
    try {
      if (newUser) {
        const res = await authService.createUser(payload);
      } else {
        const res = await authService.editUser(payload, user?.id);
      }
      setShowModal(false);
      reset();
      onClick();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!newUser) {
      setValue("name", user?.name);
      setValue("email", user?.email);
      setValue("user_type", user?.user_type);
    }
  }, []);

  const hebrewPermission = {
    "Clients": "לקוחות",
    "Forms": "טפסים",
    "Requests": "בקשות",
    "FieldConfiguration": "תצורת שדה",
    "Automation": "אוטומציה",
    "FormCreation": "יצירת טופס",
    "ClientFields": "שדות לקוח",
    "Users": "משתמשים",
    "NetFree": "נטפרי",
    "Emails": "אימיילים",
    "LogsHistory": "היסטוריית לוגים",
    "Read": "קריאה",
    "Write": "כתיבה",
    "Update": "עדכון",
    "Delete": "מחיקה"
}

  useEffect(() => {
    if (user?.permissions) {
      const updatedPermissions = permissionObj.map((permission) => {
        const userPermission = user.permissions.find(
          (p) => p.name === permission.title
        );
        
        return {
          name: lang === 'he' ? hebrewPermission[userPermission?.title] : userPermission?.title,
          read: userPermission?.is_read || false,
          write: userPermission?.is_write || false,
          update: userPermission?.is_update || false,
          delete: userPermission?.is_delete || false,
        };
      });

      setPermissions(updatedPermissions);
    }
  }, [user]);

  return (
    <>
      {showModal && (
        <div className="fixed left-0 bottom-0 z-[99] h-screen w-screen bg-[#00000080] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-7xl">
              <div className="w-full min-w-[80vw] md:min-w-[70vw] lg:min-w-[60vw] overflow-y-auto border-0 rounded-2xl shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                <form
                  style={{
                    width: "100%",
                    position: "relative",
                  }}
                  method="post"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit((data, e) => submitForm(data, e))}
                >
                  <div className="flex items-center border-b border-b-[#E3E5E6] justify-between p-5 rounded-t">
                    <h3 className="text-lg font-medium">
                      {newUser ? t("netfree.addUser") : t("netfree.editUser")}
                    </h3>
                    <button
                      className="bg-transparent border-0 text-black float-right"
                      onClick={() => setShowModal(false)}
                      type="button"
                    >
                      <img src={CrossIcon} alt="cross-icon" />
                    </button>
                  </div>

                  <div className="relative p-6 flex flex-col max-h-[calc(90vh-170px)] overflow-y-auto">
                    <div className="mb-6 flex flex-col gap-1 w-full">
                      <FieldLabel
                        className={`${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("netfree.name")}
                      </FieldLabel>
                      <div className="">
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="text"
                              className="appearance-none outline-none border rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10"
                              {...field}
                              placeholder={t("auth.namePlaceholder")}
                            />
                          )}
                        />
                        {errors.name && (
                          <ErrorMessage message={errors.name.message} />
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-1 w-full">
                      <FieldLabel
                        className={`${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("netfree.email")}
                      </FieldLabel>
                      <div className="">
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="text"
                              className="appearance-none outline-none border rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10"
                              {...field}
                              placeholder={t("auth.emailPlaceholder")}
                            />
                          )}
                        />
                        {errors.email && (
                          <ErrorMessage message={errors.email.message} />
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-1 w-full">
                      <FieldLabel
                        className={`${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("auth.password")}
                      </FieldLabel>
                      <div className="">
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="text"
                              className="appearance-none outline-none border rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10"
                              {...field}
                              placeholder={t("auth.passwordPlaceholder")}
                            />
                          )}
                        />
                        {errors.password && (
                          <ErrorMessage message={errors.password.message} />
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-1 w-full">
                      <FieldLabel
                        className={`${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("users.userType")}
                      </FieldLabel>
                      <div className="">
                        <Controller
                          name="user_type"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              MenuProps={{
                                sx: {
                                  maxHeight: "250px",
                                },
                              }}
                              className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-gray-11 bg-white"
                              placeholder="Select"
                            >
                              {userTypes?.map((el, i) => {
                                return el !== "" ? (
                                  <MenuItem key={i} value={el.value}>
                                    {el.label}
                                  </MenuItem>
                                ) : null;
                              })}
                            </Select>
                          )}
                        />
                        {errors.user_type && (
                          <ErrorMessage message={errors.user_type.message} />
                        )}
                      </div>
                    </div>
                    {selectedUserType === 'normal_user' ? <div className="mb-6 flex flex-col gap-1 w-full">
                      <FieldLabel>{t("users.permissions")}</FieldLabel>
                      {permissionObj?.map((permission) => (
                        <div
                          key={permission?.id}
                          className="mb-4 flex items-center gap-4 justify-between"
                        >
                          <h4 className="font-semibold">{lang === 'he' ? hebrewPermission[permission?.title] : permission?.title}</h4>
                          <div className="flex gap-4">
                            {permission?.permissionType?.map((type) => (
                              <FormControlLabel
                                key={type}
                                control={
                                  <Checkbox
                                    checked={
                                      permissions.find((p) => p?.name === lang === 'he' ? hebrewPermission[permission?.title] : permission?.title)[
                                        type.toLowerCase()
                                      ]
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        permission?.title,
                                        type,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label={lang === 'he' ? hebrewPermission[type] : type}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div> : null}
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    <button
                      className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      {t("netfree.close")}
                    </button>
                    <button
                      className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                      type="submit"
                    >
                      {t("netfree.save")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserModal;
