// React imports
import React, { useEffect } from "react";

// Third part Imports
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// API services
import categoryService from "../../../services/category";
import CrossIcon from "../../../assets/images/cross.svg";

const ProfileModal = ({
  showModal,
  setShowModal,
  profile,
  newProfile,
  onClick,
  profilesList,
}) => {
  const { t } = useTranslation();
  const defaultValues = {
    name: "",
    description: "",
  };
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Name must contain least 3 characters.")
      .required("Please enter valid name."),
    description: yup.string().notRequired("Please enter product description"),
  });

  const { control, setValue, reset, handleSubmit } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const submitForm = async (data, e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (newProfile) {
      const res = await categoryService.createFilterProfile(formData);
    } else {
      const res = await categoryService.updateFilterProfile(
        formData,
        `${profile ? profile?.id + "/" : ""}`
      );
    }
    reset();
    setShowModal(!showModal);
    onClick();
  };

  useEffect(() => {
    if (profilesList && profile) {
      if (!newProfile) {
        setValue("name", profile?.name);
        setValue("description", profile?.description);
      } else {
        setValue("name", `Profile ${profilesList.length + 1}`);
        setValue("description", "");
      }
    }
  }, [JSON.stringify(profile), newProfile]);

  return (
    <>
      {showModal ? (
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
                  <div className="flex items-center justify-between px-5 py-4 border-b border-b-[#E3E5E6] rounded-t ">
                    <h3 className="text-lg font-medium">
                      {t("netfree.addFilterProfile")}
                    </h3>
                    <button
                      className="bg-transparent border-0 text-black float-right"
                      onClick={() => setShowModal(false)}
                    >
                      <img src={CrossIcon} alt="CrossIcon" />
                    </button>
                  </div>

                  <div className="relative px-5 py-3 flex flex-col gap-4">
                    <div>
                      <label className="block text-gray-11 text-md mb-1">
                        {t("netfree.name")}
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <input
                            value={value}
                            className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full py-2 px-2 text-gray-11"
                            required
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-11 text-md mb-1">
                        {t("netfree.description")}
                      </label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <textarea
                            value={value}
                            className="appearance-none outline-none border rounded-lg w-full py-2 px-1 text-gray-11"
                            required
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-2 mb-6">
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
      ) : null}
    </>
  );
};

export default React.memo(ProfileModal);
