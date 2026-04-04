import { ValidateData } from "../service/validate.js"
import { EMessage, SMessage } from "../service/message.js"
import { SendError, SendCreate, SendSuccess } from "../service/response.js"
import prisma from "../config/prima.js";
import { UploadImageToCloud } from "../config/cloudinary.js";
import { ExcelBuilder, ReportColumns } from "../service/excelBuilder.js";
export default class TimeController {
    // static async SearchTime(req, res) {
    //     try {
    //         const search = req.query.search;

    //         const data = await prisma.time.findMany({
    //             where: {
    //                 date: {
    //                     contains: search
    //                 },
    //             }
    //         });
    //         if (!data) {
    //             return SendError(res, 404, EMessage.NotFound);
    //         }
    //         return SendSuccess(res, SMessage.Search, data);
    //     } catch (error) {
    //         return SendError(res, 500, EMessage.ServerInternal, error);
    //     }
    // }
    static async GetAllTime(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                startDate,  //new
                endDate,  //new
                search,
            } = req.query;
            const query = {};

            if (search)
                query['OR'] = [
                    { time: { contains: search } },

                ];

            if (startDate || endDate) {
                query['createdAt'] = {};
                if (startDate) query['createdAt']['gte'] = new Date(startDate);
                if (endDate) query['createdAt']['lt'] = new Date(endDate);
            }

            const time = await prisma.time.findMany({
                where: query,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                include: {
                    zone: true,
                    // branch: true 
                }
            });
            if (!time) return SendError(res, 404, EMessage.NotFound);
            const count = await prisma.time.count({ where: query });
            const totalPage = Math.ceil(count / parseInt(limit));
            return SendSuccess(res, SMessage.SelectAll, { data: time, totalPage })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectAll(req, res) {
        try {
            const data = await prisma.time.findMany({
                where: { timeStatus: true },
                include: {
                    zone: true,
                    // branch: true
                }
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectAll, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectOne(req, res) {
        try {
            const time_id = req.params.time_id;

            const data = await prisma.time.findFirst({
                where: { time_id: time_id },
                include: {
                    zone: true,
                    // branch: true
                }
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectOne, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectBy(req, res) {
        try {
            const zoneId = req.params.zoneId
            const data = await prisma.time.findMany({
                where: { zoneId }, include: {
                    zone: true,
                    // branch: true
                }
            },);
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectBy, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectByBranch(req, res) {
        try {
            const branchId = req.params.branchIdId
            const data = await prisma.timeFix.findMany({   // change time to timeFix
                where: { branchId: branchId },
                include: {
                    zone: true,
                    branch: true,
                    time: true            // new
                }
            },);
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectBy, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Insert(req, res) {
        try {
            const { time, qty,date } = req.body;
            const validate = await ValidateData({ time, qty });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }

            const data = await prisma.time.create({
                data: {
                    time, date, qty: parseInt(qty), createBy: req.user
                }
            })
            return SendCreate(res, SMessage.Insert, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async UpdateQty(req, res) {
        try {
            const time_id = req.params.time_id;

            const { qty } = req.body;
            const validate = await ValidateData({ qty });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }

            const data = await prisma.time.update({
                data: {
                    qty: parseInt(qty), createBy: req.employee
                },
                where: {
                    time_id: time_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdateTime(req, res) {
        try {
            const time_id = req.params.time_id;

            const { time, qty } = req.body;
            const validate = await ValidateData({ time, qty });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }

            const data = await prisma.time.update({
                data: {
                    time, qty,  createBy: req.employee
                },
                where: {
                    time_id: time_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdateTimeStatus(req, res) {
        try {
            const time_id = req.params.time_id;
            const { timeStatus } = req.body;
            const validate = await ValidateData({ timeStatus });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            const timeStatusBoolean = String(timeStatus).toLowerCase() === "true";
            const data = await prisma.time.update({
                data: {
                    timeStatus: timeStatusBoolean, createBy: req.employee
                },
                where: {
                    time_id: time_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update, data)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async DeleteTime(req, res) {
        try {
            const time_id = req.params.time_id;
            console.log(time_id);
            const data = await prisma.time.delete({ where: { time_id: time_id } })
            if (!data) return SendError(res, 404, EMessage.EDelete);
            return SendSuccess(res, SMessage.Delete)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async ExportTime(req, res) {
        try {
            const { start, endDate } = req.query;
            const query = {};
            if (startDate || endDate) {
                query['createdAt'] = {};
                if (startDate) query['createdAt']['gte'] = new Date(startDate);
                if (endDate) query['createdAt']['lt'] = new Date(endDate);
            }
            const data = await prisma.time.findMany({
                where: query,

            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            const exportData = data.map(item => ({
                Time: item.time,
                Qty: item.qty,
                TimeStatus: item.timeStatus
            }));
            // เรียกใช้ ExcelBuilder
            return await ExcelBuilder.export(res, {
                sheetName: "Time Report",
                columns: ReportColumns.time,
                data: exportData,
                fileName: "time-report.xlsx",
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}