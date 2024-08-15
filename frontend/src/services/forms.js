import { formatDate } from "../utils/helpers";
import api from "./api";

const getAllForms = (params) => {
  //   return api.get(`/api/forms/${params}`);

  // simulating the get all forms API
  const forms = {
    success: true,
    data: [
      {
        id: 1,
        isPined: true,
        name: "Form 1",
        description: "Test",
        blocks: [
          {
            formId: 1,
            id: 1,
            name: "Personal Information",
            isRepeatable: true,
          },

          {
            formId: 1,
            id: 2,
            name: "More Information",
            isRepeatable: false,
          },
        ],
        fields: [
          {
            blockId: 1,
            id: 1,
            name: "Name",
            data_type: {
              label: "text",
              value: "text",
            },
            enum_values: {},
            defaultvalue: "Abdul Raffay",
            required: true,
            unique: false,
          },
          {
            blockId: 1,
            id: 2,
            name: "Email",
            data_type: {
              label: "email",
              value: "email",
            },
            enum_values: {},
            defaultvalue: "abc@gmail.com",
            required: true,
            unique: true,
          },
          {
            blockId: 1,
            id: 3,
            name: "Age",
            data_type: {
              label: "number",
              value: "number",
            },
            enum_values: {},
            defaultvalue: 22,
            required: true,
            unique: false,
          },
          {
            blockId: 1,
            id: 4,
            name: "Contact No.",
            data_type: {
              label: "phone",
              value: "phone",
            },
            enum_values: {},
            defaultvalue: "+923154478526",
            required: true,
            unique: true,
          },
          {
            blockId: 2,
            id: 5,
            name: "DoB",
            data_type: {
              label: "date",
              value: "date",
            },
            enum_values: {},
            defaultvalue: "2024-07-07T13:21:06.408+00:00",
            required: true,
            unique: false,
          },
          {
            blockId: 2,
            id: 6,
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
                  id: 1,
                  label: "Brooklyn",
                  value: "brooklyn",
                },
              ],
            },
            defaultvalue: "brooklyn",
            required: true,
            unique: false,
          },
          {
            blockId: 2,
            id: 7,
            name: "Single",
            data_type: {
              label: "checkbox",
              value: "checkbox",
            },
            enum_values: {},
            defaultvalue: false,
            required: true,
            unique: false,
          },
          {
            blockId: 2,
            id: 8,
            name: "Marksheet",
            data_type: {
              label: "file",
              value: "file",
            },
            enum_values: {},
            defaultvalue: "",
            required: true,
            unique: false,
          },
        ],
        conditions: [
          {
            fieldId: 2,
            id: 1,
            field: "Name",
            condition: "equals",
            value: "Abc",
            operator: "AND",
          },
        ],
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 2,
        isPined: false,
        name: "Form 2",
        description: "Test",
        blocks: [
          {
            formId: 2,
            id: 3,
            name: "Personal Information",
            isRepeatable: true,
          },

          {
            formId: 2,
            id: 4,
            name: "More Information",
            isRepeatable: false,
          },
        ],
        fields: [
          {
            blockId: 3,
            id: 9,
            name: "Name",
            data_type: {
              label: "text",
              value: "text",
            },
            enum_values: {},
            defaultvalue: "Abdul Raffay",
            required: true,
            unique: false,
          },
          {
            blockId: 3,
            id: 10,
            name: "Email",
            data_type: {
              label: "email",
              value: "email",
            },
            enum_values: {},
            defaultvalue: "abc@gmail.com",
            required: true,
            unique: true,
          },
          {
            blockId: 3,
            id: 11,
            name: "Age",
            data_type: {
              label: "number",
              value: "number",
            },
            enum_values: {},
            defaultvalue: 22,
            required: true,
            unique: false,
          },
          {
            blockId: 3,
            id: 12,
            name: "Contact No.",
            data_type: {
              label: "phone",
              value: "phone",
            },
            enum_values: {},
            defaultvalue: "+923154478526",
            required: true,
            unique: true,
          },
          {
            blockId: 4,
            id: 13,
            name: "DoB",
            data_type: {
              label: "date",
              value: "date",
            },
            enum_values: {},
            defaultvalue: "2024-07-07T13:21:06.408+00:00",
            required: true,
            unique: false,
          },
          {
            blockId: 4,
            id: 14,
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
                  id: 1,
                  label: "Brooklyn",
                  value: "brooklyn",
                },
              ],
            },
            defaultvalue: "brooklyn",
            required: true,
            unique: false,
          },
          {
            blockId: 4,
            id: 15,
            name: "Single",
            data_type: {
              label: "checkbox",
              value: "checkbox",
            },
            enum_values: {},
            defaultvalue: false,
            required: true,
            unique: false,
          },
          {
            blockId: 4,
            id: 16,
            name: "Marksheet",
            data_type: {
              label: "file",
              value: "file",
            },
            enum_values: {},
            defaultvalue: "",
            required: true,
            unique: false,
          },
        ],
        conditions: [
          {
            fieldId: 9,
            id: 2,
            field: "Name",
            condition: "equals",
            value: "Abc",
            operator: "AND",
          },
        ],
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
    ],
    page: 1,
    num_pages: 1,
    next: null,
    previous: null,
    count: 2,
  };
  return new Promise((resolve, reject) => {
    resolve(forms);
  });
};

const getAllClientsForms = (params) => {
  const clientForms = {
    success: true,
    data: [
      {
        id: 1,
        name: "Form 1",
        clientId: 1,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 2,
        name: "Form 2",
        clientId: 2,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 3,
        name: "Form 3",
        clientId: 3,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 4,
        name: "Form 4",
        clientId: 4,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
    ],
    page: 1,
    num_pages: 1,
    next: null,
    previous: null,
    count: 2,
  };
  return new Promise((resolve, reject) => {
    resolve(clientForms);
  });
};

const getSingleClientForms = (clientId) => {
  const clientForms = {
    success: true,
    data: [
      {
        id: 1,
        name: "Form 1",
        clientId: 1,
        isPined: true,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 2,
        name: "Form 2",
        clientId: 1,
        isPined: false,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 3,
        name: "Form 3",
        clientId: 1,
        isPined: false,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 4,
        name: "Form 4",
        clientId: 1,
        isPined: false,
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
    ],
    page: 1,
    num_pages: 1,
    next: null,
    previous: null,
    count: 2,
  };
  return new Promise((resolve, reject) => {
    resolve(clientForms);
  });
};

const getSingleClientFormDetails = (formId) => {
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
                id: 2, // Updated the id for the second choice to be unique
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
          isCurrent: false,
          name: "Version 1",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Risus eu natoque urna curabitur. Proin lobortis at gravida et. ",
          createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
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
          isCurrent: false,
          name: "Version 2",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Risus eu natoque urna curabitur. Proin lobortis at gravida et. ",
          createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
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
          isCurrent: true,
          name: "Version 3",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Risus eu natoque urna curabitur. Proin lobortis at gravida et. ",
          createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
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
  getAllForms,
  getAllClientsForms,
  getSingleClientForms,
  getSingleClientFormDetails,
};

export default formService;
