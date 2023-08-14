import NewTemplate from "../component/email/NewTemplate";
import ListTemplate from "../component/email/ListTemplate";
import { useState } from "react";

const Emails = () => {
  const [showAddEditTemplate, setShowAddEditTemplate] = useState(false);
  const [editTemplateId, setEditTemplateId] = useState(null);

  const onEdit = (templateId) => {
    setEditTemplateId(templateId);
    setShowAddEditTemplate(true);
  }

  const closeAddEditView = () => {
    setEditTemplateId(null);
    setShowAddEditTemplate(false);
  }

  return(
    <>
      {
        showAddEditTemplate ? <NewTemplate editableTemplateId={editTemplateId} onSave={closeAddEditView} /> : <ListTemplate onEdit={onEdit} newTemplate={() => setShowAddEditTemplate(true)} />
      }
    </>
  );
}

export default Emails;
