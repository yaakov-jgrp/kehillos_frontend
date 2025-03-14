import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Designer } from "@pdfme/ui";
import { BLANK_PDF, checkTemplate, cloneDeep } from "@pdfme/common";

import pdfService from "../../services/pdf";
import { DEFAULT_LANGUAGE } from "../../constants";
import useAlert from "../../Hooks/useAlert";
import { getBlankTemplate, getFontsData, getPlugins } from "./helper";
import { Box, CircularProgress } from "@mui/material";

const NewTemplatePdfme = ({
  editableTemplateId,
  onSave,
  writePermission,
  updatePermission,
  deletePermission,
}) => {
  const { t } = useTranslation();
  const { setAlert } = useAlert();
  const designerRef = useRef(null);
  const containerRef = useRef(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const designer = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    design: getBlankTemplate(),
  });

  const initDesigner = useCallback(async () => {
    if (!containerRef.current || designer.current) return;

    try {
      let template = getBlankTemplate();

      designer.current = new Designer({
        domContainer: containerRef.current,
        template,
        options: {
          lang: localStorage.getItem(DEFAULT_LANGUAGE) || "en",
          theme: {
            token: { colorPrimary: "#4f46e5" },
          },
          font: getFontsData(),
          labels: {
            "signature.clear": "🗑️",
          },
          icons: {
            multiVariableText:
              '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24"><path d="M6.643,13.072,17.414,2.3a1.027,1.027,0,0,1,1.452,0L20.7,4.134a1.027,1.027,0,0,1,0,1.452L9.928,16.357,5,18ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"/></svg>',
          },
          maxZoom: 250,
        },
        plugins: getPlugins(),
      });

      setFormData((prev) => ({ ...prev, design: template }));
    } catch (error) {
      console.error("Error initializing designer:", error);
      setAlert(t("pdfs.designerInitFailed"), "error");
    }
  }, [setAlert, t]);

  const saveTemplate = async (event) => {
    event.preventDefault();
    if (!designer.current) return;

    try {
      const template = designer.current.getTemplate();
      const data = {
        name: formData.name,
        type: "pdfme",
        body: {
          design: JSON.stringify(template),
        },
      };

      if (editableTemplateId) {
        await pdfService.updateTemplate({
          id: editableTemplateId,
          ...data,
        });
        setAlert(t("pdfs.templateUpdated"), "success");
      } else {
        await pdfService.addNewTemplate(data);
        setAlert(t("pdfs.templateAdded"), "success");
      }

      setFormData({ name: "", design: getBlankTemplate() });
      onSave();
    } catch (error) {
      console.error("Error saving template:", error);
      setAlert(
        editableTemplateId
          ? t("pdfs.templateUpdateFailed")
          : t("pdfs.templateAddFailed"),
        "error"
      );
    }
  };

  const handleInput = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setAlert(t("pdfs.invalidFileType"), "error");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const basePdf = e.target.result;
        if (designer.current) {
          const newTemplate = cloneDeep(designer.current.getTemplate());
          newTemplate.basePdf = basePdf;
          designer.current.updateTemplate(newTemplate);
          setFormData((prev) => ({ ...prev, design: newTemplate }));
        }
      };
      reader.onerror = () => {
        setAlert(t("pdfs.fileReadError"), "error");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling PDF file:", error);
      setAlert(t("pdfs.fileProcessError"), "error");
    }
  };

  const formValidate = () => {
    if (!formData.name || !designer.current?.getTemplate()?.basePdf) {
      return false;
    }
    return true;
  };

  const fetchEditableTemplateData = useCallback(async () => {
    // setLoadingTemplate(true);
    try {
      const response = await pdfService.getSingleTemplate(editableTemplateId);
      const templateData = response.data.data;
      const parsedTemplate = JSON.parse(templateData.design);

      try {
        checkTemplate(parsedTemplate);
      } catch (error) {
        console.error("Invalid template structure:", error);
        parsedTemplate.schemas = getBlankTemplate().schemas;
      }

      if (designer.current) {
        const newTemplate = cloneDeep(designer.current.getTemplate());
        newTemplate.schemas = parsedTemplate.schemas;
        designer.current.updateTemplate(newTemplate);
      }

      setFormData({
        name: templateData.name,
        design: parsedTemplate,
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      setFormData({ name: "", design: getBlankTemplate() });
      setAlert(t("pdfs.templateFetchFailed"), "error");
    }
    // setLoadingTemplate(false);
  }, [editableTemplateId, formData]);

  useEffect(() => {
    initDesigner();
    if (editableTemplateId) {
      fetchEditableTemplateData();
    }
    return () => {
      if (designer.current) {
        designer.current?.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <div className="bg-white rounded-3xl w-full shadow-custom pb-4">
        <p className="text-gray-11 font-medium text-2xl p-7">
          {t("pdfs.pdfTemplate")}
        </p>
        <form onSubmit={saveTemplate}>
          <div className="px-7 flex gap-4 text-gray-11 [&_input]:border-[1px] [&_textarea]:border-[1px] [&_input]:outline-none [&_textarea]:outline-0 [&_input]:w-full [&_textarea]:w-full [&_input]:!px-4 [&_textarea]:!px-4 [&_input]:!py-1 [&_textarea]:!py-1">
            <div className="w-[100%] [&_tr]:h-10">
              <div className="flex my-2 w-full gap-4">
                <td className="w-1/2 md:w-1/5">{t("pdfs.templateName")}</td>
                <input
                  className="text-[13px] rounded-md h-[40px]"
                  id="templateName"
                  type="text"
                  value={formData.name}
                  onChange={handleInput}
                  name="name"
                  placeholder={t("pdfs.templateName")}
                />
              </div>

              <div className="flex my-2 w-full gap-4">
                <td className="w-1/2 md:w-1/5">{t("pdfs.basePdf")}</td>
                <input
                  className="text-[13px] rounded-md h-[40px]"
                  id="basePdf"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInput}
                  name="basePdf"
                />
              </div>

              <div className="w-full my-5 h-[calc(100vh-330px)]">
                <div
                  ref={containerRef}
                  className="w-full h-full border rounded-lg"
                />
                {loadingTemplate && (
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
                  {t("pdfs.save")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTemplatePdfme;
