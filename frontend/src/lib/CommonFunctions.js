import { toast } from "react-toastify"
import clientsService from "../services/clients";

export const errorsToastHandler = (errors) => {
    if (typeof errors === "object") {
        for (const err of errors) {
            for (const errMessage in err) {
                toast.error(err[errMessage]);
            }
        }
    } else {
        toast.error(errors);
    }

}

export const fetchFullformDataHandler = async (setIsLoading, setFullFormData) => {
    setIsLoading(true);
    const res = await clientsService.getFullformData();
    setFullFormData(res.data.result)
    setTimeout(() => {
        setIsLoading(false);
    }, 500)
};

export const formateDateTime = (dateTime) => {
    const date = new Date(dateTime).toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' });
    let hours = new Date(dateTime).getUTCHours();
    const minutes = new Date(dateTime).getUTCMinutes();
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    return { date, time }
}