import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import CrossIcon from "../../assets/images/cross.svg";
import EmailEditor from "react-email-editor";
import { DEFAULT_LANGUAGE } from "../../constants";
import emailEditorHe from "../../locales/emailEditorHe.json";
import ToggleSwitch from "../common/ToggleSwitch";
import clientsService from "../../services/clients";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  action_title: Yup.string().required("Action title is required"),
  to_email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  subject: Yup.string().required("Subject is required"),
});

function EmailModal({
  isEdit,
  setShowModal,
  setActionArray,
  actionArray,
  actionType,
  setIsEdit,
  editData, // Add editData as a prop
  handleActionArrayManupulation,
}) {
  const { t } = useTranslation();
  const emailEditorRef = useRef(null);
  const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
  const [mergeTagsData, setMergeTagsData] = useState({});

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), // Add Yup resolver for validation
    defaultValues: {
      action_title: "",
      to_email: "",
      subject: "",
      html: "",
      status: false,
    },
  });

  const fetchFormDataTags = async () => {
    // setloadingTags(true);
    try {
      const res = await clientsService.getFullformData(
        "&field_email_template=true"
      );
      setMergeTagsData(res.data.result);
      // setloadingTags(false);
    } catch (error) {
      console.log(error);
      // setloadingTags(false);
    }
  };

  useEffect(() => {
    fetchFormDataTags();
  }, [defaultLanguageValue]);

  // Use useEffect to set form data with editData when editing
  useEffect(() => {
    if (isEdit && editData) {
      reset({
        action_title: editData.action_title || "",
        to_email: editData.to_email || "",
        subject: editData.subject || "",
        status: editData.status === "active",
      });

      if (emailEditorRef.current && editData.design) {
        emailEditorRef.current.editor?.loadDesign(editData.design);
      }
    }
  }, [isEdit, editData, reset]);

  const exportHtml = () => {
    return new Promise((resolve) => {
      let messageBody = {
        design: null,
        html: null,
      };
      emailEditorRef.current.editor.exportHtml((data) => {
        messageBody.design = data.design;
        messageBody.html = data.html;
        resolve(messageBody);
      });
    });
  };

  const handleSwitchChange = () => {
    setValue("status", !editData.status);
  };

  const onSubmit = async (formdata) => {
    const exportedMessage = await exportHtml();

    const fullFormData = {
      ...formdata,
      html: exportedMessage.html,
      design: exportedMessage.design,
      action_type: actionType,
      id: editData?.id || (Math.random() + 1).toString(36).substring(7),
      status: formdata.status ? "active" : "inactive",
    };

    console.log('fullFormData',fullFormData);
    

    handleActionArrayManupulation(editData, actionArray, fullFormData);
    setShowModal("");
    setIsEdit(false); // Reset edit mode
    reset(); // Reset form data after submit
  };

  const onReady = () => {
    emailEditorRef.current.editor.setMergeTags({
      request: {
        name:t("email_builder.requests"),
        mergeTags: {  // Note the use of 'mergeTags' instead of 'children' for nesting
          $request_id: {
            name: t("requests.$requestId"),
            value: "{request_id}",
          },
          $client_name: {
                name: t("requests.$clinetName"),
                value: "{client_name}",
          },
          $client_email: {
                name: t("requests.$clientEmail"),
                value: "{client_email}",
              },
          $domain_requested: {
            name: t("requests.$domainRequested"),
            value: "{domain_requested}",
          },
          $admin_email: {
            name: t("requests.$adminEmail"),
            value: "{admin_email}",
          }
        }
      },
    client:{
      name:t("email_builder.clients"),
      mergeTags: mergeTagsData.client
    },
    netfree_traffic:{
      name:t("email_builder.netfree_traffic"),
      mergeTags: {
        $traffic_recording_open_domain_pre_text: {
          name: t("email_builder.open_domain_pre_text"),
          value: "{traffic_recording_open_domain_pre_text}"
        },
        $traffic_recording_open_domain_list: {
          name: t("email_builder.open_domain_list"),
          value: "{traffic_recording_open_domain_list}"
        },
        $traffic_recording_open_domain_after_text: {
          name: t("email_builder.open_domain_after_text"),
          value: "{traffic_recording_open_domain_after_text}"
        },
        $traffic_recording_open_url_pre_text: {
          name: t("email_builder.open_url_pre_text"),
          value: "{traffic_recording_open_url_pre_text}"
        },
        $traffic_recording_open_url_list: {
          name: t("email_builder.open_url_list"),
          value: "{traffic_recording_open_url_list}"
        },
        $traffic_recording_open_url_after_text: {
          name: t("email_builder.open_url_after_text"),
          value: "{traffic_recording_open_url_after_text}"
        },
        $traffic_recording_blocked_pre_text: {
          name: t("email_builder.blocked_pre_text"),
          value: "{traffic_recording_blocked_pre_text}"
        },
        $traffic_recording_blocked_list: {
          name: t("email_builder.blocked_list"),
          value: "{traffic_recording_blocked_list}"
        },
        $traffic_recording_blocked_after_text: {
          name: t("email_builder.blocked_after_text"),
          value: "{traffic_recording_blocked_after_text}"
        },
        $traffic_recording_open_domain_temporary_pre_text: {
          name: t("email_builder.open_domain_temporary_pre_text"),
          value: "{traffic_recording_open_domain_temporary_pre_text}"
        },
        $traffic_recording_open_domain_temporary: {
          name: t("email_builder.open_domain_temporary"),
          value: "{traffic_recording_open_domain_temporary}"
        },
        $traffic_recording_open_domain_temporary_after_text: {
          name: t("email_builder.open_domain_temporary_after_text"),
          value: "{traffic_recording_open_domain_temporary_after_text}"
        },
        $traffic_recording_open_url_temporary_pre_text: {
          name: t("email_builder.open_url_temporary_pre_text"),
          value: "{traffic_recording_open_url_temporary_pre_text}"
        },
        $traffic_recording_open_url_temporary: {
          name: t("email_builder.open_url_temporary"),
          value: "{traffic_recording_open_url_temporary}"
        },
        $traffic_recording_open_url_temporary_after_text: {
          name: t("email_builder.open_url_temporary_after_text"),
          value: "{traffic_recording_open_url_temporary_after_text}"
        }
      }
    }
    })
    if (isEdit && editData && editData.design) {
      emailEditorRef.current.editor?.loadDesign(editData.design);
    }
  };

  const option = {
    locale: defaultLanguageValue,
    textDirection: defaultLanguageValue === "he" ? "rtl" : "ltr",
    translations: {
      [defaultLanguageValue]:
        defaultLanguageValue === "he" ? emailEditorHe : {},
    },
  };

  return (
    <div className="fixed w-full left-0 bottom-0 z-[1000] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-full flex justify-center items-center my-6 mx-auto ">
          <div className="max-h-[90vh] min-w-[90%] max-w-[90%] md:min-w-[90%] p-5 md:max-w-[90%] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between pb-4 border-b border-solid border-[#E3E5E6] rounded-t ">
              <h3 className="text-lg font-medium text-gray-11">
                {isEdit ? t("automation.editField") : t("automation.addField")}
              </h3>
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => {
                  setShowModal("");
                  setIsEdit(false);
                }}
              >
                <img src={CrossIcon} alt="CrossIcon" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-7 flex gap-4 text-gray-11 [&_input]:border-[1px] [&_textarea]:border-[1px] [&_input]:outline-none [&_textarea]:outline-0 [&_input]:w-full [&_textarea]:w-full [&_input]:!px-4 [&_textarea]:!px-4 [&_input]:!py-1 [&_textarea]:!py-1">
                <div className="w-[100%] [&_tr]:h-10">
                  <div className="flex items-center my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">
                      {t("automation.actionTitle")}
                    </td>
                    <input
                      className="text-[13px] rounded-md h-[40px]"
                      {...register("action_title")}
                      placeholder={t("automation.actionTitle")}
                    />
                    {errors.action_title && (
                      <p className="text-red-500">
                        {errors.action_title.message}
                      </p>
                    )}
                  </div>

                  <div className="flex my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">{t("automation.toEmail")}</td>
                    <input
                      className="text-[13px] rounded-md h-[40px]"
                      type="email"
                      {...register("to_email")}
                      placeholder={t("automation.toEmail")}
                    />
                    {errors.to_email && (
                      <p className="text-red-500">{errors.to_email.message}</p>
                    )}
                  </div>

                  <div className="flex items-center my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">{t("automation.subject")}</td>
                    <input
                      className="text-[13px] rounded-md h-[40px]"
                      {...register("subject")}
                      placeholder={t("automation.subject")}
                    />
                    {errors.subject && (
                      <p className="text-red-500">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="flex items-center my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">{t("automation.status")}</td>
                    <ToggleSwitch
                      id="status"
                      name="status"
                      clickHandler={handleSwitchChange}
                      selected={!!editData?.status}
                    />
                  </div>

                  <div className="w-full my-5 h-[calc(100vh-330px)] [&_iframe]:!min-w-[100%] [&_iframe]:!h-[calc(100vh-330px)] [&_div]:!max-h-[calc(100vh-330px)] relative">
                    <EmailEditor
                      ref={emailEditorRef}
                      onLoad={onReady}
                      options={defaultLanguageValue === "he" ? option : null}
                    />
                    <div className="w-[400px] h-12 bg-[#EEEEEE] absolute bottom-0 right-[0px]"></div>
                  </div>

                  <div className="flex justify-end relative">
                    <button
                      type="submit"
                      className="px-6 py-2 mt-4 font-semibold bg-blue-500 text-white rounded absolute"
                    >
                      {isEdit
                        ? t("automation.update")
                        : t("automation.submit")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailModal;
