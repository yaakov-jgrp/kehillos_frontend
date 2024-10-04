import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EmailEditor from "react-email-editor";
import { DEFAULT_LANGUAGE } from "../../constants";
import emailEditorHe from "../../locales/emailEditorHe.json";
import ToggleSwitch from "../common/ToggleSwitch";

const SendMail = ({formdata, setFormData}) => {
  const { t } = useTranslation();
  const emailEditorRef = useRef(null);
  const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
  

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

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formdata,
      [name]: type === "checkbox" ? checked : value, // Update based on input type
    });
  };

  const formValidate = () => {
    if (!formdata.action_title || !formdata.to || !formdata.subject) {
      return false;
    }
    return true;
  };

  // const fetchFormDataTags = async () => {
  //   setloadingTags(true);
  //   try {
  //     const res = await clientsService.getFullformData(
  //       "&field_email_template=true"
  //     );
  //     setMergeTagsData(res.data.result);
  //     setloadingTags(false);
  //   } catch (error) {
  //     console.log(error);
  //     setloadingTags(false);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const exportedMessage = await exportHtml();
    const fullFormData = {
      ...formdata,
      message: exportedMessage.html,
    };
    console.log("Form Data Submitted: ", fullFormData);
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
    <div className="w-full flex flex-col md:flex-row gap-4">
      <div className="bg-white rounded-3xl w-full pt-4">
        {/* <p className="text-gray-11 font-medium text-2xl">
          {t("emails.emailTemplate")}
        </p> */}
        <form onSubmit={handleSubmit}>
          <div className="px-7 flex gap-4 text-gray-11 [&_input]:border-[1px] [&_textarea]:border-[1px] [&_input]:outline-none [&_textarea]:outline-0 [&_input]:w-full [&_textarea]:w-full [&_input]:!px-4 [&_textarea]:!px-4 [&_input]:!py-1 [&_textarea]:!py-1">
            <div className="w-[100%] [&_tr]:h-10">
              <div className="flex items-center my-2 w-full gap-4">
                <td className="w-1/2 md:w-1/5">{t("emails.action_title")}</td>
                <input
                  className="text-[13px] rounded-md h-[40px]"
                  id="templateName"
                  type="text"
                  value={formdata.action_title}
                  onChange={handleInput}
                  name="action_title"
                  placeholder={t("emails.action_title")}
                />
              </div>

              <div className="flex my-2 w-full gap-4">
                <td className="w-1/2 md:w-1/5">{t("emails.to")}</td>
                <input
                  className="text-[13px] rounded-md h-[40px]"
                  id="emailTo"
                  type="email"
                  placeholder={t("emails.to")}
                  value={formdata.to}
                  onChange={handleInput}
                  name="to"
                />
              </div>

              <div className="flex items-center my-2 w-full gap-4">
                <td className="w-1/2 md:w-1/5">{t("emails.subject")}</td>
                <input
                  className="text-[13px] rounded-md h-[40px]"
                  id="emailSubject"
                  type="text"
                  placeholder={t("emails.subject")}
                  value={formdata.subject}
                  onChange={handleInput}
                  name="subject"
                />
              </div>
              <div className="flex items-center my-2 w-full gap-4">
                <td className="w-1/2 md:w-1/5">{t("emails.status")}</td>
                <ToggleSwitch
                  id="status"
                  name="status"
                  clickHandler={(e) => handleInput(e)}
                  selected={formdata.status}
                />
              </div>

              <div className="w-full my-5 h-[calc(100vh-330px)] [&_iframe]:!min-w-[100%] [&_iframe]:!h-[calc(100vh-330px)] [&_div]:!max-h-[calc(100vh-330px)] relative">
                {/* {!loadingTags ? ( */}
                <>
                  <EmailEditor
                    ref={emailEditorRef}
                    // onReady={onReady}
                    options={defaultLanguageValue === "he" ? option : null}
                  />
                  <div className="w-[400px] h-12 bg-[#EEEEEE] absolute bottom-0 right-[0px]"></div>
                </>
                {/* ) : null} */}
              </div>

              <div className="flex justify-end">
                <button
                  // type="submit"
                  onClick={handleSubmit}
                  className="px-6 py-2 mt-4 font-semibold bg-blue-500 text-white rounded"
                  disabled={!formValidate()}
                >
                  {t("emails.submit")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMail;
