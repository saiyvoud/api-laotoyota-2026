import { ValidateData } from "../service/validate.js"
import { EMessage, SMessage, FixStatus } from "../service/message.js"
import { SendError, SendCreate, SendSuccess } from "../service/response.js"
import prisma from "../config/prima.js";
import { FindOneBooking, FindOneBranch, FindOneCard, FindOneUser } from "../service/service.js";
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
    static async getAllFixFromWorkshop(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                startDate,
                endDate,
                status,
            } = req.query;

            const query = {
                bookingId: null, // เฉพาะงาน Workshop
            };

            // Search
            if (search) {
                query.OR = [
                    {
                        card: {
                            car: {
                                plateNumber: {
                                    contains: search,
                                },
                            },
                        },
                    },
                    {
                        card: {
                            car: {
                                model: {
                                    contains: search,
                                },
                            },
                        },
                    },
                    {
                        card: {
                            user: {
                                username: {
                                    contains: search,
                                },
                            },
                        },
                    },
                ];
            }

            // Date Filter
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

            // Status Filter
            if (status) {
                query.fixStatus = status;
            }

            const fix = await prisma.fix.findMany({
                where: query,
                orderBy: {
                    createdAt: "desc",
                },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),

                include: {
                    card: {
                        include: {
                            user: true,
                            car: true,
                        },
                    },
                },
            });

            const count = await prisma.fix.count({
                where: query,
            });

            const totalPage = Math.ceil(count / parseInt(limit));

            return SendSuccess(res, SMessage.SelectAll, {
                data: fix,
                totalPage,
                 count,
            });

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


    static async getAllFixFromBooking(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                startDate,
                endDate,
                status,
            } = req.query;

            const query = {
                bookingId: { not: null }, // ✅ เอาเฉพาะ booking เท่านั้น
            };

            // SEARCH
            if (search) {
                query.OR = [
                    {
                        card: {
                            car: {
                                plateNumber: {
                                    contains: search,
                                },
                            },
                        },
                    },
                    {
                        card: {
                            car: {
                                model: {
                                    contains: search,
                                },
                            },
                        },
                    },
                    {
                        card: {
                            user: {
                                username: {
                                    contains: search,
                                },
                            },
                        },
                    },
                ];
            }

            // DATE FILTER
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

            // STATUS FILTER
            if (status) {
                query.fixStatus = status;
            }

            const fix = await prisma.fix.findMany({
                where: query,
                orderBy: { createdAt: "desc" },
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
                            car: true,
                        },
                    },
                },
            });

            const count = await prisma.fix.count({
                where: query,
            });

            const totalPage = Math.ceil(count / parseInt(limit));

            return SendSuccess(res, SMessage.SelectAll, {
                data: fix,
                totalPage,
                 count,
            });

        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async getAllFixByBranchFromBooking(req, res) {
        try {
            const branchId = req.params.branch_id;
            const { page = 1, limit = 10, search, startDate, endDate, status } = req.query;
            const query = {
                booking: {
                    branchId: branchId
                }
            };
            if (status) {
                query.fixStatus = status;
            }

            if (search) {
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
            return SendSuccess(res, SMessage.SelectAll, { data: data, totalPage , count });

        } catch (error) {
            console.error("Fetch Error:", error);
            return SendError(res, 500, EMessage.ServerInternal, error.message);
        }
    }

    static async getAllFixByBranchFromWorkshop(req, res) {
        try {
            const branchId = req.params.branch_id;
            const { page = 1, limit = 10, search, startDate, endDate, status } = req.query;
            const query = {
                branchId: branchId,
                bookingId: null, // เฉพาะงาน Workshop
            };
            if (status) {
                query.fixStatus = status;
            }

            if (search) {
                query.AND = [
                    { branchId: branchId },
                    {
                        OR: [
                            { card: { car: { plateNumber: { contains: search } } } },
                            { card: { car: { frameNumber: { contains: search } } } }
                        ]
                    }
                ];
            }

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
            return SendSuccess(res, SMessage.SelectAll, { data: data, totalPage, count });

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
            const { bookingId, detailFix, kmLast, kmNext, labour_total, part_total, part_point, labour_point, exchange_rate, payment_type, cardId, tax_invoice_code } = req.body;
            const validate = await ValidateData({ kmLast, kmNext, tax_invoice_code });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            const booking = await FindOneBooking(bookingId);
            if (!booking) return SendError(res, 404, EMessage.ESelect);
            const card = await FindOneCard(cardId);
            if (!card) return SendError(res, 404, EMessage.ESelect);
            const data = await prisma.fix.update({
                data: {
                    bookingId: booking.booking_id,
                    detailFix,
                    kmLast: parseInt(kmLast),
                    kmNext: parseInt(kmNext),
                    labour_total: parseInt(labour_total || 0),
                    part_total: parseInt(part_total || 0),
                    part_point: parseInt(part_point || 0),
                    labour_point: parseInt(labour_point || 0),
                    totalPrice: parseInt(labour_total || 0) + parseInt(part_total || 0),
                    cardId: card.card_id,
                    tax_invoice_code: tax_invoice_code,
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
    // static async WorkShopFix(req, res) {
    //     try {
    //         const {
    //             detailFix, kmLast, kmNext,
    //             labour_total, part_total, part_point, labour_point,
    //             cardId, frameNumber, exchange_rate, payment_type, invoice_number, tax_invoice_code
    //         } = req.body;
    //         // console.log(req.body);

    //         // 1. Validate ข้อมูลพื้นฐาน
    //         const validate = await ValidateData({ kmLast, kmNext, tax_invoice_code });
    //         if (validate.length > 0) {
    //             return SendError(res, 400, EMessage.BadRequest, validate.join(','));
    //         }
    //         let cardData = null;
    //         if (cardId) {
    //             cardData = await FindOneCard(cardId);
    //         } else if (frameNumber) {
    //             cardData = await prisma.card.findFirst({
    //                 where: {
    //                     car: {
    //                         frame_number: frameNumber
    //                     }
    //                 }
    //             });
    //         }

    //         if (!cardData) {
    //             return SendError(res, 404, EMessage.ESelect);
    //         }

    //         const pointData = await prisma.setting.findFirst();
    //         if (!pointData) {
    //             return SendError(res, 404, EMessage.ESelect);
    //         }
    //         console.log("point data :",pointData);

    //         // calculator point
    //         if(!labour_point || !part_point) {
    //             const laboutPoint = labour_total * pointData.labour_point ;
    //             const partPoint = part_total * pointData.part_point;
    //             labour_point = laboutPoint;
    //             part_point = partPoint;
    //         }


    //         // เตรียมข้อมูลสำหรับ Insert
    //         const fixData = {
    //             detailFix,
    //             kmLast: parseInt(kmLast),
    //             kmNext: parseInt(kmNext),
    //             labour_total: parseInt(labour_total || 0),
    //             part_total: parseInt(part_total || 0),
    //             part_point: parseInt(part_point || 0),
    //             labour_point: parseInt(labour_point || 0),
    //             totalPrice: parseInt(labour_total || 0) + parseInt(part_total || 0),
    //             cardId: cardData.card_id,
    //             exchange_rate: parseInt(exchange_rate || 0),
    //             payment_type,
    //             invoice_date: new Date(),
    //             tax_invoice_code: tax_invoice_code,
    //             invoice_number: invoice_number,
    //             fixStatus: FixStatus.success,
    //             createBy: req.employee,
    //         };



    //         // กรณีมีบัตร: ใช้ Transaction เพื่อความปลอดภัย
    //         const card = await prisma.card.findUnique({ where: { card_id: cardData.card_id } });
    //         if (!card) return SendError(res, 404, EMessage.ESelect);
    //         const totalPointToAdd = parseInt(labour_point || 0) + parseInt(part_point || 0);
    //         const result = await prisma.$transaction(async (tx) => {
    //             // บันทึกการซ่อม
    //             const newFix = await tx.fix.create({ data: fixData });

    //             // อัปเดตแต้มในบัตร
    //             await tx.card.update({
    //                 where: { card_id: cardData.card_id },
    //                 data: {
    //                     total_point: (card?.total_point || 0) + totalPointToAdd
    //                 }
    //             });


    //             return newFix;
    //         });
    //         // 1. หา Employee ก่อน
    //         const employee = await prisma.employee.findFirst({
    //             where: { employee_id: result.createBy }
    //         });

    //         // 2. เช็คว่าเจอพนักงานไหมก่อนจะเข้าถึง branchId
    //         if (employee) {
    //             const branchId = employee.branchId;
    //             const branch = await FindOneBranch(branchId);
    //             if (branch) {
    //                 await prisma.fix.update({
    //                     where: { fix_id: result.fix_id },
    //                     data: { branchId: branch.branch_id }
    //                 })
    //             }
    //         } else {
    //             return SendError(res, 404, EMessage.ESelect);
    //         }

    //         if (!result) return SendError(res, 400, EMessage.EInsert);

    //         return SendSuccess(res, SMessage.Insert, result);

    //     } catch (error) {
    //         console.error("WorkshopFix Error:", error);
    //         return SendError(res, 500, EMessage.ServerInternal, error.message);
    //     }
    // }

    static async WorkShopFix(req, res) {
        try {
            let {
                detailFix,
                kmLast,
                kmNext,
                labour_total,
                part_total,
                part_point,
                labour_point,
                cardId,
                frameNumber,
                exchange_rate,
                payment_type,
                invoice_number,
                tax_invoice_code,
            } = req.body;

            // Validate
            const validate = await ValidateData({
                kmLast,
                kmNext,
                tax_invoice_code,
            });

            if (validate.length > 0) {
                return SendError(
                    res,
                    400,
                    EMessage.BadRequest,
                    validate.join(",")
                );
            }

            // หา Card
            let cardData = null;

            if (cardId) {
                cardData = await FindOneCard(cardId);
            } else if (frameNumber) {
                cardData = await prisma.card.findFirst({
                    where: {
                        car: {
                            frameNumber: frameNumber,
                        },
                    },
                });
            }

            if (!cardData) {
                return SendError(
                    res,
                    404,
                    EMessage.ESelect,
                    "Card not found"
                );
            }

            // หา Setting
            const pointData = await prisma.setting.findFirst();

            if (!pointData) {
                return SendError(
                    res,
                    404,
                    EMessage.ESelect,
                    "Point setting not found"
                );
            }


            // Convert Number
            const labourTotal = Number(labour_total || 0);
            const partTotal = Number(part_total || 0);

            let labourPoint = Number(labour_point);
            let partPoint = Number(part_point);

            // Auto Calculate Point
            if (
                labour_point === null ||
                labour_point === undefined ||
                labour_point === ""
            ) {
                labourPoint = Math.floor( labourTotal / Number(pointData.priceFix || 1)
                );
            }

            if (
                part_point === null ||
                part_point === undefined ||
                part_point === ""
            ) {
                partPoint = Math.floor(
                    partTotal / Number(pointData.pricePart || 1)
                );
            }

            // หา Employee
            const employee = await prisma.employee.findUnique({
                where: {
                    employee_id: req.employee,
                },
            });

            if (!employee) {
                return SendError(
                    res,
                    404,
                    EMessage.ESelect,
                    "Employee not found"
                );
            }

            const totalPrice = labourTotal + partTotal;

            const totalPointToAdd =
                Math.floor(labourPoint) +
                Math.floor(partPoint);

            const result = await prisma.$transaction(
                async (tx) => {
                    // สร้างรายการซ่อม
                    const newFix = {
                        detailFix,

                        kmLast: Number(kmLast),
                        kmNext: Number(kmNext),

                        labour_total: labourTotal,
                        part_total: partTotal,

                        labour_point: labourPoint,
                        part_point: partPoint,

                        totalPrice: labourTotal + partTotal,

                        cardId: cardData.card_id,

                        exchange_rate: Number(exchange_rate || 0),

                        payment_type,

                        invoice_date: new Date(),

                        tax_invoice_code,
                        invoice_number,

                        fixStatus: FixStatus.success,

                        createBy: req.employee,
                    };

                    // เพิ่มแต้ม
                    await tx.card.update({
                        where: {
                            card_id: cardData.card_id,
                        },
                        data: {
                            total_point:
                                Number(cardData.total_point || 0) +
                                totalPointToAdd,
                        },
                    });

                    return newFix;
                }
            );

            return SendSuccess(
                res,
                SMessage.Insert,
                result
            );
        } catch (error) {
            console.error("WorkshopFix Error:", error);

            return SendError(
                res,
                500,
                EMessage.ServerInternal,
                error.message
            );
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

    // setting point

    static async createSettingPoint(req, res) {
        try {
            const { priceFix, pricePart } = req.body;
            const data = await prisma.setting.upsert({
                where: {
                    setting_id: "GLOBAL_SETTING",
                },
                update: {
                    priceFix: parseInt(priceFix),
                    pricePart: parseInt(pricePart),
                    pointFix: parseInt(priceFix),
                    pointPart: parseInt(pricePart),

                },
                create: {
                    setting_id: "GLOBAL_SETTING",
                    priceFix: parseInt(priceFix),
                    pricePart: parseInt(pricePart),
                    pointFix: parseInt(priceFix),
                    pointPart: parseInt(pricePart),
                },
            });

            return SendSuccess(res, SMessage.UpdateSuccess, data);

        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async getSettingPoint(req, res) {
        try {
            const data = await prisma.setting.findFirst({
                where: {
                    setting_id: "GLOBAL_SETTING",
                },
            })
            if (!data) {
                return SendError(res, 404, "Not Found");
            }
            return SendSuccess(res, "Success", data);
        } catch (error) {
            return SendError(res, 500, "Server Error", error);
        }
    }
}