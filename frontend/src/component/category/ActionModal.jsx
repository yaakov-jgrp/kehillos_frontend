import { useEffect, useState } from "react";
import categoryService from "../../services/category";
import emailService from "../../services/email";
import { useTranslation } from "react-i18next";

const ActionModal = ({ showModal, setShowModal, updateAction, categoryId, setDefaultAction, isDefault }) => {
  const [actionsList, setActionsList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [selectedAction, setSelectedAction] = useState("selectAction");
  const [domainUrl, setDomainUrl] = useState("");
  const [hours, setHours] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState('selectTemplate');
  const [actionNeedsOtherFields, setActionNeedsOtherFields] = useState([]);
  const { t } = useTranslation();

  const getActionsList = async () => {
    const response = await categoryService.getActions();
    setActionsList(response.data.data);
  }

  const getTemplates = async () => {
    const response = await emailService.getTemplates();
    setTemplateList(response.data.data);
  }

  const setActionValue = (e) => {
    const actionId = e.target.value;
    const selected = actionsList.find(el => el.id == actionId);
    const isNeeded = selected.label.split('').filter(el => el === '{');
    setActionNeedsOtherFields(isNeeded);
    setSelectedAction(actionId)
  }

  const submitForm = async () => {
    if (isDefault) {
      await setDefaultAction(selectedAction);
    } else {
      let data;
      if (selectedAction == 1) {
        data = { id: categoryId, to_add: selectedAction, inputs: { resource: domainUrl, hours: hours }, template_id: selectedTemplate };
      } else {
        data = { id: categoryId, to_add: selectedAction, inputs: { resource: domainUrl, hours: hours } }
      }
      await updateAction(data);
    }
    setSelectedAction("selectAction");
    setSelectedTemplate("selectTemplate");
    setActionNeedsOtherFields([]);
    setDomainUrl('');
    setHours('');
    setShowModal(false);
  }

  useEffect(() => {
    getActionsList();
    getTemplates();
  }, [])

  return (
    <>
      {showModal ? (
        <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-2xl font-semibold">{t('netfree.addAction')}</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-black text-sm font-bold mb-1">
                      {t('netfree.actions')}
                    </label>
                    <select className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white" onChange={(e) => setActionValue(e)} value={selectedAction} placeholder="Select Action">
                      <option value={'selectAction'} disabled>{t('netfree.selectAction')}</option>
                      {
                        actionsList?.map(el => {
                          return (
                            el ? <option key={el.id} value={el.id}>{el.label}</option> : null
                          );
                        })
                      }
                    </select>
                    {
                      actionNeedsOtherFields.length >= 1 ?
                        <>
                          <label className="block text-black text-sm font-bold mb-1">
                            {actionsList.length > 0 && actionsList.find(el => el.id == selectedAction)?.label?.includes("Domain") ? t('netfree.domain') : t('netfree.url')}
                          </label>
                          <input className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" type="text" onChange={(e) => setDomainUrl(e.target.value)} />
                        </>
                        : null
                    }
                    {
                      actionNeedsOtherFields.length >= 2 ?
                        <>
                          <label className="block text-black text-sm font-bold mb-1">
                            {t('netfree.openinhours')}
                          </label>
                          <input className="shadow appearance-none outline-none border rounded w-full py-2 px-1 text-black" type="number" min={0} onChange={(e) => setHours(e.target.value)} />
                        </>
                        : null
                    }
                    {
                      selectedAction == 1 &&
                      <>
                        <label className="block text-black text-sm font-bold mb-1">
                          {t('netfree.template')}
                        </label>
                        <select className="shadow appearance-none border rounded outline-none w-full py-2 px-1 text-black bg-white" onChange={(e) => setSelectedTemplate(e.target.value)} value={selectedTemplate} placeholder="Select Action">
                          <option value={'selectTemplate'} disabled>{t('netfree.selectTemplate')}</option>
                          {
                            templateList?.map(el => {
                              return (
                                el ? <option key={el.id} value={el.id}>{el.name}</option> : null
                              );
                            })
                          }
                        </select></>
                    }
                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {t('netfree.close')}
                  </button>
                  <button
                    className="text-white text-[14px] font-small transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 uppercase px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={submitForm}
                  >
                    {t('netfree.save')}
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

export default ActionModal;