import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function handleAxiosError(error: unknown, defaultMessage: string) {
    if (error instanceof AxiosError) {
        if (error.status === 429) {
            toast.warn(error.response?.data);
        } else {
            toast.error(error.response?.data?.error || defaultMessage);
        }
    } else {
        toast.error(defaultMessage);
    }
}
