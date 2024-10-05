// React imports
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CrossIcon from "../../assets/images/cross.svg";
import EmailEditor from "react-email-editor";
import { DEFAULT_LANGUAGE } from "../../constants";
import emailEditorHe from "../../locales/emailEditorHe.json";
import ToggleSwitch from "../common/ToggleSwitch";

function EmailModal({
  isEdit,
  setShowModal,
  setActionArray,
  actionArray,
  actionType,
  setIsEdit,
  editData, // Add editData as a prop
  handleActionArrayManupulation
}) {
  const { t } = useTranslation();
  const emailEditorRef = useRef(null);
  const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
  const [formdata, setFormData] = useState({
    action_title: "",
    to_email: "",
    subject: "",
    html: "",
    status: false,
  });

  // Use useEffect to set form data with editData when editing
  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        action_title: editData.action_title || "",
        to_email: editData.to_email || "",
        subject: editData.subject || "",
        html: editData.html || "",
        status: editData.status || false,
      });
      if (emailEditorRef.current && editData.design) {
        emailEditorRef.current.editor?.loadDesign(editData.design);
      }
    }
  }, [isEdit, editData]);

  const exportHtml = () => {
    return new Promise((resolve, reject) => {
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

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };

  const handleSwitchChange = () => {
    setFormData({
      ...formdata,
      status: !formdata.status,
    });
  };

  const formValidate = () => {
    if (!formdata?.action_title || !formdata?.to_email || !formdata?.subject) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const exportedMessage = await exportHtml();
  
    const fullFormData = {
      ...formdata,
      html: exportedMessage.html,
      design: exportedMessage.design,
      action_type: actionType,
      id: editData?.id || (Math.random() + 1).toString(36).substring(7)
    };
  
    handleActionArrayManupulation(editData, actionArray, fullFormData);
  
    console.log("Form Data Submitted: ", fullFormData);
  
    // Reset and close modal
    setShowModal("");
    // setEmailFormData(fullFormData);
    setFormData({
      action_title: "",
      to_email: "",
      subject: "",
      html: "",
      status: false,
    });
    setIsEdit(false); // Reset edit mode
  };
  

  const onReady = () => {
    if (isEdit && editData && editData.design) {
      emailEditorRef.current.editor?.loadDesign(editData.design);
    }
  };

  const option = {
    locale: defaultLanguageValue,
    textDirection: defaultLanguageValue === "he" ? "rtl" : "ltr",
    translations: {
      [defaultLanguageValue]:
        defaultLanguageValue === "he" ? emailEditorHe : {}, // Assuming you have similar JSON files for other languages
    },
    tools: {
      text: {
        properties: {
          textOverflow: {
            value: "clip",
          },
          text: {
            value:
              defaultLanguageValue === "he"
                ? '<p style="line-height: 140%;">זהו בלוק טקסט חדש. שנה את הטקסט.</p>'
                : '<p style="line-height: 140%;">This is a new text block. Change the text.</p>',
          },
          textAlign: {
            value: defaultLanguageValue === "he" ? "right" : "left",
          },
        },
      },
      heading: {
        properties: {
          text: {
            value: defaultLanguageValue === "he" ? "כּוֹתֶרֶת" : "Heading",
          },
          textAlign: {
            value: defaultLanguageValue === "he" ? "right" : "left",
          },
        },
      },
      button: {
        properties: {
          text: {
            value: defaultLanguageValue === "he" ? "טקסט לחצן" : "Button Text",
          },
        },
      },
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
                onClick={() =>{ setShowModal(""); setIsEdit(false);}}
              >
                <img src={CrossIcon} alt="CrossIcon" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-7 flex gap-4 text-gray-11 [&_input]:border-[1px] [&_textarea]:border-[1px] [&_input]:outline-none [&_textarea]:outline-0 [&_input]:w-full [&_textarea]:w-full [&_input]:!px-4 [&_textarea]:!px-4 [&_input]:!py-1 [&_textarea]:!py-1">
                <div className="w-[100%] [&_tr]:h-10">
                  <div className="flex items-center my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">
                      {t("automation.actionTitle")}
                    </td>
                    <input
                      className="text-[13px] rounded-md h-[40px]"
                      id="templateName"
                      type="text"
                      value={formdata?.action_title}
                      onChange={handleInput}
                      name="action_title"
                      placeholder={t("automation.actionTitle")}
                    />
                  </div>

                  <div className="flex my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">{t("automation.toEmail")}</td>
                    <input
                      className="text-[13px] rounded-md h-[40px]"
                      id="emailTo"
                      type="email"
                      placeholder={t("automation.toEmail")}
                      value={formdata?.to_email}
                      onChange={handleInput}
                      name="to_email"
                    />
                  </div>

                  <div className="flex items-center my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">{t("automation.subject")}</td>
                    <input
                      className="text-[13px] rounded-md h-[40px]"
                      id="emailSubject"
                      type="text"
                      placeholder={t("automation.subject")}
                      value={formdata?.subject}
                      onChange={handleInput}
                      name="subject"
                    />
                  </div>
                  <div className="flex items-center my-2 w-full gap-4">
                    <td className="w-1/2 md:w-1/5">{t("automation.status")}</td>
                    <ToggleSwitch
                      id="status"
                      name="status"
                      clickHandler={(e) => handleSwitchChange(e)}
                      selected={formdata?.status}
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
                      onClick={handleSubmit}
                      className="px-6 py-2 mt-4 font-semibold bg-blue-500 text-white rounded absolute"
                      disabled={!formValidate()}
                    >
                      {isEdit ? t("automation.update") : t("automation.submit")}
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

