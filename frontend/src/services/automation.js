import { formatDate } from "../utils/helpers";
import api from "./api";

const getAutomationList = (params) => {
  return api.get(`/api/automation-workflow/${params}`);
};
const getAutomationListById = (id) => {
  return api.get(`/api/automation-workflow/${id}/`);
};

const deleteWorkflowData = (id) => {
  return api.delete(`/api/automation-workflow/${id}/`);
};

const updateStatus = (id, data) => {
  return api.post(`/api/automation-workflow/workflow/${id}/status/`, data);
};
const createWorkflow = (lang, data) => {
  return api.post(`/api/automation-workflow/?lang=${lang}`, data);
};
const updateWorkflow = (id, data) => {
  return api.post(`/api/automation-workflow/${id}/`, data);
};

const automationService = {
  deleteWorkflowData,
  getAutomationList,
  updateStatus,
  createWorkflow,
  updateWorkflow,
  getAutomationListById
};

export default automationService;
