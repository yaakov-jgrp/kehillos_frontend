import React from "react";
import { useTranslation } from "react-i18next";
import BinIcon from "../../assets/images/bin.svg";
import PencilIcon from "../../assets/images/pencil.svg";
import { FormControl, MenuItem, Select } from "@mui/material";
import ToggleSwitch from "../common/ToggleSwitch";

const ActionForm = ({action,handleActionChange, toggleModal, lang, actionArray, handleEditAction, handleDeleteAction}) => {
    const {t, i18n}= useTranslation();
  return (
    <div className="px-6 py-4 w-full bg-white rounded-3xl shadow-custom mt-2">
      <FormControl fullWidth>
        <h1 className="text-gray-11 font-medium text-2xl pb-2">
          {t("automation.actions")}
        </h1>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded-lg outline-none w-full p-2 text-black bg-white"
          value={action}
          defaultValue={'addAction'}
          MenuProps={{
            sx: {
              maxHeight: "250px",
              maxWidth: "250px",
            },
          }}
          onChange={(e) => handleActionChange(e)}
        >
          <MenuItem value="addAction" disabled>
            {t("automation.addAction")}
          </MenuItem>
          <MenuItem value="send_email">
            <div onClick={toggleModal}>{t("automation.sendMail")}</div>
          </MenuItem>
          <MenuItem value="update_fields">{t("automation.updateFields")}</MenuItem>
        </Select>
      </FormControl>
      <table className="!table w-full text-[12px] md:text-[14px] my-3 border">
        <thead className="sticky top-0 z-10 [&_th]:min-w-[8.5rem] bg-[#F9FBFC]">
          <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
          <tr className="tracking-[-2%] mb-5">
            <th className="pr-3 pb-2 pt-1">
              <div
                className={` ${
                  i18n.dir() === "rtl" ? "text-right" : "text-left"
                }`}
              >
                <label
                  className={`truncate text-gray-11 ml-1.5 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("automation.actionTitle")}
                </label>
              </div>
            </th>
            <th className="pr-3 pb-2 pt-1">
              <div
                className={` ${
                  i18n.dir() === "rtl" ? "text-right" : "text-left"
                }`}
              >
                <label
                  className={`truncate text-gray-11 ml-1.5 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("automation.actionType")}
                </label>
              </div>
            </th>
            <th className="pr-3 pb-2 pt-1">
              <div
                className={` ${
                  i18n.dir() === "rtl" ? "text-right" : "text-left"
                }`}
              >
                <label
                  className={`truncate text-gray-11 ml-1.5 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("automation.status")}
                </label>
              </div>
            </th>

            <th className="pr-3 pb-2 pt-1">
              <div
                className={` ${
                  i18n.dir() === "rtl" ? "text-right" : "text-left"
                }`}
              >
                <label
                  className={`truncate text-gray-11 ml-1.5 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("automation.action")}
                </label>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="[&_td]:min-w-[9rem] [&_td]:max-w-[18rem]">
          {actionArray?.map((item, index) => (
            <tr key={index}>
              <td className="p-2">{item?.action_title}</td>
              <td className="p-2"> {item?.action_type} </td>
              <td className="p-2">
                {" "}
                <ToggleSwitch selected={item?.status === "active" ? true : false} disabled={true} />
              </td>

              <td>
                <div className="h-auto w-full flex items-center justify-center gap-2">
                  <img
                    src={PencilIcon}
                    alt="PencilIcon"
                    className="hover:cursor-pointer"
                    onClick={() => handleEditAction(item)}
                  />
                  <img
                    src={BinIcon}
                    alt="BinIcon"
                    className="hover:cursor-pointer"
                    onClick={()=> handleDeleteAction(item?.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActionForm;
