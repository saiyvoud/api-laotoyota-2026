import { ValidateData } from "../service/validate.js"
import { EMessage, SMessage } from "../service/message.js"
import { SendError, SendCreate, SendSuccess } from "../service/response.js"
import prisma from "../config/prima.js";
import { FindOneUser, FindOneGiftCard, FindOneGiftHistory, FindOneCard } from "../service/service.js";
import { ExcelBuilder, ReportColumns } from "../service/excelBuilder.js";

export default class GiftHistoryController {
    static async getAllGiftHistory(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                startDate,
                endDate,
                status,
            } = req.query;
            const query = {};
            if (search)
                query['OR'] = [
                    { user: { username: { contains: search } } },
                    { giftcard: { name: { contains: search } } },
                ];


            if (startDate || endDate) {
                query.createdAt = {};

                if (startDate) {
                    query.createdAt.gte = new Date(startDate);
                }

                if (endDate) {
                    const nextDay = new Date(endDate);
                    nextDay.setDate(nextDay.getDate() + 1);

                    query.createdAt.lt = nextDay;
                }
            }

            // 3. Status Filter
            if (status) {
                query['status'] = status;
            }

            const giftHistory = await prisma.giftHistory.findMany({
                where: query,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                include: {
                    user: true,
                    giftcard: true
                }
            });
            if (!giftHistory) return SendError(res, 404, EMessage.NotFound);
            const count = await prisma.giftHistory.count({ where: query });
            const totalPage = Math.ceil(count / limit);
            return SendSuccess(res, SMessage.SelectAll, { data: giftHistory, totalPage , count });
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectAll(req, res) {
        try {

            const data = await prisma.giftHistory.findMany({
                include: {
                    user: true,
                    giftcard: true
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
            const gifthistory_id = req.params.gifthistory_id;

            const data = await prisma.giftHistory.findFirst(
                {
                    include: {
                        user: true,
                        giftcard: true
                    },
                    where: { gifthistory_id: gifthistory_id }
                });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectOne, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectByUser(req, res) {
        try {
            const user_id = req.user; // ມາຈາກ token 
            const data = await prisma.giftHistory.findMany({
                where: { userId: user_id },
                include: {
                    user: true,
                    giftcard: true,
                    card: true
                }
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectBy, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Insert(req, res) {
        try {
            const { giftcardId, cardId, amount } = req.body;
            const validate = await ValidateData({ giftcardId, cardId, amount });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            // const user = await FindOneUser(userId);
            const giftcardData = await FindOneGiftCard(giftcardId);
            const cardData = await FindOneCard(cardId);
            const userData = await FindOneUser(cardData.userId);

            // ຕັດສະ stock
            const pointTotal = giftcardData.gift_Point * parseInt(amount)
            if (cardData.total_point < pointTotal) {
                return SendError(res, 400, "Point Not Enough")
            }

            const data = await prisma.giftHistory.create({
                data: {
                    userId: userData?.user_id,
                    giftcardId: giftcardId,
                    cardId: cardId,
                    card_number: cardData.card_number,
                    gift_Code: giftcardData.gift_Code,
                    amount: parseInt(amount),
                    total: parseInt(pointTotal),
                    claimed_date: new Date(),
                    createBy: req.employee_id
                }
            })
            return SendCreate(res, SMessage.Insert, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async Confirm(req, res) {
        try {
            const { gifthistory_id } = req.params;

            const giftHistoryData = await FindOneGiftHistory(gifthistory_id);
            if (!giftHistoryData) return SendError(res, 404, EMessage.NotFound);

            const cardData = await FindOneCard(giftHistoryData.cardId);
            if (!cardData) return SendError(res, 404, EMessage.NotFound);

            if (cardData.total_point < giftHistoryData.total) {
                return SendError(res, 400, "Point Not Enough")
            }
            const pointAll = cardData.total_point - giftHistoryData.total;

            const update = await prisma.card.update({
                data: {
                    total_point: parseInt(pointAll)
                },
                where: { card_id: giftHistoryData.cardId }
            })
            if (!update) {
                return SendError(res, 400, "Error Update Point")
            }
            // ตัดคะแนนไปแล้วตอน Insert → แค่เปลี่ยน received = true
            const data = await prisma.giftHistory.update({
                where: { gifthistory_id },
                data: { status: "received" }
            });
            return SendSuccess(res, SMessage.Update, data)

        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async Cancel(req, res) {
        try {
            const { gifthistory_id } = req.params;
            const data = await prisma.giftHistory.update({
                where: { gifthistory_id },
                data: { status: "cancel", }
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.Update, data)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async ReturnPointGifthistory(req, res) {
        try {
            const gifthistory_id = req.params.gifthistory_id;
            const history = await prisma.giftHistory.findUnique({ where: { gifthistory_id: gifthistory_id } })
            const card = await prisma.card.findUnique({
                where: {
                    card_id: history.cardId
                }
            });
            const check = await prisma.card.update({
                data: {
                    total_point: card.total_point + history.total
                }, where: {
                    card_id: history.cardId
                }
            })
            if (!check) {
                return SendError(res, 400, EMessage.NotFound);
            }
            const data = await prisma.giftHistory.delete({ where: { gifthistory_id: gifthistory_id } })
            if (!data) return SendError(res, 404, EMessage.EDelete);
            return SendSuccess(res, SMessage.Delete, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async ExportGiftHistory(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const query = {};
            if (startDate || endDate) {
                query.createdAt = {};

                if (startDate) {
                    query.createdAt.gte = new Date(startDate);
                }

                if (endDate) {
                    const nextDay = new Date(endDate);
                    nextDay.setDate(nextDay.getDate() + 1);

                    query.createdAt.lt = nextDay;
                }
            }
            const data = await prisma.giftHistory.findMany({ where: query });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            const exportData = data.map(item => ({
                CustomerName: item.card.user.username,
                giftCard: item.giftcard.name,
                amount: item.amount,
            }));
            // เรียกใช้ ExcelBuilder
            return await ExcelBuilder.export(res, {
                sheetName: "GiftHistory Report",
                columns: ReportColumns.giftHistory,
                data: exportData,
                fileName: "giftHistory-report.xlsx",
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}