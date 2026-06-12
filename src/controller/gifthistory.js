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
            } = req.query;
            const query = {};
            // if (search)
            //     query['OR'] = getSearchQuery(
            //         ['name'],
            //         search
            //     );
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
            return SendSuccess(res, SMessage.SelectAll, { data: giftHistory, totalPage });
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
            // const { userId, giftcardId, cardId, amount } = req.body;
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
            const pointAll = cardData.total_point - pointTotal;
            const update = await prisma.card.update({
                data: {
                    total_point: parseInt(pointAll)
                },
                where: { card_id: cardId }
            })
            if (!update) {
                return SendError(res, 400, "Error Update Point")
            }
            //--------

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
    static async UpdateGifthistory(req, res) {
        try {
            const gifthistory_id = req.params.gifthistory_id;
            // const { giftcardId, amount, } = req.body;
            const { amount } = req.body;
            const validate = await ValidateData({ amount });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            const gifthistoryData = await FindOneGiftHistory(gifthistory_id); // ສ້າງຢູ່ໃນ service
            // const user = await FindOneUser(gifthistoryData.userId);
            const card = await FindOneCard(gifthistoryData.cardId);
            const giftcardData = await FindOneGiftCard(gifthistoryData.giftcardId); // ສ້າງຢູ່ໃນ service
            // ຕັດສະ stock
            // const pointTotalUpdate = giftcardData.point * parseInt(amount)
            const pointTotalUpdate = giftcardData.gift_Point * parseInt(amount)
            //console.log("pointUpdate ====> ", pointTotalUpdate);
            // const pointTotalBefore = giftcardData.point * gifthistoryData.amount;
            const pointTotalBefore = giftcardData.gift_Point * gifthistoryData.amount;
            //console.log("pointBefore ====> ", pointTotalBefore);
            const points = pointTotalBefore + card.total_point;
            //console.log("points ====> ", points);
            if (points < pointTotalUpdate) {
                return SendError(res, 400, "Point Not Enough")
            }
            const pointAll = points - pointTotalUpdate;
            //console.log("pointAll ====> ", pointAll);
            const update = await prisma.card.update({
                data: {
                    total_point: parseInt(pointAll)
                },
                where: { card_id: gifthistoryData.cardId }
            })
            if (!update) {
                return SendError(res, 400, "Error Update Point")
            }
            const data = await prisma.giftHistory.update({
                data: {
                    giftcardId: gifthistoryData.giftcardId, amount: parseInt(amount)
                },
                where: {
                    gifthistory_id: gifthistory_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update, data)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }

    static async DeleteGifthistory(req, res) {
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