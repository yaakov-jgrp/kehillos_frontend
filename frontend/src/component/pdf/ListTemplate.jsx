// React imports
import { useEffect, useState } from "react";

// UI Components Imports
import SearchField from "../fields/SearchField";
import Loader from "../common/Loader";

// Third part Imports
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// API services
import pdfService from "../../services/pdf";

// Custom hooks imports
import useAlert from "../../Hooks/useAlert";
import TemplateCard from "./TemplateCard";
import { Box, Tab, Tabs } from "@mui/material";
import EditButtonIcon from "../common/EditButton";
import PdfEditIcon from "../../assets/images/pdf.svg";
import AddIcon from "../../assets/images/add.svg";
import CustomSearchField from "../fields/CustomSearchField";

const ListTemplate = ({
  newTemplate,
  pdfType = "pdfme",
  onEdit,
  writePermission,
  updatePermission,
  deletePermission,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [filterdTemplateList, setFilteredTemplteList] = useState([]);
  const { setAlert } = useAlert();

  const getTemplates = async () => {
    setIsLoading(true);
    const response = await pdfService.getTemplates();
    const data = response.data.data.filter((x) => x.type === pdfType);
    setTemplateList(data);
    setFilteredTemplteList(data);
    setIsLoading(false);
  };

  const deleteTemplate = async (id) => {
    setIsLoading(true);
    await pdfService
      .deleteTemplate(id)
      .then((res) => {
        getTemplates();
        setAlert(t("pdfs.deleteTemplateSuccess"), "success");
        setIsLoading(false);
      })
      .catch((error) => {
        setAlert(t("pdfs.deleteTemplateFailed"), "error");
        setIsLoading(false);
      });
  };

  const duplicateTemplate = async (id) => {
    setIsLoading(true);
    await pdfService
      .duplicateTemplate(id)
      .then((res) => {
        getTemplates();
        setAlert(t("pdfs.duplicateTemplateSuccess"), "success");
        setIsLoading(false);
      })
      .catch((error) => {
        setAlert(t("pdfs.duplicateTemplateFailed"), "error");
        setIsLoading(false);
      });
  };

  const searchTemplte = (searchTerm) => {
    if (searchTerm.trim().length) {
      setFilteredTemplteList(
        templateList.filter((el) =>
          el.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTemplteList(templateList);
    }
  };

  useEffect(() => {
    getTemplates();
  }, [lang]);

  return (
    <div className="h-full w-full overflow-y-auto bg-white shadow-custom rounded-2xl pb-12">
      <div className="w-full flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between px-2">
          <p className="text-gray-11 font-medium text-2xl">
            {t("pdfs.pdfTemplate")}
          </p>
          <div className="flex items-center gap-4">
            <CustomSearchField
              variant="templateSearch"
              extra=""
              id="searchTemplate"
              type="text"
              placeholder={t("searchbox.placeHolder")}
              onChange={(e) => searchTemplte(e.target.value)}
              name="searchTemplate"
              noUnderline="true"
              borderRadius="30"
            />
            <button
              disabled={writePermission}
              className={`disabled:cursor-not-allowed mt-5 w-[180px] h-[40px] rounded-lg text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-1`}
              onClick={newTemplate}
            >
              <img src={AddIcon} alt="add_icon" className="mt-[-1px]" />
              {t("pdfs.newTemplate")}
            </button>
          </div>
        </div>

        <div className="w-full mt-4 p-4">
          {isLoading && (
            <div className="h-[67vh] w-full flex justify-center items-center">
              <Loader />
            </div>
          )}
          {!isLoading && (
            <div className="w-full flex flex-wrap gap-4 justify-center items-center md:justify-start">
              {filterdTemplateList.map((template) => {
                return (
                  <TemplateCard
                    writePermission={writePermission}
                    updatePermission={updatePermission}
                    deletePermission={deletePermission}
                    key={template.id}
                    template={template}
                    onEdit={onEdit}
                    duplicateTemplate={duplicateTemplate}
                    deleteTemplate={deleteTemplate}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListTemplate;
