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
            id: 1,
            name: "Personal Information",
            isRepeatable: true,
            fields: [
              {
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
            ],
          },

          {
            id: 2,
            name: "More Information",
            isRepeatable: false,
            fields: [
              {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
            id: 1,
            name: "Personal Information",
            isRepeatable: false,
            fields: [
              {
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
            ],
          },

          {
            id: 2,
            name: "More Information",
            isRepeatable: false,
            fields: [
              {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
          },
        ],
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 3,
        isPined: false,
        name: "Form 3",
        description: "Test",
        blocks: [
          {
            id: 1,
            name: "Personal Information",
            isRepeatable: false,
            fields: [
              {
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
            ],
          },

          {
            id: 2,
            name: "More Information",
            isRepeatable: false,
            fields: [
              {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
          },
        ],
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 4,
        isPined: false,
        name: "Form 4",
        description: "Test",
        blocks: [
          {
            id: 1,
            name: "Personal Information",
            isRepeatable: false,
            fields: [
              {
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
            ],
          },

          {
            id: 2,
            name: "More Information",
            isRepeatable: false,
            fields: [
              {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
          },
        ],
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 5,
        isPined: false,
        name: "Form 5",
        description: "Test",
        blocks: [
          {
            id: 1,
            name: "Personal Information",
            isRepeatable: false,
            fields: [
              {
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
            ],
          },

          {
            id: 2,
            name: "More Information",
            isRepeatable: false,
            fields: [
              {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
          },
        ],
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 6,
        isPined: false,
        name: "Form 6",
        description: "Test",
        blocks: [
          {
            id: 1,
            name: "Personal Information",
            isRepeatable: false,
            fields: [
              {
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
            ],
          },

          {
            id: 2,
            name: "More Information",
            isRepeatable: false,
            fields: [
              {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
    count: 6,
  };
  return new Promise((resolve, reject) => {
    resolve(forms);
  });
};

const formService = {
  getAllForms,
};

export default formService;
