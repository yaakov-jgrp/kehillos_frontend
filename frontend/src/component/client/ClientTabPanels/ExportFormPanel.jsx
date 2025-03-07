// React imports
import { useCallback, useEffect, useRef, useState } from "react";

// Third part Imports
import { useTranslation } from "react-i18next";
import PdfEditor from "react-email-editor";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// API services
import clientsService from "../../../services/clients";

// Utils imports
import { DEFAULT_LANGUAGE } from "../../../constants";
import pdfEditorHe from "../../../locales/pdfEditorHe.json";

// Custom hooks imports
import useAlert from "../../../Hooks/useAlert";
import pdfService from "../../../services/pdf";

const ExportFormPanel = ({
  writePermission,
  clientId,
  clientData,
  netfreeprofile,
}) => {
  const formObject = {
    name: "",
    message: "",
  };
  const { t } = useTranslation();
  const { setAlert } = useAlert();
  const pdfEditorRef = useRef(null);
  const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
  const [formdata, setFormData] = useState(formObject);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [loadingTags, setloadingTags] = useState(true);
  const [mergeTagsData, setMergeTagsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    const getTemplates = async () => {
      setIsLoading(true);
      const response = await pdfService.getTemplates();
      setTemplateList(response.data.data);
      setIsLoading(false);
    };
    getTemplates();
  }, []);

  useEffect(() => {
    if(templateList?.length > 0) {
      setSelectedTemplateId(templateList[0].id);
    }
  }, [templateList]);

  const onReady = () => {
    setIsEditorReady(true);
    pdfEditorRef.current.editor.setMergeTags({
      request: {
        name: t("email_builder.requests"),
        mergeTags: {
          // Note the use of 'mergeTags' instead of 'children' for nesting
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
          },
        },
      },
      client: {
        name: t("email_builder.clients"),
        mergeTags: mergeTagsData.client,
      },
      netfree_traffic: {
        name: t("email_builder.netfree_traffic"),
        mergeTags: {
          $traffic_recording_open_domain_pre_text: {
            name: t("email_builder.open_domain_pre_text"),
            value: "{traffic_recording_open_domain_pre_text}",
          },
          $traffic_recording_open_domain_list: {
            name: t("email_builder.open_domain_list"),
            value: "{traffic_recording_open_domain_list}",
          },
          $traffic_recording_open_domain_after_text: {
            name: t("email_builder.open_domain_after_text"),
            value: "{traffic_recording_open_domain_after_text}",
          },
          $traffic_recording_open_url_pre_text: {
            name: t("email_builder.open_url_pre_text"),
            value: "{traffic_recording_open_url_pre_text}",
          },
          $traffic_recording_open_url_list: {
            name: t("email_builder.open_url_list"),
            value: "{traffic_recording_open_url_list}",
          },
          $traffic_recording_open_url_after_text: {
            name: t("email_builder.open_url_after_text"),
            value: "{traffic_recording_open_url_after_text}",
          },
          $traffic_recording_blocked_pre_text: {
            name: t("email_builder.blocked_pre_text"),
            value: "{traffic_recording_blocked_pre_text}",
          },
          $traffic_recording_blocked_list: {
            name: t("email_builder.blocked_list"),
            value: "{traffic_recording_blocked_list}",
          },
          $traffic_recording_blocked_after_text: {
            name: t("email_builder.blocked_after_text"),
            value: "{traffic_recording_blocked_after_text}",
          },
          $traffic_recording_open_domain_temporary_pre_text: {
            name: t("email_builder.open_domain_temporary_pre_text"),
            value: "{traffic_recording_open_domain_temporary_pre_text}",
          },
          $traffic_recording_open_domain_temporary: {
            name: t("email_builder.open_domain_temporary"),
            value: "{traffic_recording_open_domain_temporary}",
          },
          $traffic_recording_open_domain_temporary_after_text: {
            name: t("email_builder.open_domain_temporary_after_text"),
            value: "{traffic_recording_open_domain_temporary_after_text}",
          },
          $traffic_recording_open_url_temporary_pre_text: {
            name: t("email_builder.open_url_temporary_pre_text"),
            value: "{traffic_recording_open_url_temporary_pre_text}",
          },
          $traffic_recording_open_url_temporary: {
            name: t("email_builder.open_url_temporary"),
            value: "{traffic_recording_open_url_temporary}",
          },
          $traffic_recording_open_url_temporary_after_text: {
            name: t("email_builder.open_url_temporary_after_text"),
            value: "{traffic_recording_open_url_temporary_after_text}",
          },
        },
      },
    });
  };

  const exportHtml = () => {
    return new Promise((resolve, reject) => {
      let messageBody = {
        design: null,
        html: null,
      };
      pdfEditorRef.current.editor.exportHtml((data) => {
        messageBody.design = data.design;
        messageBody.html = data.html;
        resolve(messageBody);
      });
    });
  };

  const downloadPdf = async (event) => {
    event.preventDefault();
    // parse tokenized data
    let data = JSON.parse(JSON.stringify(formdata));
    data.message = await exportHtml();
    if (selectedTemplateId && clientId) {
      // update existing template
      await pdfService
        .exportPdfFile({
          clientId,
          clientData,
          netfreeprofile,
          body: data.message,
        })
        .then((response) => {
          // download pdf file here.
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${clientId}_${data.name}_${new Date().toISOString().substr(0, 10).replace(/-/g, "_")}_${new Date().getHours()}${new Date().getMinutes()}.pdf`
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          setAlert(t("pdfs.download_pdf_error"), "error");
        });
    }
  };

  const formValidate = () => {
    // if (!formdata.name || !formdata.to || !formdata.subject) {
    //   return false;
    // }
    return true;
  };

  useEffect(() => {
    if (!selectedTemplateId) return;
    const fetchEditableTemplateData = async () => {
      setLoadingTemplate(true);
      setIsEditorReady(false);
      let response = await pdfService.getSingleTemplate(selectedTemplateId);
      response = response.data.data;

      console.log("response", response.design);
      console.log("form", clientData);
      setFormData({
        name: response.name,
        message: response.design,
      });
      setLoadingTemplate(false);
    };
    fetchEditableTemplateData();
  }, [selectedTemplateId]);

  useEffect(() => {
    if (isEditorReady && formdata.message) {
      pdfEditorRef.current?.editor?.loadDesign(formdata.message);
    }
  }, [isEditorReady, formdata.message]);

  useEffect(() => {
    const fetchFormDataTags = async () => {
      setloadingTags(true);
      try {
        const res = await clientsService.getFullformEmailPageData(
          "&field_email_template=true"
        );
        console.log("result", res.data.result);
        setMergeTagsData(res.data.result);
        setloadingTags(false);
      } catch (error) {
        console.log(error);
        setloadingTags(false);
      }
    };
    fetchFormDataTags();
  }, [defaultLanguageValue]);

  const option = {
    locale: defaultLanguageValue,
    textDirection: defaultLanguageValue === "he" ? "rtl" : "ltr",
    translations: {
      [defaultLanguageValue]: defaultLanguageValue === "he" ? pdfEditorHe : {}, // Assuming you have similar JSON files for other languages
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
      <div className="bg-white rounded-3xl w-full shadow-custom pb-4">
        <div className="flex justify-between items-center py-4 px-7 text-gray-11 font-medium text-2xl">
          {t("pdfs.export_pdfs")}
          <div className="w-full mb-4 flex items-center justify-end gap-5 mt-5">
            <label className="text-sm text-navy-700 dark:text-white">
              {t("pdfs.selectTemplate")}
            </label>
            <select
              className="text-sm text-navy-700 bg-white border-[1px] py-1 px-2 outline-none rounded-md"
              value={selectedTemplateId || ""}
              onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
              disabled={isLoading}
            >
              {templateList.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <form onSubmit={downloadPdf}>
          <div className="px-7 flex gap-4 text-gray-11 [&_input]:border-[1px] [&_textarea]:border-[1px] [&_input]:outline-none [&_textarea]:outline-0 [&_input]:w-full [&_textarea]:w-full [&_input]:!px-4 [&_textarea]:!px-4 [&_input]:!py-1 [&_textarea]:!py-1">
            <div className="w-[100%] [&_tr]:h-10">
              <div className="w-full my-5 h-[calc(100vh-330px)] [&_iframe]:!min-w-[100%] [&_iframe]:!h-[calc(100vh-330px)] [&_div]:!max-h-[calc(100vh-330px)] relative">
                {!loadingTemplate && !loadingTags ? (
                  <PdfEditor
                    ref={pdfEditorRef}
                    onReady={onReady}
                    options={defaultLanguageValue === "he" ? option : null}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <div className="w-[400px] h-12 bg-[#EEEEEE] absolute bottom-0 right-[0px]"></div>
              </div>

              <div className="flex justify-center">
                <button
                  disabled={writePermission}
                  className={`disabled:cursor-not-allowed w-[150px] h-[40px] linear rounded-lg text-base font-medium transition duration-200 !z-[10] ${
                    formValidate()
                      ? "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {t("pdfs.export")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportFormPanel;
