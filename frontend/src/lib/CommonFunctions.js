import { toast } from "react-toastify"

export const errorsToastHandler = (errors) => {
    for (const err of errors) {
        for (const errMessage in err) {
            toast.error(err[errMessage]);
        }
    }
}