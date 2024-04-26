// React imports
import React, { useEffect } from "react";

// Third part Imports
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// UI Components
import ErrorMessage from "../../common/ErrorMessage";
import CrossIcon from "../../../assets/images/cross.svg";

// API Services
import websiteServices from "../../../services/website";

function WebsiteModal({
  showModal,
  setShowModal,
  editDomain,
  setEditDomain,
  onClick,
}) {
  const { t } = useTranslation();
  const defaultValues = {
    domain: "",
    note: "",
  };
  const schema = yup.object().shape({
    domain: yup.string().required(t("messages.domainAddError")),
    note: yup.string().notRequired(),
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
    try {
      const formData = new FormData();
      formData.append("domain", data.domain);
      formData.append("note", data.note);
      const res = editDomain
        ? await websiteServices.editDomain(formData, editDomain.id)
        : await websiteServices.createDomain(formData);

      if (res.status >= 200 && res.status < 300) {
        reset();
        setShowModal(!showModal);
        onClick();
        setEditDomain(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editDomain) {
      setValue("domain", editDomain.domain);
      setValue("note", editDomain.note);
    }
  }, [editDomain]);

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
                  {t("websites.addDomain")}
                </h3>
                <button
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() => setShowModal(false)}
                >
                  <img src={CrossIcon} alt="CrossIcon" />
                </button>
              </div>

              <div className="relative px-6 py-3 flex-auto">
                <label className="block text-gray-11 text-md mb-1">
                  {t("websites.domain")}
                </label>
                <Controller
                  name="domain"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <input
                      value={value}
                      className="appearance-none outline-none border rounded-lg w-full py-2 px-2 text-gray-11"
                      required
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.domain && (
                  <ErrorMessage message={errors.domain.message} />
                )}
              </div>

              <div className="relative px-6 py-3 flex-auto">
                <label className="block text-gray-11 text-md mb-1">
                  {t("websites.note")}
                </label>
                <Controller
                  name="note"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <textarea
                      rows={5}
                      value={value}
                      className="appearance-none outline-none border rounded w-full py-2 px-1 text-gray-11"
                      required
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.note && <ErrorMessage message={errors.note.message} />}
              </div>

              <div className="flex items-center justify-center gap-2 my-4">
                <button
                  className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                  }}
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
  );
}

export default React.memo(WebsiteModal);
