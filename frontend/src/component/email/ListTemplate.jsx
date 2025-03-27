// React imports
import { useEffect, useState } from "react";

// UI Components Imports
import SearchField from "../fields/SearchField";
import Loader from "../common/Loader";

// Third part Imports
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// API services
import emailService from "../../services/email";

// Custom hooks imports
import useAlert from "../../Hooks/useAlert";
import TemplateCard from "./TemplateCard";
import { Box, Tab, Tabs } from "@mui/material";
import EditButtonIcon from "../common/EditButton";
import EmailEditIcon from "../../assets/images/email.svg";
import AddIcon from "../../assets/images/add.svg";
import CustomSearchField from "../fields/CustomSearchField";
import EmailTemplating from "../../views/EmailTemplating";
import PdfMe from "../../views/PdfMe";

// initial state data
const smtpFormObject = {
  email: "",
  password: "",
  smtp_server: "",
  smtp_port: 587,
  imap_email: "",
  imap_password: "",
  imap_server: "",
  imap_port: 993,
};

const ListTemplate = ({
  newTemplate,
  onEdit,
  writePermission,
  updatePermission,
  deletePermission,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [smtpFormdata, setSmtpFormdata] = useState(smtpFormObject);
  const [isLoading, setIsLoading] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [addEditMode, setAddEditMode] = useState(false);
  const [connectSMTPData, setConnectedSMTPData] = useState({});
  const [filterdTemplateList, setFilteredTemplteList] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [templatingModal, setTemplatingModal] = useState(false);
  const [newText, setNewText] = useState(true);
  const [editText, setEditText] = useState(null);
  const { setAlert } = useAlert();

  const handleTabChange = (event, tabValue) => {
    setCurrentTab(tabValue);
  };

  const getTemplates = async () => {
    setIsLoading(true);
    const response = await emailService.getTemplates();
    setTemplateList(response.data.data);
    setFilteredTemplteList(response.data.data);
    setIsLoading(false);
  };

  const deleteTemplate = async (id) => {
    setIsLoading(true);
    await emailService
      .deleteTemplate(id)
      .then((res) => {
        getTemplates();
        setAlert(t("emails.deleteTemplateSuccess"), "success");
        setIsLoading(false);
      })
      .catch((error) => {
        setAlert(t("emails.deleteTemplateFailed"), "error");
        setIsLoading(false);
      });
  };

  const duplicateTemplate = async (id) => {
    setIsLoading(true);
    await emailService
      .duplicateTemplate(id)
      .then((res) => {
        getTemplates();
        setAlert(t("emails.duplicateTemplateSuccess"), "success");
        setIsLoading(false);
      })
      .catch((error) => {
        setAlert(t("emails.duplicateTemplateFailed"), "error");
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

  const handleSMTPInputChange = (event) => {
    setSmtpFormdata({
      ...smtpFormdata,
      [event.target.name]: event.target.value,
    });
  };

  const smtpFormValidate = () => {
    if (!smtpFormdata.email || !smtpFormdata.password) {
      return false;
    }
    if (smtpFormdata.email && !/\S+@\S+\.\S+/.test(smtpFormdata.email)) {
      return false;
    }
    if (smtpFormdata.password && smtpFormdata.password.length < 2) {
      return false;
    }
    return true;
  };

  const fetchSMTPSettings = async () => {
    const res = await emailService.getSMTPDetail();
    if (res.status === 200 && res.data.data) {
      setConnectedSMTPData(res.data.data);
      setAddEditMode(false);
    } else {
      setAddEditMode(true);
      setSmtpFormdata(smtpFormObject);
    }
  };

  const editSMTPSettings = () => {
    setSmtpFormdata({ ...connectSMTPData, password: "", imap_password: "" });
    setAddEditMode(true);
  };

  const connectSMTPEmail = async (event) => {
    event.preventDefault();
    await emailService
      .loginEmail(smtpFormdata)
      .then((response) => {
        if (response.status === 200) {
          fetchSMTPSettings();
          setAlert(response.data.message, "success");
        }
      })
      .catch((error) => {
        setConnectedSMTPData(smtpFormObject);
        setAlert(error.response.data.message, "error");
      });
  };

  const cancelSMTPEditSettings = () => {
    setAddEditMode(false);
  };

  useEffect(() => {
    getTemplates();
    fetchSMTPSettings();
  }, [lang]);

  return (
    <div className="h-full w-full overflow-y-auto bg-white shadow-custom rounded-2xl pb-12">
      <div className="w-full flex flex-col gap-4 p-4">
        {currentTab === 0 && (
          <div className="bg-[#F6F8F9] rounded-lg flex items-center justify-between">
            <div className="m-4">
              <h3 className="text-[16px] font-medium text-gray-11">
                {t("emails.smtp")}
              </h3>
            </div>
            {!addEditMode ? (
              <div className="flex items-center gap-2 m-4">
                <img src={EmailEditIcon} alt="EmailEditIcon" />
                <div className="flex gap-1">
                  <p className="text-gray-10">{t("emails.connected")}:</p>
                  <p className="text-gray-11">
                    {connectSMTPData && connectSMTPData.email}
                  </p>
                </div>
                <EditButtonIcon onClick={editSMTPSettings} />
              </div>
            ) : (
              <form onSubmit={connectSMTPEmail} className="m-4">
                {connectSMTPData.email && (
                  <p
                    className="cursor-pointer text-right text-brand-500 mb-2"
                    onClick={cancelSMTPEditSettings}
                  >
                    {t("emails.cancel")}
                  </p>
                )}
                <input
                  type="text"
                  placeholder={t("auth.from_name")}
                  value={smtpFormdata.from_name}
                  name="from_name"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="email"
                  placeholder={t("auth.email")}
                  value={smtpFormdata.email}
                  name="email"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="password"
                  placeholder={t("auth.password")}
                  value={smtpFormdata.password}
                  name="password"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="text"
                  placeholder={t("auth.smtp_server")}
                  value={smtpFormdata.smtp_server}
                  name="smtp_server"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="number"
                  placeholder={t("auth.smtp_port")}
                  value={smtpFormdata.smtp_port}
                  name="smtp_port"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="email"
                  placeholder={t("auth.imap_email")}
                  value={smtpFormdata.imap_email}
                  name="imap_email"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="password"
                  placeholder={t("auth.imap_password")}
                  value={smtpFormdata.imap_password}
                  name="imap_password"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="text"
                  placeholder={t("auth.imap_server")}
                  value={smtpFormdata.imap_server}
                  name="imap_server"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />
                <input
                  type="number"
                  placeholder={t("auth.imap_port")}
                  value={smtpFormdata.imap_port}
                  name="imap_port"
                  className="outline-none mb-2 border-[1px] w-full rounded-lg p-2"
                  onChange={handleSMTPInputChange}
                />

                <button
                  type="submit"
                  disabled={!smtpFormValidate() || writePermission}
                  className={`disabled:cursor-not-allowed text-sm linear rounded-lg p-2 font-medium transition duration-200 ${
                    smtpFormValidate()
                      ? "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {t("emails.connect")}
                </button>
              </form>
            )}
          </div>
        )}

        <Box sx={{ borderBottom: 1, borderColor: "#E3E5E6" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs example"
          >
            {[
              t("emails.newTemplate"),
              t("emails.templating"),
              t("pdfs.pdfTemplate"),
            ].map((tabItem, i) => {
              return (
                <Tab
                  key={i}
                  label={
                    <>
                      <h5 className="text-start text-[12px] capitalize md:text-[16px] -mb-1 font-normal w-[100%] flex items-center justify-between">
                        {tabItem}
                      </h5>
                    </>
                  }
                />
              );
            })}
          </Tabs>
        </Box>

        {currentTab !== 2 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-gray-11 font-medium text-2xl">
              {currentTab === 0
                ? t("emails.emailTemplate")
                : t("sidebar.emails")}
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
                onClick={
                  currentTab === 0
                    ? newTemplate
                    : currentTab === 1
                    ? () => {
                        setTemplatingModal(true);
                        setNewText(true);
                        setEditText(null);
                      }
                    : () => {}
                }
              >
                <img src={AddIcon} alt="add_icon" className="mt-[-1px]" />
                {currentTab === 0
                  ? t("emails.newTemplate")
                  : t("emails.newText")}
              </button>
            </div>
          </div>
        )}

        {currentTab === 0 && (
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
        )}

        {currentTab === 1 && (
          <EmailTemplating
            writePermission={writePermission}
            updatePermission={updatePermission}
            deletePermission={deletePermission}
            templatingModal={templatingModal}
            newText={newText}
            editText={editText}
            setTemplatingModal={setTemplatingModal}
            setNewText={setNewText}
            setEditText={setEditText}
          />
        )}
        {currentTab === 2 && <PdfMe />}
      </div>
    </div>
  );
};

export default ListTemplate;
