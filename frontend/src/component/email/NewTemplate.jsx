import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import emailService from "../../services/email";
import EmailEditor from 'react-email-editor';
import useAlert from "../../Hooks/useAlert";
// import emailEditorHe from "../../locales/emailEditorHe.json";

const NewTemplate = ({editableTemplateId, onSave}) => {
  const formObject = {
    name:'',
    to:'',
    subject:'',
    message:''
  }

  // const heTranslations = { 'ar-AE' : emailEditorHe }
  const[formdata, setFormData] = useState(formObject);
  const { t } = useTranslation();
  const {setAlert } = useAlert();
  const emailEditorRef = useRef(null);

  const onReady = () => {
    emailEditorRef.current.editor.setMergeTags({
      $request_id: {
        name: t('requests.$requestId'),
        value: '{request_id}'
      },
      $client_name: {
        name: t('requests.$clinetName'),
        value:  "{client_name}"
      },
      $client_email: {
        name: t('requests.$clientEmail'),
        value:  "{client_email}"
      },
      $domain_quested: {
        name: t('requests.$domainQuested'),
        value: '{domain_quested}'
      },
      $admin_email: {
        name: t('requests.$adminEmail'),
        value: '{admin_email}'
      }
    })
    // editor is ready
    // you can load your template here;
    // const templateJson = {};
    if(editableTemplateId) {
      emailEditorRef.current.editor.loadDesign(formdata.message);
    }
  };

  const exportHtml = () => {
    return new Promise((resolve, reject) => {
      let messageBody = {
        design: null,
        html: null,
      }
      emailEditorRef.current.editor.exportHtml((data) => {
        messageBody.design = data.design;
        messageBody.html = data.html;
        resolve(messageBody)
      });
    })
  };

  const saveTemplate = async(event) => {
    event.preventDefault();
    // parse tokenized data
    let data = JSON.parse(JSON.stringify(formdata));
    data.message = await exportHtml();
    for(let item in data){
      if(item === 'to' || item === 'subject') {
        data[item] = data[item].replaceAll('$', '');
      }
    }
    if(editableTemplateId) {
      // update existing template
      await emailService.updateTemplate({id: editableTemplateId, name: data.name, email_to: data.to, subject: data.subject, body: data.message}).then((response) => {
        setAlert(t('emails.templateUpdated'), 'success');
      }).catch((error) => {
        setAlert(t('emails.templateUpdateFailed'), 'error');
      })
    } else {
      // add new template
      await emailService.addNewTemplate({name: data.name, email_to: data.to, subject: data.subject, body: data.message}).then((response) => {
        setAlert(t('emails.templateAdded'), 'success');
      }).catch((error) => {
        setAlert(t('emails.templateAddFailed'), 'error');
      })
    }
    setFormData(formObject);
    onSave();
  }

  const handleInput = (event) => {
    setFormData({...formdata,[event.target.name] :event.target.value})
  }

  const formValidate = () => {
    if(!formdata.name || !formdata.to || !formdata.subject)
    {
      return false
    }
    return true
  }

  const fetchEditableTemplateData = async() => {
    let response = await emailService.getSingleTemplate(editableTemplateId);
    response = response.data.data;
    // parse back the response data to form data with dynamic token
    for(let key in response) {
      if(key === 'email_to' || key === 'subject') {
        response[key] = response[key].split(/[, ]/).map(word => {
          return word.includes('_') ? `$${word}` : word
        }).join(' ');
      }
    }
    setFormData({
      name: response.name,
      to: response.email_to,
      subject: response.subject,
      message: response.design
    });
  }

  useEffect(() => {
    if(editableTemplateId) {
      fetchEditableTemplateData();
    }
  },[]);

  return (
    <div className="h-full w-full flex flex-col-reverse md:flex-row gap-4">
      <div className="bg-white rounded-3xl w-full">
      <div className='flex pt-3 px-7 font-bold text-[#2B3674]'>{t('emails.templates')}</div>
        <form onSubmit={saveTemplate}>
      <div className="px-7 flex gap-4 font-semibold text-[#2B3674] [&_input]:border-[1px] [&_textarea]:border-[1px] [&_input]:outline-none [&_textarea]:outline-0 [&_input]:w-full [&_textarea]:w-full [&_input]:!px-4 [&_textarea]:!px-4 [&_input]:!py-1 [&_textarea]:!py-1">
          <div className="w-[100%] [&_tr]:h-10">
            <table className="w-full [&_tr]:h-10 text-[14px]">
              <tbody>
              <tr>
                <td>{t('emails.templateName')}</td>
                <td>
                  <input
                    className="text-[13px]"
                    id="templateName"
                    type="text"
                    value={formdata.name}
                    onChange={handleInput}
                    name="name"
                  />
                </td>
              </tr>
              </tbody>
            </table>
            <div className="flex my-2 w-full gap-4">
              <select name="to" id="emailTo" onChange={handleInput} value={formdata.to} className='text-[13px] outline-none bg-white border-[1px]'>
                <option value="$admin_email" className={ `p-2` }>{t('requests.$adminEmail')}</option>
                <option value="$client_email" className={ `p-2` }>{t('requests.$clientEmail')}</option>
              </select>
              <input
                className="text-[13px]"
                id="emailSubject"
                type="text"
                placeholder="Subject"
                value={formdata.subject}
                onChange={handleInput}
                name="subject"
              />
            </div>
            <div className="w-full my-5 h-[calc(100vh-330px)] [&_iframe]:!min-w-[100%] [&_iframe]:!h-[calc(100vh-330px)] [&_div]:!max-h-[calc(100vh-330px)]">
              <EmailEditor ref={emailEditorRef} onReady={onReady} />
            </div>
            <button className={`linear mb-2 px-[30px] rounded-lg py-2 text-base font-medium transition duration-200 ${formValidate() ? 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white' : 'bg-gray-300'}`}>{t('emails.save')}</button>
          </div>
      </div>
        </form>
      </div>
    </div>
  );
}

export default NewTemplate;
