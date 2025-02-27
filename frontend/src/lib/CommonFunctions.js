// Third part Imports
import { toast } from "react-toastify";

// API services
import clientsService from "../services/clients";
import requestService from "../services/request";

export const errorsToastHandler = (errors) => {
  if (typeof errors === "object") {
    for (const err in errors) {
      toast.error(errors[err]);
    }
  } else {
    toast.error(errors);
  }
};

export const fetchFullformDataHandler = async (
  setIsLoading,
  setFullFormData
) => {
  setIsLoading(true);
  const params = `&clients=True`;
  const res = await clientsService.getFullformData(params);
  setFullFormData(res.data.result);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);
};

export const fetchFormDataByBlockIdHandler = async (
  setIsLoading,
  setBlockFormData,
  params
) => {
  setIsLoading(true);
  const res = await clientsService.getFormDataByBlockId(params);
  setBlockFormData(res.data.result);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);
};

export const fetchActiveformDataHandler = async (setIsLoading) => {
  setIsLoading(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);
};

export const formateDateTime = (dateTime) => {
  const date = new Date(dateTime).toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  let hours = new Date(dateTime).getUTCHours();
  const minutes = new Date(dateTime).getUTCMinutes();
  const time = `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
  return { date, time };
};

export const handleSort = (
  field,
  data,
  sortField,
  sortOrder,
  setSortOrder,
  setSortField,
  setData,
  type
) => {
  if (field === sortField) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
  const sortedData = data.sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];
    switch (type) {
      case "select":
        valueA = valueA?.value || valueA;
        valueB = valueB?.value || valueB;
        break;
      case "checkbox":
        valueA = valueA?.toString() || valueA;
        valueB = valueB?.toString() || valueB;
        break;
      case "file":
        valueA = valueA?.file_name || valueA;
        valueB = valueB?.file_name || valueB;
        break;
      default:
        break;
    }


    if (typeof valueA === "object" && valueA !== null) {
      let vA, vB;
      if (valueA.number) {
        // Handle phone fields
        vA = valueA.number;
        vB = valueB.number;
      } else if (valueA.value) {
        // Handle fields with value property
        vA = valueA.value;
        vB = valueB.value;
      } else {
        // For other objects, show first non-null value or empty string
        vA = Object.values(valueA).find((v) => v !== null) || "";
        vB = Object.values(valueB).find((v) => v !== null) || "";
      }
      
      if (typeof vA === "number" && typeof vB === "number") {
        return sortOrder === "asc" ? vA - vB : vB - vA;
      } else if (typeof vA === "string" && typeof vB === "string") {
        const cmp = vA.localeCompare(vB);
        return sortOrder === "asc" ? cmp : -cmp;
      } else {
        return 0;
      }
    }
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      const comparison = valueA.localeCompare(valueB);
      return sortOrder === "asc" ? comparison : -comparison;
    } else {
      return 0;
    }
  });
  setData(sortedData);
};

export const handleNumberkeyPress = (e) => {
  if (!/^\d*$/.test(e.key) && e.key !== "Backspace") {
    e.preventDefault();
  }
};

export const deleteNetfreeStatus = async (id, onDelete) => {
  try {
    const res = await requestService.deleteCategoryStatus(id);
    onDelete();
  } catch (error) {
    console.log(error);
  }
};
