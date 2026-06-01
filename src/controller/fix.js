import { ValidateData } from "../service/validate.js"
import { EMessage, SMessage, FixStatus } from "../service/message.js"
import { SendError, SendCreate, SendSuccess } from "../service/response.js"
import prisma from "../config/prima.js";
import { FindOneBooking, FindOneCard, FindOneUser } from "../service/service.js";
import { ExcelBuilder, ReportColumns } from "../service/excelBuilder.js";
export default class FixController {
    static async SearchFix(req, res) {
        try {
            const search = req.query.search;

            const data = await prisma.fix.findMany({
                where: {
                    fixName: {
                        contains: search
                    },
                }
            });
            if (!data) {
                return SendError(res, 404, EMessage.NotFound);
            }
            return SendSuccess(res, SMessage.Search, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async getAllFix(req, res) {
        try {
            const { page = 1, limit = 10, search, startDate, endDate, status, } = req.query;
            const query = {};
            if (search) {
                query['OR'] = [
                    { detailFix: { contains: search } },
                ];
            }

            if (startDate || endDate) {
                query['createdAt'] = {};
                if (startDate) query['createdAt']['gte'] = new Date(startDate);
                if (endDate) query['createdAt']['lt'] = new Date(endDate);
            }
            if (status) {
                query['fixStatus'] = status;
            }
            const fix = await prisma.fix.findMany({
                where: query,
                orderBy: { createdAt: 'desc' },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                include: {
                    booking: {
                        include: {
                            car: true,
                            time: true,
                            user: true,
                            branch: true,
                        },
                    },
                    card: {
                        include: {
                            user: true,
                            car: true
                        },
                    },

                },
            });
            if (!fix) return SendError(res, 404, EMessage.NotFound);
            const count = await prisma.fix.count({ where: query });
            const totalPage = Math.ceil(count / parseInt(limit));
            return SendSuccess(res, SMessage.SelectAll, { data: fix, totalPage });
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async getAllFixByBranch(req, res) {
        try {
            const branchId = req.params.branch_id;
            const { page = 1, limit = 10, search, startDate, endDate, status } = req.query;

            // 1. กำหนด Query พื้นฐาน (กรองตาม branchId ผ่าน booking relation)
            const query = {
                booking: {
                    branchId: branchId
                }
            };

            // 2. กรองตามสถานะของงานซ่อม (Fix Status)
            if (status) {
                query.fixStatus = status;
            }

            // 3. เงื่อนไขการ Search (ค้นหาทะเบียนรถ หรือ เลขตัวถัง)
            if (search) {
                // ใช้ AND ร่วมกับ OR เพื่อให้ยังคงกรองเฉพาะ branchId เดิมอยู่
                query.AND = [
                    { booking: { branchId: branchId } },
                    {
                        OR: [
                            { booking: { car: { plateNumber: { contains: search } } } },
                            { booking: { car: { frameNumber: { contains: search } } } }
                        ]
                    }
                ];
            }

            // 4. เงื่อนไขช่วงวันที่ (ของรายการ Fix)
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.gte = new Date(startDate);
                if (endDate) query.createdAt.lt = new Date(endDate);
            }

            // 5. ดึงข้อมูลจาก prisma.fix (ไม่ใช่ prisma.booking)
            const data = await prisma.fix.findMany({
                where: query,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                include: {
                    booking: {
                        include: {
                            car: true,
                            time: true,
                            user: true,
                            branch: true,
                        },
                    },
                    card: {
                        include: {
                            user: true,
                            car: true
                        },
                    },
                },
            });

            // 6. นับจำนวนทั้งหมดตามเงื่อนไขเพื่อทำ Pagination
            const count = await prisma.fix.count({ where: query });
            const totalPage = Math.ceil(count / parseInt(limit));

            // 7. ส่งค่ากลับ (ใช้ data: data ให้ตรงกับตัวแปรที่ประกาศไว้)
            return SendSuccess(res, SMessage.SelectAll, { data: data, totalPage });

        } catch (error) {
            console.error("Fetch Error:", error);
            return SendError(res, 500, EMessage.ServerInternal, error.message);
        }
    }

    static async SelectAll(req, res) {
        try {

            const data = await prisma.fix.findMany(
                {
                    include: {
                        booking: {
                            include: {
                                car: true,
                                time: true,
                                user: true,
                                branch: true,
                            },
                        },
                        card: {
                            include: {
                                user: true,
                                car: true
                            },
                        },
                    },
                }
            );
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectAll, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectOne(req, res) {
        try {
            const fix_id = req.params.fix_id;

            const data = await prisma.fix.findFirst({
                where: { fix_id: fix_id },
                include: {
                    booking: {
                        include: {
                            car: true,
                            time: true,
                            user: true,
                            branch: true,
                        },
                    },
                    card: {
                        include: {
                            user: true,
                            car: true
                        },
                    },
                },
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectOne, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }


    static async SelectFixByBooking(req, res) {
        try {
            const { bookingId } = req.params;

            const data = await prisma.fix.findFirst({
                where: {
                    bookingId: bookingId,
                },
            });
            if (!data) {
                return SendError(res, 404, EMessage.NotFound);
            }

            return SendSuccess(
                res,
                SMessage.SelectOne,
                data
            );
        } catch (error) {
            console.log(error);

            return SendError(
                res,
                500,
                EMessage.ServerInternal,
                error
            );
        }
    }

    static async SelectBy(req, res) {
        try {
            const fixStatus = req.query.fixStatus;
            const checkStatus = Object.values(FixStatus);
            if (!checkStatus.includes(fixStatus)) {
                return SendError(res, 404, EMessage.NotFound);
            }

            const data = await prisma.fix.findMany({ where: { fixStatus: fixStatus } });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectBy, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async Insert(req, res) {
        try {
            const { bookingId, invoice_number, cardId } = req.body;
            const validate = await ValidateData({ bookingId, invoice_number, cardId });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            await FindOneBooking(bookingId);
            const data = await prisma.fix.create({
                data: {
                    bookingId: bookingId,
                    invoice_number,
                    invoice_date: new Date(),
                    cardId,
                    createBy: req.employee,
                }
            })
            return SendCreate(res, SMessage.Insert, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async UpdateFixSuccess(req, res) {
        try {
            const fix_id = req.params.fix_id;
            const { bookingId, detailFix, kmLast, kmNext, labour_total, part_total, part_point, labour_point, cardId, exchange_rate, payment_type, } = req.body;
            const validate = await ValidateData({ bookingId, kmLast, kmNext });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            const booking = await FindOneBooking(bookingId);
            const card = await FindOneCard(cardId);
            const data = await prisma.fix.update({
                data: {
                    bookingId, detailFix,
                    kmLast: parseInt(kmLast),
                    kmNext: parseInt(kmNext),
                    labour_total: parseInt(labour_total || 0),
                    part_total: parseInt(part_total || 0),
                    part_point: parseInt(part_point || 0),
                    labour_point: parseInt(labour_point || 0),
                    totalPrice: parseInt(labour_total || 0) + parseInt(part_total || 0),
                    cardId,
                    exchange_rate: parseInt(exchange_rate || 0),
                    payment_type,
                    fixStatus: FixStatus.success,
                    createBy: req.employee
                },
                where: {
                    fix_id: fix_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            const totalPoint = parseInt(labour_point || 0) + parseInt(part_point || 0);
            const update = await prisma.card.update({
                data: {
                    total_point: (card.total_point || 0) + totalPoint,
                }, where: { card_id: cardId }
            })
            if (!update) {
                SendError(res, 400, EMessage.EUpdate);
            }
            return SendSuccess(res, SMessage.Update, data)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }

    static async WorkShopFix(req, res) {
        try {
            const {
                detailFix, kmLast, kmNext,
                labour_total, part_total, part_point,
                labour_point, cardId, exchange_rate, payment_type, invoice_number
            } = req.body;

            // 1. Validate ข้อมูลพื้นฐาน
            const validate = await ValidateData({ kmLast, kmNext });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }

            // เตรียมข้อมูลสำหรับ Insert
            const fixData = {
                detailFix,
                kmLast: parseInt(kmLast),
                kmNext: parseInt(kmNext),
                labour_total: parseInt(labour_total || 0),
                part_total: parseInt(part_total || 0),
                part_point: parseFloat(part_point || 0),
                labour_point: parseFloat(labour_point || 0),
                totalPrice: parseInt(labour_total || 0) + parseInt(part_total || 0),
                cardId: cardId,
                exchange_rate: parseInt(exchange_rate || 0),
                payment_type,
                invoice_date: new Date(),
                invoice_number,
                fixStatus: FixStatus.success, // หรือใช้ FixStatus.success ตาม enum ของคุณ
                createBy: req.employee // ตรวจสอบว่า middleware เก็บค่าไว้ที่ req.employee จริงหรือไม่
            };

            // กรณีมีบัตร: ใช้ Transaction เพื่อความปลอดภัย
            const card = await prisma.card.findUnique({ where: { card_id: cardId } });
            if (!card) return SendError(res, 404, EMessage.ESelect);
            const totalPointToAdd = parseFloat(labour_point || 0) + parseFloat(part_point || 0);
            const result = await prisma.$transaction(async (tx) => {
                // บันทึกการซ่อม
                const newFix = await tx.fix.create({ data: fixData });

                // อัปเดตแต้มในบัตร
                await tx.card.update({
                    where: { card_id: cardId },
                    data: {
                        total_point: (card?.total_point || 0) + totalPointToAdd
                    }
                });

                return newFix;
            });

            if (!result) return SendError(res, 400, EMessage.EInsert);

            return SendSuccess(res, SMessage.Insert, result);

        } catch (error) {
            console.error("WorkshopFix Error:", error);
            return SendError(res, 500, EMessage.ServerInternal, error.message);
        }
    }
    static async UpdateFix(req, res) {
        try {
            const fix_id = req.params.fix_id;

            const { bookingId, } = req.body;
            const validate = await ValidateData({ bookingId, });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            await FindOneBooking(bookingId); // ສ້າງໃນ service

            const data = await prisma.fix.update({
                data: {
                    bookingId, createBy: req.employee
                }, where: { fix_id: fix_id }
            })
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async DeleteFix(req, res) {
        try {
            const fix_id = req.params.fix_id;

            const data = await prisma.fix.delete({ where: { fix_id: fix_id } })

            return SendSuccess(res, SMessage.Delete, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async ExportFix(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const query = {};
            if (startDate || endDate) {
                query['createdAt'] = {};
                if (startDate) query['createdAt']['gte'] = new Date(startDate);
                if (endDate) query['createdAt']['lt'] = new Date(endDate);
            }
            const data = await prisma.fix.findMany({ where: query });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            const exportData = data.map(item => ({
                CustomerName: item.booking.user.username,
                customerPhone: item.booking.user.phoneNumber,
                CarModel: item.booking.car.model,
                CarPlateNumber: item.booking.car.plateNumber,
                CarEngineNumber: item.booking.car.engineNumber,
                CarFrameNumber: item.booking.car.frameNumber,
                BranchName: item.booking.branch.branch_name,
                Time: item.booking.time.time,
                Date: item.booking.time.date,
                DetailFix: item.detailFix,
                KmLast: item.kmLast,
                KmNext: item.kmNext,
                FixCarPrice: item.fixCarPrice,
                CarPartPrice: item.carPartPrice,
                TotalPrice: item.totalPrice,
            }));
            // เรียกใช้ ExcelBuilder
            return await ExcelBuilder.export(res, {
                sheetName: "Fix Report",
                columns: ReportColumns.fix,
                data: exportData,
                fileName: "fix-report.xlsx",
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }


    static async exportWorkshopFix(req, res) {
        try {
            const { startDate, endDate } = req.query
            const data = await prisma.fix.findMany({
                where: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: { createdAt: "desc" },
                include: {
                    card: {
                        include: {
                            user: true,
                            car: true
                        },
                    },
                },
            });

            if (!data.length) {
                return SendError(res, 404, "No data found for this date range");
            }
            // console.log("Booking data:", data);
            const exportData = data.map(item => ({
                userName: item.card?.user?.username,
                phoneNumber: item.card?.user?.phoneNumber,
                carModel: item.card?.car?.model,
                plateNumber: item.card?.car?.plateNumber,
                engineNumber: item.card?.car?.engineNumber,
                frameNumber: item.card?.car?.frameNumber,
                date: item.createdAt.toISOString().split('T')[0],
            }));

            // เรียกใช้ ExcelBuilder
            return await ExcelBuilder.export(res, {
                sheetName: "workshop fix Report",
                columns: ReportColumns.shopFix,
                data: exportData,
                fileName: "workshop-fix.xlsx",
            });

        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}