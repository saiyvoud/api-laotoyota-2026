import { ValidateData } from "../service/validate.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendError, SendCreate, SendSuccess } from "../service/response.js";
import prisma from "../config/prima.js";
import shortid from "shortid";

export default class TransactionController {

    static async getAllAdmin(req, res) {
        try {
            const { page = 1, limit = 10, search, startDate, endDate } = req.query;
            const query = {};
            if (search)
                query['OR'] = [
                    { code: { contains: search } },
                    { card: { card_number: { contains: search } } },
                    { card: { user: { username: { contains: search } } } },
                    { store: { name: { contains: search } } },
                ];
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.gte = new Date(startDate);
                if (endDate) {
                    const nextDay = new Date(endDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    query.createdAt.lt = nextDay;
                }
            }
            const data = await prisma.transaction.findMany({
                where: query,
                orderBy: { createdAt: 'desc' },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                include: { card: { include: { user: true } }, store: true },
            });
            const count = await prisma.transaction.count({ where: query });
            const totalPage = Math.ceil(count / parseInt(limit));
            return SendSuccess(res, SMessage.SelectAll, { data, totalPage, count });
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async SelectAll(req, res) {
        try {
            const data = await prisma.transaction.findMany({
                include: { card: { include: { user: true } }, store: true },
                orderBy: { createdAt: 'desc' },
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectAll, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async SelectOne(req, res) {
        try {
            const transaction_id = req.params.transaction_id;
            const data = await prisma.transaction.findFirst({
                where: { transaction_id },
                include: { card: { include: { user: true } }, store: true },
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectOne, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    // ດຶງ transaction ຂອງ Card ຂອງ user ທີ່ login
    static async SelectByUser(req, res) {
        try {
            const userId = req.user;
            const card = await prisma.card.findFirst({ where: { userId } });
            if (!card) return SendError(res, 404, "ທ່ານບໍ່ມີ Card Toyota");
            const data = await prisma.transaction.findMany({
                where: { cardId: card.card_id },
                include: { store: true },
                orderBy: { createdAt: 'desc' },
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectBy, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    // ລູກຄ້າ scan QR Code ຂອງຮ້ານ → ສ້າງ Transaction
    static async Insert(req, res) {
        try {
            const userId = req.user; // ມາຈາກ token
            const { storeId } = req.body;
            const validate = await ValidateData({ storeId });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }

            // ກວດວ່າ user ມີ Card Toyota ຫຼືບໍ່
            const card = await prisma.card.findFirst({ where: { userId } });
            if (!card) return SendError(res, 403, "ທ່ານບໍ່ມີ Card Toyota — ບໍ່ສາມາດໃຊ້ສ່ວນຫຼຸດໄດ້");
            if (!card.status) return SendError(res, 403, "Card ຂອງທ່ານຖືກລະງັບ — ບໍ່ສາມາດໃຊ້ສ່ວນຫຼຸດໄດ້");

            const store = await prisma.store.findFirst({ where: { store_id: storeId } });
            if (!store) return SendError(res, 404, EMessage.NotFound);
            if (!store.status) return SendError(res, 400, "ຮ້ານນີ້ຖືກປິດໃຊ້ງານ");

            // ກວດ 1 ຄັ້ງ/ວັນ/ຮ້ານ (ທາງເລືອກ B)
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            const usedToday = await prisma.transaction.findFirst({
                where: {
                    cardId: card.card_id,
                    storeId,
                    createdAt: { gte: todayStart, lte: todayEnd },
                },
            });
            if (usedToday) return SendError(res, 400, `ທ່ານໃຊ້ສ່ວນຫຼຸດຮ້ານ "${store.name}" ແລ້ວວັນນີ້ — ສາມາດໃຊ້ໃໝ່ໄດ້ພຸ້ງນີ້`);

            // ດຶງ discount ຈາກ qrCode ທີ່ admin ຕັ້ງໄວ້ — ບໍ່ເຊື່ອຄ່າຈາກ mobile
            const discount = store.qrCode ? (JSON.parse(store.qrCode)?.discount ?? 0) : 0;

            const code = "TXN_" + shortid.generate();

            const data = await prisma.transaction.create({
                data: {
                    code,
                    cardId: card.card_id,
                    storeId,
                    discount,
                },
                include: { card: { include: { user: true } }, store: true },
            });
            return SendCreate(res, SMessage.Insert, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async DeleteTransaction(req, res) {
        try {
            const transaction_id = req.params.transaction_id;
            const data = await prisma.transaction.delete({ where: { transaction_id } });
            if (!data) return SendError(res, 404, EMessage.EDelete);
            return SendSuccess(res, SMessage.Delete, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}
