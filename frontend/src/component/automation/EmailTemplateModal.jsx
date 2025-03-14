// React imports
import { useEffect, useState } from "react";

// UI Imports
import { CircularProgress, MenuItem, Select } from "@mui/material";

// Third part Imports
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// API services
import categoryService from "../../services/category";
import emailService from "../../services/email";

// Icon imports
import { AiTwotoneDelete } from "react-icons/ai";
import CrossIcon from "../../assets/images/cross.svg";

// Utils imports
import ToggleSwitch from "../common/ToggleSwitch";

// Initial state data
const initialState = {
  Admin: false,
  Client: false,
  Custom: false,
};

const EmailTemplateModal = ({
  showModal,
  setShowModal,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const { t } = useTranslation();
  const [templateList, setTemplateList] = useState([]);
  const [selectedAction, setSelectedAction] = useState("selectAction");
  const [timeAmount, setTimeAmount] = useState("");
  const [timePeriod, setTimePeriod] = useState("Hours");
  const [selectedTemplate, setSelectedTemplate] = useState("selectTemplate");
  const [actionNeedsOtherFields, setActionNeedsOtherFields] = useState([]);
  const [sendEmailTypes, setSendEmailTypes] = useState(initialState);
  const [inputValues, setInputValues] = useState([""]);
  const [deleteButtonsVisible, setDeleteButtonsVisible] = useState([false]);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [actionStatus, setActionStatus] = useState(false);
  const notify = (error) => toast.error(error);

  const handleAddInput = () => {
    setInputValues([...inputValues, ""]);
    setDeleteButtonsVisible([...deleteButtonsVisible, true]);
  };

  const handleInputChange = (index, newValue) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = newValue;
    setInputValues(updatedInputValues);
  };

  const handleDeleteInput = (index) => {
    if (inputValues.length > 1) {
      const updatedInputValues = [...inputValues];
      updatedInputValues.splice(index, 1);
      setInputValues(updatedInputValues);

      const updatedDeleteButtonsVisible = [...deleteButtonsVisible];
      updatedDeleteButtonsVisible.splice(index, 1);
      setDeleteButtonsVisible(updatedDeleteButtonsVisible);
    }
  };

  const handleCheckboxChange = (event, type) => {
    setSendEmailTypes({
      ...sendEmailTypes,
      [type]: event.target.checked,
    });
  };

  const getCustomValues = () => {
    const nonEmptyValues = inputValues.filter((value) => value.trim() !== "");
    const customEmailValue = sendEmailTypes.Custom
      ? nonEmptyValues.join(", ")
      : "";
    return customEmailValue;
  };

  const getActionsList = async () => {
    const response = await categoryService.getActions();
    const updatedData = response.data.data.filter(
      (action) => action.is_template_action
    );
    const actionId = updatedData[0]?.id;
    const selected = updatedData.find((el) => el.id == actionId);
    const isNeeded = selected.label.split("").filter((el) => el === "X");
    setActionNeedsOtherFields(isNeeded);
    setSelectedAction(actionId);
    setShowEmailTemplate(true);
  };

  const getTemplates = async () => {
    const response = await emailService.getTemplatesnetfree();
    setTemplateList(response.data.data);
  };

  const resetActionForm = () => {
    setSelectedAction("selectAction");
    setSelectedTemplate("selectTemplate");
    setActionNeedsOtherFields([]);
    setTimeAmount("");
    setTimePeriod("Hours");
    setSendEmailTypes(initialState);
    setInputValues([""]);
    setDeleteButtonsVisible([false]);
    setShowEmailTemplate(false);
  };

  const submitForm = async () => {
    let data;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const areEmailsValid = inputValues.every((value) => emailRegex.test(value));
    const {
      Admin: emailToAdmin,
      Client: emailToClient,
      Custom: isCustomEmail,
    } = sendEmailTypes;

    if (selectedAction === "selectAction") {
      notify("Please select action!!");
      return;
    }

    if (showEmailTemplate) {
      if (selectedTemplate === "selectTemplate") {
        notify("Please select template!!");
        return;
      }

      if (!emailToAdmin && !emailToClient && !isCustomEmail) {
        notify("Please select at least one action!!");
        return;
      }

      if (isCustomEmail && (!inputValues[0] || !areEmailsValid)) {
        notify(
          !inputValues[0]
            ? "Please enter email address!!"
            : "Invalid email detected."
        );
        return;
      }
    }
    data = {
      action_id: selectedAction,
      status: actionStatus,
      ...(showEmailTemplate && {
        email_inputs: showEmailTemplate
          ? {
              email_to_admin: emailToAdmin,
              email_to_client: emailToClient,
              custom_email: getCustomValues(),
              template_id: selectedTemplate,
            }
          : {},
      }),
      ...(actionNeedsOtherFields.length > 0 && {
        domain_url_inputs:
          actionNeedsOtherFields.length > 0
            ? {
                amount: timeAmount === "" ? "1" : timeAmount,
                openfor: timePeriod,
              }
            : {},
      }),
    };

    const res = await onSubmit(data);
    resetActionForm();
    setShowModal(false);
  };

  useEffect(() => {
    getActionsList();
    getTemplates();
  }, []);

  useEffect(() => {
    resetActionForm();
  }, [showModal]);

  useEffect(() => {
    if (!sendEmailTypes.Custom) {
      setInputValues([""]);
    }
  }, [sendEmailTypes]);

  return (
    <>
      {showModal ? (
        <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="w-[380px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none h-[480px]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-b-[#E3E5E6] rounded-t">
                  <h3 className="text-lg font-medium">
                    {t("netfree.addAction")}
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => {
                      setShowModal(false);
                      onClose();
                    }}
                  >
                    <img src={CrossIcon} alt="CrossIcon" />
                  </button>
                </div>

                <div className="relative p-5 pb-20 flex flex-col gap-3 scrollbar-hide">
                  {showEmailTemplate && (
                    <div>
                      <label className="block text-gray-11 text-md mb-1">
                        {t("netfree.template")}
                      </label>
                      <Select
                        MenuProps={{
                          sx: {
                            maxHeight: "300px",
                            zIndex: 9999,
                          },
                        }}
                        className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        value={selectedTemplate}
                        placeholder="Select Action"
                      >
                        <MenuItem value={"selectTemplate"} disabled>
                          {t("netfree.selectTemplate")}
                        </MenuItem>
                        {templateList?.map((el) => {
                          return el ? (
                            <MenuItem key={el.id} value={el.id}>
                              {el.name}
                            </MenuItem>
                          ) : null;
                        })}
                      </Select>
                      {selectedTemplate !== "selectTemplate" && (
                        <>
                          <div className="" style={{ display: "grid" }}>
                            <div className="flex items-center my-2 w-full gap-4">
                              <td className="w-1/2 md:w-1/5">
                                {t("automation.status")}
                              </td>
                              <ToggleSwitch
                                clickHandler={(e) =>
                                  setActionStatus(e.target.checked)
                                }
                                selected={actionStatus}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="sendEmailTypeAdmin"
                                checked={sendEmailTypes.Admin}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "Admin")
                                }
                              />
                              <label htmlFor="Admin">
                                {t("netfree.SendtoAdmin")}
                              </label>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="sendEmailTypeClient"
                                checked={sendEmailTypes.Client}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "Client")
                                }
                              />
                              <label htmlFor="Client">
                                {t("netfree.SendtoClien")}
                              </label>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="sendEmailTypeCustom"
                                checked={sendEmailTypes.Custom}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "Custom")
                                }
                              />
                              <label htmlFor="Custom">
                                {t("netfree.CustomEmail")}
                              </label>
                            </div>
                          </div>
                          {sendEmailTypes.Custom && (
                            <div
                              style={{
                                marginTop: "10px",
                                display: "grid",
                                gap: "10px",
                                justifyContent: "center",
                              }}
                            >
                              {inputValues.map((value, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <input
                                    className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black"
                                    required
                                    value={value}
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.value)
                                    }
                                    placeholder={t("netfree.Enteremail")}
                                  />
                                  {deleteButtonsVisible[index] && (
                                    <div
                                      onClick={() => handleDeleteInput(index)}
                                    >
                                      <AiTwotoneDelete
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                              <button
                                className="text-white text-[14px] font-small transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 uppercase px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                onClick={handleAddInput}
                              >
                                {t("netfree.Addmore")}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-2 pb-3 bg-white absolute bottom-0 left-[50%] transform -translate-x-1/2">
                  <button
                    className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      onClose();
                    }}
                  >
                    {t("netfree.close")}
                  </button>
                  <button
                    className="text-white items-center justify-center flex text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                    type="button"
                    onClick={submitForm}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : (
                      t("netfree.save")
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EmailTemplateModal;
