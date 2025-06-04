import api from "./api";

const getWorkflows = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.get(
    `/api/automation-workflow/netfree-rules-workflow/?lang=${lang}&profile=${
      filterProfileID ? filterProfileID : "1"
    }`
  );
};

const createWorkflow = (formData) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const fetchedProfile = localStorage.getItem("FILTER_PROFILE_ID");
  const profileID = fetchedProfile ? fetchedProfile : "1";

  return api.post(
    `/api/automation-workflow/netfree-rules-workflow/?lang=${lang}&profile=${profileID}`,
    formData
  );
};
const editWorkflow = (formData, id) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const fetchedProfile = localStorage.getItem("FILTER_PROFILE_ID");
  const profileID = fetchedProfile ? fetchedProfile : "1";
  return api.patch(
    `/api/automation-workflow/netfree-rules-workflow/${id}/?lang=${lang}&profile=${profileID}`,
    formData
  );
};

const deleteWorkflow = (workflowID) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.delete(
    `/api/automation-workflow/netfree-rules-workflow/${workflowID}/?lang=${lang}&profile=${
      filterProfileID ? filterProfileID : "1"
    }`
  );
};

const workflowRulesServices = {
  getWorkflows,
  createWorkflow,
  editWorkflow,
  deleteWorkflow,
};
export default workflowRulesServices;
