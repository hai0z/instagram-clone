import { formatDistance } from "date-fns";
import vi from "date-fns/locale/vi";
export default function formatDate(seconds) {
    let formattedDate = "";

    if (seconds) {
        formattedDate = formatDistance(new Date(seconds * 1000), new Date(), {
            locale: vi,
        });

        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
}
