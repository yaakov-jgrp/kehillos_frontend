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

export const fetchFullformDataHandler = async (setIsLoading, setFullFormData, setDisplayFormValues, setDisplayFields) => {
    setIsLoading(true);
    const res = await clientsService.getFullformData();
    setFullFormData(res.data.result)
    if (setDisplayFields && setDisplayFormValues) {
        let displayfields = [];
        res.data.result.forEach((block) => {
            const data = block?.field
            data.forEach((item) => {
                displayfields.push(item)
            })
        });
        // Array of objects
        const arr = displayfields.map((item) => {
            return {
                [item.field_slug]: item.display
            }
        });

        // Combine all objects into a single object
        const result = arr.reduce((acc, curr) => Object.assign(acc, curr), {});
        setDisplayFormValues(result);
        setDisplayFields(displayfields);
    }
    setTimeout(() => {
        setIsLoading(false);
    }, 500)
};