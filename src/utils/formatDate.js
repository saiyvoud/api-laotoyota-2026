import dayjs from "./days.js";
export const formatLaosTime = (obj) => {

    if (obj instanceof Date) {
        return dayjs(obj)
            .tz("Asia/Vientiane")
            .format("YYYY-MM-DD HH:mm:ss");
    }

    if (typeof obj === "string" && dayjs(obj).isValid()) {
        return dayjs(obj)
            .tz("Asia/Vientiane")
            .format("YYYY-MM-DD HH:mm:ss");
    }

    if (Array.isArray(obj)) {
        return obj.map(formatLaosTime);
    }

    if (obj && typeof obj === "object") {
        const result = {};

        for (const key in obj) {
            result[key] = formatLaosTime(obj[key]);
        }

        return result;
    }

    return obj;
};