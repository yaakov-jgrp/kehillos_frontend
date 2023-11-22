import { useTranslation } from "react-i18next";
import SearchField from "../fields/SearchField";
import emailService from "../../services/email";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import {
  MdDelete,
  MdEdit,
} from "react-icons/md";
import { HiDuplicate } from "react-icons/hi"
import useAlert from "../../Hooks/useAlert";

const ListTemplate = ({ newTemplate, onEdit }) => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [addEditMode, setAddEditMode] = useState(false);
  const [connectSMTPData, setConnectedSMTPData] = useState({});
  const [filterdTemplateList, setFilteredTemplteList] = useState([]);
  const { setAlert } = useAlert();

  const getTemplates = async () => {
    setIsLoading(true);
    const response = await emailService.getTemplates();
    setTemplateList(response.data.data);
    setFilteredTemplteList(response.data.data);
    setIsLoading(false);
  }

  const deleteTemplate = async (id) => {
    setIsLoading(true);
    await emailService.deleteTemplate(id).then((res) => {
      getTemplates();
      setAlert(t('emails.deleteTemplateSuccess'), 'success');
      setIsLoading(false);
    }).catch(error => {
      setAlert(t('emails.deleteTemplateFailed'), 'error');
      setIsLoading(false);
    })
  }

  const duplicateTemplate = async (id) => {
    setIsLoading(true);
    await emailService.duplicateTemplate(id).then((res) => {
      getTemplates();
      setAlert(t('emails.duplicateTemplateSuccess'), 'success');
      setIsLoading(false);
    }).catch(error => {
      setAlert(t('emails.duplicateTemplateFailed'), 'error');
      setIsLoading(false);
    })
  }

  const searchTemplte = (searchTerm) => {
    if (searchTerm.trim().length) {
      setFilteredTemplteList(templateList.filter((el) => el.name.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredTemplteList(templateList);
    }
  }

  const smtpFormObject = {
    email: '',
    password: ''
  }

  const [smtpFormdata, setSmtpFormdata] = useState(smtpFormObject);

  const handleSMTPInputChange = (event) => {
    setSmtpFormdata({ ...smtpFormdata, [event.target.name]: event.target.value })
  }

  const smtpFormValidate = () => {
    if (!smtpFormdata.email || !smtpFormdata.password) {
      return false
    }
    if (smtpFormdata.email && !(/\S+@\S+\.\S+/.test(smtpFormdata.email))) {
      return false
    }
    if (smtpFormdata.password && (smtpFormdata.password.length < 2)) {
      return false
    }
    return true
  }

  const fetchSMTPSettings = async () => {
    const res = await emailService.getSMTPDetail();
    if (res.status === 200 && res.data.data) {
      setConnectedSMTPData(res.data.data);
      setAddEditMode(false);
    } else {
      setAddEditMode(true);
      setSmtpFormdata({ email: '', password: '' });
    }
  }

  const editSMTPSettings = () => {
    setSmtpFormdata({ email: connectSMTPData.email, password: '' });
    setAddEditMode(true);
  }

  const connectSMTPEmail = async (event) => {
    event.preventDefault()
    await emailService.loginEmail({ email: smtpFormdata.email, password: smtpFormdata.password }).then(response => {
      if (response.status === 200) {
        fetchSMTPSettings();
        setAlert(response.data.message, 'success');
      }
    }).catch(error => {
      setConnectedSMTPData(smtpFormObject);
      setAlert(error.response.data.message, 'error');
    })
  }

  const cancelSMTPEditSettings = () => {
    setAddEditMode(false);
  }

  useEffect(() => {
    getTemplates();
    fetchSMTPSettings();
  }, [lang]);

  return (
    <div className="h-full w-full">
      <div className="w-full flex justify-between gap-2 items-center [&_div]:bg-white [&_div]:px-1 [&_div]:py-1 [&_div]:rounded-2xl">
        <div className="dark:!bg-navy-800">
          <button type="submit" className={`w-full rounded-full py-2 px-7 text-[12px] md:text-base font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`} onClick={newTemplate}>
            {t('emails.newTemplate')}
          </button>
        </div>
        <div className='md:w-[25%]'>
          <SearchField
            variant="templateSearch"
            extra=""
            id="searchTemplate"
            type="text"
            placeholder={t('searchbox.placeHolder')}
            onChange={(e) => searchTemplte(e.target.value)}
            name="searchTemplate"
            noUnderline="true"
            borderRadius='30'
          />
        </div>
      </div>
      <div className="mt-4 w-full flex gap-4 flex-col-reverse md:flex-row">
        <div className="w-full md:w-[75%]">
          {
            isLoading &&
            <div className='h-[67vh] w-full flex justify-center items-center'>
              <Loader />
            </div>
          }
          <div className="w-full flex flex-wrap gap-4">
            {
              filterdTemplateList.map((template) => {
                return (
                  <div className="bg-white relative h-[120px] md:h-[160px] px-5 py-5 rounded-[20px] w-full md:w-[30%] break-words text-center" key={template.id}>
                    <div className="text-[#2B3674] text-[20px] md:text-[24px] font-bold">{template.name}</div>
                    <div className='w-full absolute bottom-[20px] left-0 flex justify-center gap-5'>
                      <MdDelete className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => deleteTemplate(template.id)} />
                      <HiDuplicate className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => duplicateTemplate(template.id)} />
                      <MdEdit className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => onEdit(template.id)} />
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="flex flex-col gap-4 md:h-[67vh] w-full md:w-[25%] mt-4 md:mt-0">
          <div className="bg-white rounded-3xl text-center text-[#2B3674] p-4">
            <h3 className="mb-2 text-[20px] font-bold">{t('emails.smtp')}</h3>
            {
              !addEditMode ?
                <div>
                  <div className="flex justify-between">
                    <p>{t('emails.connected')}</p>
                    <p className="cursor-pointer text-brand-500" onClick={editSMTPSettings}>{t('emails.edit')}</p>
                  </div>
                  <p className="text-left text-[#c9c9c9]">{connectSMTPData && connectSMTPData.email}</p>
                </div>
                :
                <form onSubmit={connectSMTPEmail}>
                  {connectSMTPData.email && <p className="cursor-pointer text-right text-brand-500" onClick={cancelSMTPEditSettings}>{t('emails.cancel')}</p>}
                  <input type="email" placeholder={t('auth.email')} value={smtpFormdata.email} name="email" className="outline-none mb-2 border-[1px] w-full rounded-lg p-1" onChange={handleSMTPInputChange} />
                  <input type="password" placeholder={t('auth.password')} value={smtpFormdata.password} name="password" className="outline-none mb-2 border-[1px] w-full rounded-lg p-1" onChange={handleSMTPInputChange} />
                  <button type="submit" disabled={!smtpFormValidate()} className={`linear w-full rounded-lg p-1 text-base font-medium transition duration-200 ${smtpFormValidate() ? 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white' : 'bg-gray-300'}`}>{t('emails.connect')}</button>
                </form>

            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListTemplate;
