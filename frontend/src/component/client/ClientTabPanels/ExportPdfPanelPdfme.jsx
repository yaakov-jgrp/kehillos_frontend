// React imports
import React, { useCallback, useEffect, useRef, useState } from "react";

// Third part Imports
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { checkTemplate, getInputFromTemplate } from "@pdfme/common";
import { Viewer } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import {
  getBlankTemplate,
  getFontsData,
  getPlugins,
} from "../../../component/pdf/helper";
import { toast } from "react-toastify";

// API services
import clientsService from "../../../services/clients";

// Utils imports
import { DEFAULT_LANGUAGE } from "../../../constants";
import pdfEditorHe from "../../../locales/pdfEditorHe.json";

// Custom hooks imports
import useAlert from "../../../Hooks/useAlert";
import pdfService from "../../../services/pdf";

const ExportPdfPanelPdfme = ({ clientId, clientData, netfreeprofile }) => {
  const { t } = useTranslation();
  const { setAlert } = useAlert();
  const pdfEditorRef = useRef(null);
  const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
  const [formdata, setFormData] = useState({
    name: "",
    message: "",
  });
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [loadingTags, setloadingTags] = useState(true);
  const [mergeTagsData, setMergeTagsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [mode, setMode] = useState("form");
  const uiRef = useRef(null);
  const ui = useRef(null);

  const downloadPdf = async (event) => {
    event.preventDefault();
    if (!ui.current) return;

    try {
      const template = ui.current.getTemplate();
      const inputs = ui.current.getInputs();
      const font = getFontsData();

      const pdf = await generate({
        template,
        inputs,
        options: {
          font,
          title: `Client-${clientId}-PDF`,
        },
        plugins: getPlugins(),
      });

      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${clientId}_${selectedTemplateId}_${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(
            /-/g,
            "_"
          )}_${new Date().getHours()}${new Date().getMinutes()}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("PDF generated successfully!");
    } catch (error) {
      toast.error("Error generating PDF: " + error.message);
      console.error(error);
    }
  };

  const buildUi = useCallback(async () => {
    if (!uiRef.current || !selectedTemplateId) return;
    try {
      const response = await pdfService.getSingleTemplate(selectedTemplateId);
      const data = response.data.data;
      const processData = await clientsService.processPdfTemplate(clientId, data.design);
      const processedTemplate = processData.data;
      checkTemplate(processedTemplate);

      let inputs = getInputFromTemplate(processedTemplate);

      // Initialize the Viewer component
      ui.current = new Viewer({
        domContainer: uiRef.current,
        template: processedTemplate,
        inputs,
        options: {
          font: getFontsData(),
          lang: "en", //defaultLanguageValue || "en",
          labels: defaultLanguageValue === "he" ? pdfEditorHe : {},
          theme: {
            token: {
              colorPrimary: "#25c2a0",
            },
          },
        },
        plugins: getPlugins(),
      });
    } catch (error) {
      console.error("Error building UI:", error);
      setAlert(t("pdfs.template_load_error"), "error");
    }
  }, [selectedTemplateId, defaultLanguageValue]);

  useEffect(() => {
    buildUi();
    return () => {
      if (ui.current) {
        ui.current.destroy();
      }
    };
  }, [buildUi]);

  useEffect(() => {
    const getTemplates = async () => {
      setIsLoading(true);
      const response = await pdfService.getTemplates();
      const data = response.data.data.filter((template) => template.type === "pdfme");
      setTemplateList(data);
      setIsLoading(false);
    };
    getTemplates();
  }, []);

  useEffect(() => {
    if (templateList?.length > 0) {
      setSelectedTemplateId(templateList[0].id);
    }
  }, [templateList]);

  const onReady = () => {
    setIsEditorReady(true);
    pdfEditorRef.current?.editor?.setAppearance({
      features: {
        preview: false,
      },
    });
    pdfEditorRef.current?.editor?.showPreview("tablet");
  };

  const formValidate = () => {
    // if (!formdata.name || !formdata.to || !formdata.subject) {
    //   return false;
    // }
    return true;
  };

  useEffect(() => {
    if (!selectedTemplateId) return;
    buildUi();
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
    displayMode: "email",
    minWidth: "550px",
    style: { width: "550px" },
    isPreview: true,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="bg-white rounded-3xl w-full shadow-custom pb-4">
          <div className="flex justify-between items-center px-7 text-gray-11 font-medium text-2xl">
            <div className="w-full">{t("pdfs.export")}</div>
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
                <div className="w-full my-5 h-[calc(100vh-330px)] relative">
                  <div ref={uiRef} className="flex-1 w-full min-h-[600px]" dir="ltr" />
                </div>

                <div className="flex justify-center">
                  <button
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
    </div>
  );
};

export default ExportPdfPanelPdfme;
