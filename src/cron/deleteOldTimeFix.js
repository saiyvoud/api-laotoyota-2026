import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
const prisma = new PrismaClient();

// ================= PARSE DATE =================

const parseDate = (date) => {
    if (!date) return null;
    // ISO DATE
    if (typeof date === "string" && date.includes("T")) {
        const parsed = new Date(date);
        return isNaN(parsed) ? null : parsed;
    }

    // YYYY-MM-DD
    if (typeof date === "string" && date.includes("-")) {
        const parts = date.split("-");
        // check format
        if (parts[0].length === 4) {
            const [year, month, day] = parts;
            const parsed = new Date(Number(year), Number(month) - 1, Number(day));
            return isNaN(parsed) ? null : parsed;
        }
    }

    // DD/MM/YYYY
    if (typeof date === "string" && date.includes("/")) {
        const [day, month, year] = date.split("/");
        const parsed = new Date(Number(year), Number(month) - 1, Number(day));
        return isNaN(parsed) ? null : parsed;
    }

    // fallback
    const fallback = new Date(date);
    return isNaN(fallback) ? null : fallback;
};

// ================= CRON =================
// PRODUCTION MODE
// "0 0 * * *", // every day at 00:00
// "*/10 * * * * *", // every day at 00:10
cron.schedule("0 0 * * *", async () => {
    try {
        // ================= TODAY =================
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // ================= GET ALL TIMES =================
        const allTimes = await prisma.timeFix.findMany();
        // ================= FILTER OLD TIMES =================
        const oldTimeIds = allTimes.filter((item) => {
            // skip empty date
            if (!item.date) { return false; }
            // parse date
            const itemDate = parseDate(item.date);
            // invalid date
            if (!itemDate) { return false }
            // reset time
            itemDate.setHours(0, 0, 0, 0);
            // compare
            const itemTime = itemDate.getTime();
            const todayTime = today.getTime();
            const isOld = itemTime < todayTime;
            return isOld;
        }).map((item) => item.timefix_id);
        // ================= DELETE TIMEFIX =================
        if (oldTimeIds.length > 0) {
            const deleted = await prisma.timeFix.deleteMany({
                where: {
                    timefix_id: { in: oldTimeIds }
                }
            });


        }
    } catch (error) {
        console.log("CRON ERROR:", error);
    }
}
);
