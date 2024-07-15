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
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 2,
        isPined: false,
        name: "Form 2",
        description: "Test",
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 3,
        isPined: false,
        name: "Form 3",
        description: "Test",
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 4,
        isPined: false,
        name: "Form 4",
        description: "Test",
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 5,
        isPined: false,
        name: "Form 5",
        description: "Test",
        createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
        lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
      },
      {
        id: 6,
        isPined: false,
        name: "Form 6",
        description: "Test",
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
