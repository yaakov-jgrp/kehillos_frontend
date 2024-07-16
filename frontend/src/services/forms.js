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
            isRepeatable: false,
            fields: [
              {
                id: 1,
                name: "Name",
                dataType: "text",
                defaultValue: "Abdul Raffay",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "Email",
                dataType: "email",
                defaultValue: "abc@gmail.com",
                isMandatory: true,
                isUnique: true,
              },
              {
                id: 3,
                name: "Age",
                dataType: "number",
                defaultValue: 22,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Contact No.",
                dataType: "phone",
                defaultValue: "+923154478526",
                isMandatory: true,
                isUnique: true,
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
                dataType: "date",
                defaultValue: "2024-07-07T13:21:06.408+00:00",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "City",
                dataType: "select",
                defaultValue: [
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
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 3,
                name: "Single",
                dataType: "checkbox",
                defaultValue: false,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Marksheet",
                dataType: "file",
                defaultValue: "https://www.marksheet.com",
                isMandatory: true,
                isUnique: false,
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
                dataType: "text",
                defaultValue: "Abdul Raffay",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "Email",
                dataType: "email",
                defaultValue: "abc@gmail.com",
                isMandatory: true,
                isUnique: true,
              },
              {
                id: 3,
                name: "Age",
                dataType: "number",
                defaultValue: 22,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Contact No.",
                dataType: "phone",
                defaultValue: "+923154478526",
                isMandatory: true,
                isUnique: true,
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
                dataType: "date",
                defaultValue: "2024-07-07T13:21:06.408+00:00",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "City",
                dataType: "select",
                defaultValue: [
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
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 3,
                name: "Single",
                dataType: "checkbox",
                defaultValue: false,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Marksheet",
                dataType: "file",
                defaultValue: "https://www.marksheet.com",
                isMandatory: true,
                isUnique: false,
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
                dataType: "text",
                defaultValue: "Abdul Raffay",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "Email",
                dataType: "email",
                defaultValue: "abc@gmail.com",
                isMandatory: true,
                isUnique: true,
              },
              {
                id: 3,
                name: "Age",
                dataType: "number",
                defaultValue: 22,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Contact No.",
                dataType: "phone",
                defaultValue: "+923154478526",
                isMandatory: true,
                isUnique: true,
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
                dataType: "date",
                defaultValue: "2024-07-07T13:21:06.408+00:00",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "City",
                dataType: "select",
                defaultValue: [
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
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 3,
                name: "Single",
                dataType: "checkbox",
                defaultValue: false,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Marksheet",
                dataType: "file",
                defaultValue: "https://www.marksheet.com",
                isMandatory: true,
                isUnique: false,
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
                dataType: "text",
                defaultValue: "Abdul Raffay",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "Email",
                dataType: "email",
                defaultValue: "abc@gmail.com",
                isMandatory: true,
                isUnique: true,
              },
              {
                id: 3,
                name: "Age",
                dataType: "number",
                defaultValue: 22,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Contact No.",
                dataType: "phone",
                defaultValue: "+923154478526",
                isMandatory: true,
                isUnique: true,
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
                dataType: "date",
                defaultValue: "2024-07-07T13:21:06.408+00:00",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "City",
                dataType: "select",
                defaultValue: [
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
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 3,
                name: "Single",
                dataType: "checkbox",
                defaultValue: false,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Marksheet",
                dataType: "file",
                defaultValue: "https://www.marksheet.com",
                isMandatory: true,
                isUnique: false,
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
                dataType: "text",
                defaultValue: "Abdul Raffay",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "Email",
                dataType: "email",
                defaultValue: "abc@gmail.com",
                isMandatory: true,
                isUnique: true,
              },
              {
                id: 3,
                name: "Age",
                dataType: "number",
                defaultValue: 22,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Contact No.",
                dataType: "phone",
                defaultValue: "+923154478526",
                isMandatory: true,
                isUnique: true,
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
                dataType: "date",
                defaultValue: "2024-07-07T13:21:06.408+00:00",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "City",
                dataType: "select",
                defaultValue: [
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
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 3,
                name: "Single",
                dataType: "checkbox",
                defaultValue: false,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Marksheet",
                dataType: "file",
                defaultValue: "https://www.marksheet.com",
                isMandatory: true,
                isUnique: false,
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
                dataType: "text",
                defaultValue: "Abdul Raffay",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "Email",
                dataType: "email",
                defaultValue: "abc@gmail.com",
                isMandatory: true,
                isUnique: true,
              },
              {
                id: 3,
                name: "Age",
                dataType: "number",
                defaultValue: 22,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Contact No.",
                dataType: "phone",
                defaultValue: "+923154478526",
                isMandatory: true,
                isUnique: true,
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
                dataType: "date",
                defaultValue: "2024-07-07T13:21:06.408+00:00",
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 2,
                name: "City",
                dataType: "select",
                defaultValue: [
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
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 3,
                name: "Single",
                dataType: "checkbox",
                defaultValue: false,
                isMandatory: true,
                isUnique: false,
              },
              {
                id: 4,
                name: "Marksheet",
                dataType: "file",
                defaultValue: "https://www.marksheet.com",
                isMandatory: true,
                isUnique: false,
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
