import { ValidateData } from "../service/validate.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendError, SendCreate, SendSuccess } from "../service/response.js";
import prisma from "../config/prima.js";
import { UploadImageToCloud } from "../config/cloudinary.js";

export default class StoreController {
    static async getAllAdmin(req, res) {
        try {
            const { page = 1, limit = 10, search, startDate, endDate } = req.query;
            const query = {};
            if (search)
                query['OR'] = [
                    { name: { contains: search } },
                    { address: { contains: search } },
                    { phone: { contains: search } },
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
            const store = await prisma.store.findMany({
                where: query,
                orderBy: { createdAt: 'desc' },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
            });
            if (!store) return SendError(res, 404, EMessage.NotFound);
            const count = await prisma.store.count({ where: query });
            const totalPage = Math.ceil(count / parseInt(limit));
            return SendSuccess(res, SMessage.SelectAll, { data: store, totalPage, count });
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async SelectAll(req, res) {
        try {
            const data = await prisma.store.findMany();
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectAll, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async SelectOne(req, res) {
        try {
            const store_id = req.params.store_id;
            const data = await prisma.store.findFirst({ where: { store_id } });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectOne, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async Insert(req, res) {
        try {
            const { name, address, phone, discount = 0, status } = req.body;
            const validate = await ValidateData({ name, address, phone });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            if (!req.files || !req.files.image) {
                return SendError(res, 400, EMessage.BadRequest, "Image is required");
            }
            const img_url = await UploadImageToCloud(req.files.image.data, req.files.image.mimetype);
            if (!img_url) return SendError(res, 404, EMessage.EUpload);

            // ສ້າງ store ກ່ອນ ເພື່ອໄດ້ store_id
            const store = await prisma.store.create({
                data: {
                    name,
                    address,
                    phone,
                    image: img_url,
                    qrCode: '', 
                    status: status === 'true' || status === true,
                }
            });

            // auto generate qrCode ຈາກ store_id ທີ່ໄດ້
            const qrCode = JSON.stringify({
                storeId: store.store_id,
                discount: parseInt(discount),
            });

            // update qrCode ກັບຄືນ
            const data = await prisma.store.update({
                where: { store_id: store.store_id },
                data: { qrCode },
            });

            return SendCreate(res, SMessage.Insert, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async UpdateStore(req, res) {
        try {
            const store_id = req.params.store_id;
            const { name, address, phone, discount, status } = req.body;
            const validate = await ValidateData({ name, address, phone });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            let img_url = null;
            if (req.files && req.files.image) {
                img_url = await UploadImageToCloud(req.files.image.data, req.files.image.mimetype);
                if (!img_url) return SendError(res, 404, EMessage.EUpload);
            }

            // regenerate qrCode ຖ້າ discount ປ່ຽນ
            const newQrCode = JSON.stringify({
                storeId: store_id,
                discount: parseInt(discount || 0),
            });

            const data = await prisma.store.update({
                where: { store_id },
                data: {
                    name,
                    address,
                    phone,
                    qrCode: newQrCode,
                    status: status === 'true' || status === true,
                    ...(img_url && { image: img_url }),
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async UpdateStatus(req, res) {
        try {
            const store_id = req.params.store_id;
            const { status } = req.body;
            const data = await prisma.store.update({
                where: { store_id },
                data: { status: status === 'true' || status === true }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async DeleteStore(req, res) {
        try {
            const store_id = req.params.store_id;
            const data = await prisma.store.delete({ where: { store_id } });
            if (!data) return SendError(res, 404, EMessage.EDelete);
            return SendSuccess(res, SMessage.Delete, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}
