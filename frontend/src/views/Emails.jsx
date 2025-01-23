// React imports
import { useState } from "react";

// UI Components Imports
import NewTemplate from "../component/email/NewTemplate";
import ListTemplate from "../component/email/ListTemplate";
import { USER_DETAILS } from "../constants";

const Emails = () => {
  const [showAddEditTemplate, setShowAddEditTemplate] = useState(false);
  const [editTemplateId, setEditTemplateId] = useState(null);
  const permissionsObjects =
    JSON.parse(localStorage.getItem("permissionsObjects")) || {};
  const emailsPermission = permissionsObjects?.emailsPermission;
  const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const organizationAdmin = userDetails?.organization_admin;
  const writePermission = organizationAdmin
    ? false
    : emailsPermission
    ? !emailsPermission?.is_write
    : false;
  const updatePermission = organizationAdmin
    ? false
    : emailsPermission
    ? !emailsPermission?.is_update
    : false;
  const deletePermission = organizationAdmin
    ? false
    : emailsPermission
    ? !emailsPermission?.is_delete
    : false;

  const onEdit = (templateId) => {
    setEditTemplateId(templateId);
    setShowAddEditTemplate(true);
  };

  const closeAddEditView = () => {
    setEditTemplateId(null);
    setShowAddEditTemplate(false);
  };

  return (
    <>
      {showAddEditTemplate ? (
        <NewTemplate
          writePermission={writePermission}
          updatePermission={updatePermission}
          deletePermission={deletePermission}
          editableTemplateId={editTemplateId}
          onSave={closeAddEditView}
        />
      ) : (
        <ListTemplate
          writePermission={writePermission}
          updatePermission={updatePermission}
          deletePermission={deletePermission}
          onEdit={onEdit}
          newTemplate={() => setShowAddEditTemplate(true)}
        />
      )}
    </>
  );
};

export default Emails;
