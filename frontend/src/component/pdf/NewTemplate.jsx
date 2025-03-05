// React imports
import { useEffect, useRef, useState } from "react";

// Third party Imports
import { useTranslation } from "react-i18next";
import { Designer } from "@pdfme/ui";
import { BLANK_PDF } from "@pdfme/common";

// API services
import pdfService from "../../services/pdf";

// Utils imports
import { DEFAULT_LANGUAGE } from "../../constants";

// Custom hooks imports
import useAlert from "../../Hooks/useAlert";

const formObject = {
  name: "",
  template: {
    basePdf: BLANK_PDF,
    schemas: [[
      {
        type: 'text',
        position: { x: 0, y: 0 },
        width: 50,
        height: 10,
        name: 'field1'
      }
    ]]
  }
};

const NewTemplate = ({
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
  const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [designer, setDesigner] = useState(null);
  const [formdata, setFormData] = useState({
    name: "",
    template: null
  });

  const initDesigner = () => {
    if (!containerRef.current || designer) return;

    try {
      const template = {
        basePdf: BLANK_PDF,
        schemas: [[
          {
            type: 'text',
            position: { x: 0, y: 0 },
            width: 50,
            height: 10,
            name: 'field1'
          }
        ]]
      };

      const newDesigner = new Designer({
        domContainer: containerRef.current,
        template
      });

      setDesigner(newDesigner);
      designerRef.current = newDesigner;
      setFormData(prev => ({ ...prev, template }));
    } catch (error) {
      console.error("Error initializing designer:", error);
      setAlert(t("pdfs.designerInitFailed"), "error");
    }
  };

  const saveTemplate = async (event) => {
    event.preventDefault();
    if (!designer) return;

    const template = designer.getTemplate();
    const data = {
      name: formdata.name,
      template: JSON.stringify(template),
    };

    try {
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
      setFormData(formObject);
      onSave();
    } catch (error) {
      setAlert(
        editableTemplateId
          ? t("pdfs.templateUpdateFailed")
          : t("pdfs.templateAddFailed"),
        "error"
      );
    }
  };

  const handleInput = (event) => {
    setFormData({ ...formdata, [event.target.name]: event.target.value });
  };

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const basePdf = e.target.result;
        if (designer) {
          designer.updateTemplate({
            ...formdata.template,
            basePdf,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formValidate = () => {
    if (!formdata.name || !designer?.getTemplate()?.basePdf) {
      return false;
    }
    return true;
  };

  const fetchEditableTemplateData = async () => {
    setLoadingTemplate(true);
    try {
      const response = await pdfService.getSingleTemplate(editableTemplateId);
      const templateData = response.data.data;
      const parsedTemplate = JSON.parse(templateData.template);
      
      // Ensure template has required structure
      if (!parsedTemplate.schemas || !Array.isArray(parsedTemplate.schemas)) {
        parsedTemplate.schemas = [[{
          type: 'text',
          position: { x: 0, y: 0 },
          width: 50,
          height: 10,
        }]];
      }
      
      setFormData({
        name: templateData.name,
        template: parsedTemplate,
      });
    } catch (error) {
      setFormData(formObject); // Reset to default template on error
      console.error("Error fetching template:", error);
      setAlert(t("pdfs.templateFetchFailed"), "error");
    }
    setLoadingTemplate(false);
  };

  useEffect(() => {
    if (editableTemplateId) {
      fetchEditableTemplateData();
    }
  }, [editableTemplateId]);

  useEffect(() => {
    initDesigner();
    return () => {
      if (designer) {
        designer.destroy();
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
                  value={formdata.name}
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
                {!loadingTemplate && (
                  <div
                    ref={containerRef}
                    className="w-full h-full border rounded-lg"
                  />
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

export default NewTemplate;
