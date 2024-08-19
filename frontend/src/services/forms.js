import { formatDate } from "../utils/helpers";
import api from "./api";

const createNewForm = (data) => {
  return api.post(`/api/forms/create-form/`, data);
};

const getAllForms = (params) => {
  return api.get(`/api/forms/get-forms/${params}`);
};

const deleteForm = (id) => {
  return api.delete(`/api/forms/delete-form/${id}`);
};

const createNewCondition = (data) => {
  return api.post(`/api/forms/add-condition/`, data);
};

const deleteCondition = (id) => {
  return api.delete(`/api/forms/delete-condition/${id}`);
};

const createNewBlock = (data) => {
  return api.post(`/api/forms/add-block/`, data);
};

const deleteBlock = (id) => {
  return api.delete(`/api/forms/delete-block/${id}`);
};

const createNewField = (data) => {
  return api.post(`/api/forms/add-field/`, data);
};

const deleteField = (id) => {
  return api.delete(`/api/forms/delete-field/${id}`);
};

const updateForm = (id, data) => {
  return api.put(`/api/forms/update-form/${id}`, data);
};

const createNewClientForm = (data) => {
  return api.post(`/api/forms/create-client-form/`, data);
};

const getAllClientsForms = (params) => {
  return api.get(`/api/forms/client-forms/${params}`);
};

const deleteClientForm = (id) => {
  return api.delete(`/api/forms/delete-client-form/${id}`);
};

const getSingleClientForms = (clientId) => {
  return api.get(`/api/forms/client-forms/${clientId}`);
};

const getSingleClientFormDetails = (formId) => {
  // return api.get(`/api/forms/client-form-details/${formId}`);
  const payload = {
    data: {
      id: 1,
      name: "Form 1",
      isPined: true,
      clientID: 2,
      blocks: [
        {
          id: 2,
          name: "More Information",
          isRepeatable: false,
        },
        {
          id: 3,
          name: "Personal Information",
          isRepeatable: false,
        },
        {
          id: 4,
          name: "Personal Information",
          isRepeatable: false,
        },
        {
          id: 5,
          name: "Personal Information",
          isRepeatable: false,
        },
      ],
      fields: [
        {
          id: 1,
          blockId: 2,
          name: "DoB",
          data_type: {
            label: "date",
            value: "date",
          },
          enum_values: {},
          required: true,
          unique: false,
          defaultvalue: "2024-07-07T13:21:06.408+00:00",
        },
        {
          id: 2,
          blockId: 2,
          name: "City",
          data_type: {
            label: "select",
            value: "select",
          },
          enum_values: {
            choices: [
              {
                id: 1,
                label: "New York",
                value: "new_york",
              },
              {
                id: 2,
                label: "Brooklyn",
                value: "brooklyn",
              },
            ],
          },
          required: true,
          unique: false,
          defaultvalue: "brooklyn",
        },
        {
          id: 3,
          blockId: 2,
          name: "Single",
          data_type: {
            label: "checkbox",
            value: "checkbox",
          },
          enum_values: {},
          required: true,
          unique: false,
          defaultvalue: true,
        },
        {
          id: 4,
          blockId: 2,
          name: "Marksheet",
          data_type: {
            label: "file",
            value: "file",
          },
          enum_values: {},
          required: true,
          unique: false,
          defaultvalue: "C:\\fakepath\\check_circle.svg",
        },
        {
          id: 5,
          blockId: 3,
          name: "Name",
          data_type: {
            label: "text",
            value: "text",
          },
          enum_values: {},
          required: true,
          unique: false,
          defaultvalue: "Abdul Raffay",
        },
        {
          id: 6,
          blockId: 3,
          name: "Email",
          data_type: {
            label: "email",
            value: "email",
          },
          enum_values: {},
          required: true,
          unique: true,
          defaultvalue: "abc@gmail.com",
        },
        {
          id: 7,
          blockId: 3,
          name: "Age",
          data_type: {
            label: "number",
            value: "number",
          },
          enum_values: {},
          required: true,
          unique: false,
          defaultvalue: 22,
        },
        {
          id: 8,
          blockId: 3,
          name: "Contact No.",
          data_type: {
            label: "phone",
            value: "phone",
          },
          enum_values: {},
          required: true,
          unique: true,
          defaultvalue: "+923154478526",
        },
        {
          id: 9,
          blockId: 4,
          name: "Name",
          data_type: {
            label: "text",
            value: "text",
          },
          enum_values: {},
          required: true,
          unique: false,
          defaultvalue: "Sara Khan",
        },
        {
          id: 10,
          blockId: 4,
          name: "Email",
          data_type: {
            label: "email",
            value: "email",
          },
          enum_values: {},
          required: true,
          unique: true,
          defaultvalue: "sara@gmail.com",
        },
        {
          id: 11,
          blockId: 4,
          name: "Age",
          data_type: {
            label: "number",
            value: "number",
          },
          enum_values: {},
          required: true,
          unique: false,
          defaultvalue: 22,
        },
        {
          id: 12,
          blockId: 4,
          name: "Contact No.",
          data_type: {
            label: "phone",
            value: "phone",
          },
          enum_values: {},
          required: true,
          unique: true,
          defaultvalue: "+923154478526",
        },
      ],
      versions: [
        {
          id: 1,
          name: "Version 1",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Risus eu natoque urna curabitur. Proin lobortis at gravida et. ",
          createdAt: "2024-07-07T13:21:06.408+00:00",
          dirtyFields: [
            {
              current: "Abdul Raffay",
              previous: "Ali Khan",
            },
            {
              current: "03112290954",
              previous: "03112294554",
            },
            {
              current: "Single",
              previous: "Not Single",
            },
            {
              current: "Abdul Raffay",
              previous: "Ali Khan",
            },
            {
              current: "03112290954",
              previous: "03112294554",
            },
            {
              current: "Single",
              previous: "Not Single",
            },
          ],
        },
        {
          id: 2,
          name: "Version 2",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Risus eu natoque urna curabitur. Proin lobortis at gravida et. ",
          createdAt: "2024-07-07T13:21:06.408+00:00",
          dirtyFields: [
            {
              current: "Abdul Raffay",
              previous: "Ali Khan",
            },
            {
              current: "03112290954",
              previous: "03112294554",
            },
            {
              current: "Single",
              previous: "Not Single",
            },
            {
              current: "Abdul Raffay",
              previous: "Ali Khan",
            },
            {
              current: "03112290954",
              previous: "03112294554",
            },
            {
              current: "Single",
              previous: "Not Single",
            },
          ],
        },
        {
          id: 3,
          name: "Version 3",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Risus eu natoque urna curabitur. Proin lobortis at gravida et. ",
          createdAt: "2024-07-07T13:21:06.408+00:00",
          dirtyFields: [
            {
              current: "Abdul Raffay",
              previous: "Ali Khan",
            },
            {
              current: "03112290954",
              previous: "03112294554",
            },
            {
              current: "Single",
              previous: "Not Single",
            },
            {
              current: "Abdul Raffay",
              previous: "Ali Khan",
            },
            {
              current: "03112290954",
              previous: "03112294554",
            },
            {
              current: "Single",
              previous: "Not Single",
            },
          ],
        },
      ],
    },
  };
  return new Promise((resolve, reject) => {
    resolve(payload);
  });
};

const formService = {
  createNewForm,
  getAllForms,
  deleteForm,
  createNewCondition,
  createNewBlock,
  deleteBlock,
  createNewField,
  deleteField,
  deleteCondition,
  updateForm,
  createNewClientForm,
  deleteClientForm,
  getAllClientsForms,
  getSingleClientForms,
  getSingleClientFormDetails,
};

export default formService;
