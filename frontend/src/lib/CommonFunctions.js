import { toast } from "react-toastify"

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