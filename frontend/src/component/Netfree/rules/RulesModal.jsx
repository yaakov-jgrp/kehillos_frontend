// React imports
import React, { useEffect, useState } from "react";

// Third part Imports
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

// UI Components
import ErrorMessage from "../../common/ErrorMessage";
import CrossIcon from "../../../assets/images/cross.svg";

// API Services
import rulesServices from "../../../services/rules";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import { RuleUrlsActionsList } from "../../../constants/rulesUtils";

function RulesModal({
  setShowModal,
  editRule,
  setEditRule,
  onClick,
  refetchRules,
  rulesData,
  updateRuleHandler,
}) {
  const { t } = useTranslation();
  const [isUpdatingRule, setIsUpdatingRule] = useState(false);

  const defaultValues = {
    url: "",
    action: "open",
  };

  const schema = yup.object().shape({
    url: yup
      .string()
      .url(t("messages.urlInvalidError"))
      .required(t("messages.urlAddError")),
    action: yup.string().required(t("messages.actionAddError")),
  });

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const submitForm = async (data, e) => {
    e.preventDefault();
    setIsUpdatingRule(true);
    try {
      const formData = new FormData();
      const newUrlsData = editRule
        ? [
            ...(rulesData?.urls ?? []).filter(
              (el, index) => index !== editRule.id
            ),
            { url: data.url, rule: data.action },
          ]
        : [...(rulesData?.urls ?? []), { url: data.url, rule: data.action }];
      const formattedData = {
        category_list: rulesData?.category?.reduce((acc, curr) => {
          acc[curr.categories_id] = curr.rule;
          return acc;
        }, {}),
        urls_data: newUrlsData,
      };
      const res = editRule
        ? updateRuleHandler(formattedData, {
            onSuccess: () => {
              reset();
              setShowModal(false);
              onClick();
              toast.success(t("messages.ruleEditSuccess"));
              setEditRule(null);
              refetchRules();
              setIsUpdatingRule(false);
            },
            onError: () => {
              toast.error(t("messages.ruleEditError"));
            },
          })
        : updateRuleHandler(formattedData, {
            onSuccess: () => {
              reset();
              setShowModal(false);
              onClick();
              setEditRule(null);
              toast.success(t("messages.ruleAddSuccess"));
              refetchRules();
              setIsUpdatingRule(false);
            },
            onError: () => {
              toast.error(t("messages.ruleAddError"));
            },
          });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editRule) {
      setValue("url", editRule.url);
      setValue("action", editRule.rule);
    }
  }, [editRule]);

  return (
    <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="min-w-300px border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
              <div className="flex items-center justify-between px-5 py-4 border-b border-b-[#E3E5E6] rounded-t">
                <h3 className="text-lg font-medium">
                  {t(`${editRule ? "netfree.editRule" : "netfree.addRule"}`)}
                </h3>
                <button
                  type="button"
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() => {
                    setEditRule(null);
                    setShowModal(false);
                  }}
                >
                  <img src={CrossIcon} alt="CrossIcon" />
                </button>
              </div>

              <div className="relative px-6 py-3 flex-auto">
                <label className="block text-gray-11 text-md mb-1">
                  {t("netfree.url")}
                </label>
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={editRule}
                      className="appearance-none outline-none border rounded-lg w-full py-2 px-2 text-gray-11"
                    />
                  )}
                />
                {errors.url && <ErrorMessage message={errors.url.message} />}
              </div>

              <div className="relative px-6 py-3 flex-auto">
                <label className="block text-gray-11 text-md mb-1">
                  {t("automation.action")}
                </label>
                <Controller
                  name="action"
                  control={control}
                  render={({ field }) => (
                    <Select
                      MenuProps={{
                        sx: {
                          zIndex: 9999,
                        },
                      }}
                      className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                      {...field}
                      placeholder="Select Action"
                    >
                      <MenuItem value={"selectAction"} disabled>
                        {t("netfree.selectAction")}
                      </MenuItem>
                      {RuleUrlsActionsList?.map((el) => {
                        return el ? (
                          <MenuItem key={el.id} value={el.id}>
                            {t(el.label)}
                          </MenuItem>
                        ) : null;
                      })}
                    </Select>
                  )}
                />
                {errors.action && (
                  <ErrorMessage message={errors.action.message} />
                )}
              </div>

              <div className="flex items-center justify-center gap-2 my-4">
                <button
                  className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                  type="button"
                  onClick={() => {
                    setEditRule(null);
                    setShowModal(false);
                  }}
                >
                  {t("netfree.close")}
                </button>
                <button
                  className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                  type="submit"
                >
                  {isUpdatingRule ? (
                    <CircularProgress className="!text-white mt-1" size={16} />
                  ) : (
                    <>{t("netfree.save")}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RulesModal);
