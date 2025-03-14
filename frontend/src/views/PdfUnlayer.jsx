// React imports
import { useContext, useEffect, useState } from "react";

// UI Components Imports
import ListTemplate from "../component/pdf/ListTemplate";
import { USER_DETAILS } from "../constants";
import { UserContext } from "../Hooks/permissionContext";
import NewTemplateUnlayer from "../component/pdf/NewTemplateUnlayer";

const PdfUnlayer = () => {
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
        <NewTemplateUnlayer
          writePermission={writePermission}
          updatePermission={updatePermission}
          deletePermission={deletePermission}
          editableTemplateId={editTemplateId}
          onSave={closeAddEditView}
        />
      ) : (
        <ListTemplate
          pdfType={"unlayer"}
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

export default PdfUnlayer;
