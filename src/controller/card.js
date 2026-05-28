import { ValidateData } from "../service/validate.js"
import { EMessage, SMessage } from "../service/message.js"
import { SendError, SendCreate, SendSuccess } from "../service/response.js"
import prisma from "../config/prima.js";
import { FindOneCar, FindOneUser } from "../service/service.js";
import { UploadImageToCloud } from "../config/cloudinary.js";
import { ExcelBuilder, ReportColumns } from "../service/excelBuilder.js";
export default class CardController {
    static async getAllCard(req, res) {
        try {
            const { page = 1, limit = 10, search, startDate, endDate, } = req.query;
            const query = {};
            if (search) {
                query['OR'] = [
                    { customer_number: { contains: search } },
                    { card_number: { contains: search } },
                    { vip_number: { contains: search } },
                ];
            }

            if (startDate || endDate) {
                query['createdAt'] = {};
                if (startDate) query['createdAt']['gte'] = new Date(startDate);
                if (endDate) query['createdAt']['lt'] = new Date(endDate);
            }
            const card = await prisma.card.findMany({
                where: query,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                include: {
                    car: {
                        include: {
                            user: true,
                        }
                    },
                },
            });
            if (!card) return SendError(res, 404, EMessage.NotFound);
            const count = await prisma.card.count({ where: query });
            const totalPage = Math.ceil(count / limit);
            return SendSuccess(res, SMessage.SelectAll, { data: card, totalPage });
            // function getSearchQuery(columns, search) {
            //     const searchQuery = {};
            //     columns.forEach(column => {
            //         searchQuery[column] = { contains: search };
            //     });
            //     return searchQuery;
            // }
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectAll(req, res) {
        try {
            const data = await prisma.card.findMany(
                {
                    include: {
                        car: {
                            include: {
                                user: true,
                            }
                        },
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
            const card_id = req.params.card_id;

            const data = await prisma.card.findFirst({ where: { card_id: card_id }, include: { car: { include: { user: true } } } });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectOne, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Insert(req, res) {
        try {
            const {
                carId,
                card_number,
                vip_number,
                card_type,
                goldIssued,
                received,
                issued_date,
                expiration_date,
                countCard,
            } = req.body;
            const validate = await ValidateData({ carId, card_number, vip_number, card_type });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            const carData = await FindOneCar(carId);
            if (!carData) {
                return SendError(res, 404, EMessage.NotFound);
            }
            const data = await prisma.card.create({
                data: {
                    carId, card_number, vip_number, card_type, goldIssued, received, issued_date, expiration_date, countCard: parseInt(countCard), userId: carData.userId, createBy: req.employee
                }
            })
            return SendCreate(res, SMessage.Insert, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async UpdateCard(req, res) {
        try {
            const card_id = req.params.card_id;
            const {
                carId,
                card_number,
                vip_number,
                card_type,
                goldIssued,
                received,
                issued_date,
                expiration_date,
                countCard,
            } = req.body;
            const validate = await ValidateData({ carId, card_number, vip_number, card_type });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            const carData = await FindOneCar(carId);
            if (!carData) {
                return SendError(res, 404, EMessage.NotFound);
            }
            const data = await prisma.card.update({
                data: {
                    carId, card_number, vip_number, card_type, goldIssued, received, issued_date, expiration_date, countCard: parseInt(countCard), userId: carData.userId, createBy: req.employee
                },
                where: {
                    card_id: card_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }

    static async DeleteCard(req, res) {
        try {
            const card_id = req.params.card_id;
            const data = await prisma.card.delete({ where: { card_id: card_id } })
            await prisma.giftHistory.deleteMany({ where: { card_id: id, } });
            await prisma.card.delete({ where: { card_id: id, } });
            if (!data) return SendError(res, 404, EMessage.EDelete);
            return SendSuccess(res, SMessage.Delete, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }


    static async ExportCard(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const query = {};
            if (startDate || endDate) {
                query['createdAt'] = {};
                if (startDate) query['createdAt']['gte'] = new Date(startDate);
                if (endDate) query['createdAt']['lt'] = new Date(endDate);
            }
            const data = await prisma.card.findMany({
                where: query,
                include: {
                    car: {
                        include: {
                            user: true,
                        }
                    },
                },

            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            const exportData = data.map(item => ({
                cardNumber: item.card_number,
                customerNumber: item?.car?.user?.customer_number,
                vipNumber: item.vip_number,
                cardType: item.card_type,
                goldIssued: item.goldIssued,
                received: item.received,
                issuedDate: item.issued_date,
                expirationDate: item.expiration_date,
            }));
            // เรียกใช้ ExcelBuilder
            return await ExcelBuilder.export(res, {
                sheetName: "Card Report",
                columns: ReportColumns.card,
                data: exportData,
                fileName: "card-report.xlsx",
            })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}