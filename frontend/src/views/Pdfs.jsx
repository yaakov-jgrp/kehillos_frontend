// React imports
import { useContext, useState } from "react";

// UI Components Imports
import NewTemplate from "../component/pdf/NewTemplate";
import ListTemplate from "../component/pdf/ListTemplate";
import { USER_DETAILS } from "../constants";
import { UserContext } from "../Hooks/permissionContext";

const Pdfs = () => {
  const [showAddEditTemplate, setShowAddEditTemplate] = useState(false);
  const [editTemplateId, setEditTemplateId] = useState(null);
  const { userDetails, permissions } = useContext(UserContext);
  // const permissionsObjects =
  //   JSON.parse(localStorage.getItem("permissionsObjects")) || {};
  const pdfsPermission = permissions?.pdfsPermission;
  // const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const organizationAdmin = userDetails?.organization_admin;
  const writePermission = organizationAdmin
    ? false
    : pdfsPermission
    ? !pdfsPermission?.is_write
    : false;
  const updatePermission = organizationAdmin
    ? false
    : pdfsPermission
    ? !pdfsPermission?.is_update
    : false;
  const deletePermission = organizationAdmin
    ? false
    : pdfsPermission
    ? !pdfsPermission?.is_delete
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

export default Pdfs;
