
import { EMessage, Role, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { CheckPhoneNumber, DecryptData, EncryptData, FindByPhoneNumber, GenerateToken, VerifyRefreshToken, FindOneUser } from "../service/service.js";
import prisma from "../config/prima.js";
import { UploadImageToCloud } from "../config/cloudinary.js";
import { ExcelBuilder, ReportColumns } from "../service/excelBuilder.js";

export default class UserController {
    static async SearchUser(req, res) {
        try {
            const search = req.query.search;

            const data = await prisma.user.findMany({
                where: {
                    phoneNumber: { contains: search }, username: {
                        contains: search
                    }
                }
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.Search, data);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async getAllUserGeneral(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                startDate,
                endDate,
                status
            } = req.query;
            const query = {};

            if (search) {
                query.OR = [
                    {
                        username: {
                            contains: search
                        }
                    },

                    {
                        phoneNumber: {
                            contains: search
                        }
                    },
                    {
                        customer_number: {
                            contains: search
                        }
                    }

                ];
            }

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

            if (status) {
                query.role = status;
            }

            const user = await prisma.user.findMany({
                where: query,
                orderBy: {
                    createdAt: 'desc',                },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
            });
            if (!user) return SendError(res, 404, EMessage.NotFound);
            const count = await prisma.user.count({ where: query });
            const totalPage = Math.ceil(count / parseInt(limit));
            return SendSuccess(res, SMessage.SelectAll, { data: user, totalPage, count })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async getAllUser(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                startDate,
                endDate,
                status
            } = req.query;
            const query = {};
            if (search) {

                query.OR = [

                    {
                        username: {
                            contains: search
                        }
                    },

                    {
                        phoneNumber: {
                            contains: search
                        }
                    }

                ];
            }

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

            if (status) {
                query.role = { not: status }; //  ເອົາ record ທີ່ role ບໍ່ເທົ່າກັບ status
            }

            const user = await prisma.user.findMany({
                where: query,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
            });
            if (!user) return SendError(res, 404, EMessage.NotFound);
            const count = await prisma.user.count({ where: query });
            const totalPage = Math.ceil(count / parseInt(limit));
            return SendSuccess(res, SMessage.SelectAll, { data: user, totalPage, count })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectAll(req, res) {
        try {

            const data = await prisma.user.findMany({
                include: {
                    Employee: true
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
            const user_id = req.params.user_id;
            const data = await prisma.user.findFirst({
                where: { user_id: user_id },
                include: {
                    Card: {
                        include: {
                            car: true
                        }
                    }
                }
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            return SendSuccess(res, SMessage.SelectOne, data)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Login(req, res) {
        try {
            const { phoneNumber, password, deviceToken } = req.body;
            const validate = await ValidateData({ phoneNumber, password });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","));
            }
            const user = await FindByPhoneNumber(phoneNumber); // ສ້າງໃນ service
            if (!user) return SendError(res, 404, EMessage.NotFound);
            if (user.role !== Role.general) {
                return SendError(res, 400, EMessage.BadRequest);
            }
            const decryptPassword = await DecryptData(user.password);
            if (decryptPassword !== password) {
                return SendError(res, 404, EMessage.NotMatch);
            }
            if (!deviceToken) {
                await prisma.user.update({
                    data: {
                        deviceToken
                    },
                    where: {
                        user_id: user.user_id,
                    }
                })
            }
            const token = await GenerateToken(user.user_id); // ສ້າງໃນ service
            const data = Object.assign(
                JSON.parse(JSON.stringify(user)),
                JSON.parse(JSON.stringify(token)),
            );
            data.password = undefined;
            data.role = undefined;
            return SendSuccess(res, SMessage.Login, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async LoginAdmin(req, res) {
        try {
            const { phoneNumber, password } = req.body;
            const validate = await ValidateData({ phoneNumber, password });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","));
            }

            const user = await FindByPhoneNumber(phoneNumber); // ສ້າງໃນ service
            if (!user) return SendError(res, 404, EMessage.NotFound);

            if (user.role === Role.general) {
                return SendError(res, 400, EMessage.BadRequest);
            }
            const decryptPassword = await DecryptData(user.password);
            if (decryptPassword !== password) {
                return SendError(res, 404, EMessage.NotMatch);
            }
            const token = await GenerateToken(user.user_id); // ສ້າງໃນ service
            const data = Object.assign(
                JSON.parse(JSON.stringify(user)),
                JSON.parse(JSON.stringify(token)),
            );
            data.password = undefined;
            return SendSuccess(res, SMessage.Login, data);
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Register(req, res) {
        try {
            const { username, phoneNumber, password, province, district, village, email } = req.body;
            const finalPassword = password || Math.random().toString(36).slice(-8);
            const validate = await ValidateData({ username, phoneNumber, password: finalPassword, province, district, village });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','))
            }
            // const checkPhoneNumber = await CheckPhoneNumber(phoneNumber); // ສ້າງຢູ່ service

            // ✅ ถ้า phoneNumber ซ้ำ → skip
            const existingPhoneNumber = await prisma.user.findFirst({
                where: { phoneNumber: String(phoneNumber) },
            });
            if (existingPhoneNumber) {
                return SendCreate(res, "Phone number already exists", existingPhoneNumber);
            }

            const generatePassword = await EncryptData(finalPassword)
            const randow = "LTS" + `${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}`;

            const data = await prisma.user.create({
                data: {
                    username,
                    phoneNumber: String(phoneNumber),
                    password: generatePassword,
                    province,
                    district,
                    village,
                    customer_number: randow.toString(),
                    role: Role.general,
                    point: 0,
                    email: email ?? null
                }
            })
            data.password = undefined;
            data.role = undefined;
            return SendCreate(res, SMessage.Register, data)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }

    static async RegisterAdmin(req, res) {
        try {
            const { username, phoneNumber, password, province, district, village, email, role } = req.body;

            // ✅ validate role ຕ້ອງເປັນ admin ຫຼື super_admin ເທົ່ານັ້ນ
            const allowedRoles = ["admin", "super_admin"];
            if (!role || !allowedRoles.includes(role)) {
                return SendError(res, 400, EMessage.BadRequest, "Role must be 'admin' or 'super_admin'");
            }

            const validate = await ValidateData({
                username, phoneNumber, password, province, district, village
            });

            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }

            const existingPhoneNumber = await prisma.user.findFirst({
                where: { phoneNumber: String(phoneNumber) },
            });
            if (existingPhoneNumber) {
                return SendCreate(res, "Phone number already exists", existingPhoneNumber);
            }

            const generatePassword = await EncryptData(password);
            const randow = "LTS" + `${Math.floor(Math.random() * (100 - 1 + 1)) + 1}`;

            const data = await prisma.user.create({
                data: {
                    username,
                    phoneNumber: String(phoneNumber),
                    password: generatePassword,
                    province,
                    district,
                    village,
                    customer_number: randow.toString(),
                    role: role,
                    point: 0,
                    email: email ?? null,
                },
            });

            data.password = undefined;
            return SendCreate(res, SMessage.Register, data);

        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async RegisterSuperAdmin(req, res) {
        try {
            const { username, phoneNumber, password, province, district, village, email } = req.body;
            // console.log(req.body);
            const validate = await ValidateData({
                username, phoneNumber,
                password, province, district, village
            });

            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','))
            }
            const checkPhoneNumber = await CheckPhoneNumber(phoneNumber); // ສ້າງຢູ່ service
            if (!checkPhoneNumber) return SendError(res, 404, EMessage.NotFound)
            const generatePassword = await EncryptData(password)
            const randow = "LTS" + `${Math.floor(Math.random() * (100 - 1 + 1)) + 1}`;
            const data = await prisma.user.create({
                data: {
                    username,
                    phoneNumber: String(phoneNumber),
                    password: generatePassword,
                    province,
                    district,
                    village,
                    customer_number: randow.toString(),
                    role: Role.superadmin,
                    point: 0,
                    email: email ?? null
                }
            })
            data.password = undefined;
            data.role = undefined;
            return SendCreate(res, SMessage.Register, data)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async Forgot(req, res) {
        try {

            const { phoneNumber, newPassword } = req.body;
            const validate = await ValidateData({ phoneNumber, newPassword });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const user = await FindByPhoneNumber(phoneNumber);
            if (!user) return SendError(res, 404, EMessage.NotFound);
            const generatePassword = await EncryptData(newPassword);
            const data = await prisma.user.update({
                data: {
                    password: generatePassword,
                },
                where: {
                    user_id: user.user_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async ChangePassword(req, res) {
        try {
            const user_id = req.user; // ມາຈາກ token 

            const { oldPassword, newPassword } = req.body;
            const validate = await ValidateData({ oldPassword, newPassword });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const user = await FindOneUser(user_id); // ສ້າງຢູ່ Serivce
            const decrypt = await DecryptData(user.password)
            if (oldPassword !== decrypt) {
                return SendError(res, 400, EMessage.NotMatch)
            }
            const generatePassword = await EncryptData(newPassword);
            const data = await prisma.user.update({
                data: {
                    password: generatePassword,
                },
                where: {
                    user_id: user_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }

    static async UpdateUser(req, res) {
        try {
            const user_id = req.user; // ມາຈາກ token 
            const { username, email, province, district, village, } = req.body;
            const validate = await ValidateData({ username, province, district, village });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            let img_url = null;

            if (req.files && req.files.image) {
                const image = req.files.image;
                img_url = await UploadImageToCloud(image.data, image.mimetype);
                if (!img_url) {
                    return SendError(res, 404, EMessage.EUpload);
                }
            }
            await FindOneUser(user_id); // ສ້າງຢູ່ Serivce
            const data = await prisma.user.update({
                data: {
                    username,
                    email,
                    province,
                    district,
                    village,
                    ...(img_url && { profile: img_url }), // ຖ້າມີຮຼບຄ່ອຍອັບໂຫຼດໄຟຣ
                },
                where: {
                    user_id: user_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }

    static async updateProfile(req, res) {
        try {
            const user_id = req.user;
            if (!req.files || !req.files.image) {
                return SendError(res, 400, EMessage.BadRequest, "Image file is required");
            }
            const image = req.files.image;
            const img_url = await UploadImageToCloud(image.data, image.mimetype);
            if (!img_url) {
                return SendError(res, 404, EMessage.EUpload);
            }

            const result = await prisma.user.update({
                data: {
                    profile: img_url
                },
                where: {
                    user_id: user_id
                }
            });
            if (!result) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async DeleteUser(req, res) {
        try {
            const user_id = req.user; // ມາຈາກ token 
            await FindOneUser(user_id); // ສ້າງຢູ່ Serivce
            const data = await prisma.user.delete({ where: { user_id: user_id } })
            if (!data) return SendError(res, 404, EMessage.EDelete);
            return SendSuccess(res, SMessage.Delete)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async Refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return SendError(res, 400, EMessage.BadRequest, "refreshToken")
            }
            const verify = await VerifyRefreshToken(refreshToken); // ສ້າງຢູ່ serivce 
            if (!verify) return SendError(res, 404, EMessage.NotFound);
            const token = await GenerateToken(verify.user_id); // ສ້າງໃນ service
            const data = Object.assign(
                JSON.parse(JSON.stringify(verify)),
                JSON.parse(JSON.stringify(token)),
            );
            data.password = undefined;
            data.role = undefined;
            return SendSuccess(res, SMessage.Update, token)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }

    // add new 
    static async GetProfile(req, res) {
        try {
            const user_id = req.user; // ມາຈາກ token
            const user = await FindOneUser(user_id);
            if (!user) return SendError(res, 404, EMessage.NotFound);
            user.password = undefined;
            // user.role = undefined;
            return SendSuccess(res, SMessage.Get, user);
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async UpdateCustomer(req, res) {
        try {
            const user_id = req.params.customer_id;
            const { username, phoneNumber, province, district, village, email, role } = req.body;
            // console.log(req.body);
            const validate = await ValidateData({ username, phoneNumber, province, district, village, });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const userData = await FindOneUser(user_id); // ສ້າງຢູ່ Serivce
            if (!userData) return SendError(res, 404, EMessage.EUpdate);

            // check phoneNumber duplicate
            const existingPhoneNumber = await prisma.user.findFirst({
                where: { phoneNumber: String(phoneNumber), NOT: { user_id: user_id } },
            });
            if (existingPhoneNumber) {
                return SendCreate(res, "Phone number already exists", existingPhoneNumber);
            }
            const data = await prisma.user.update({
                data: {
                    username, phoneNumber, province, district, village, email: email || null, ...(role && { role }),
                },
                where: {
                    user_id: user_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)

        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }


    static async DeleteCustomer(req, res) {
        try {
            const user_id = req.params.customer_id;
            await FindOneUser(user_id); // ສ້າງຢູ່ Serivce
            const data = await prisma.user.delete({ where: { user_id: user_id } })
            if (!data) return SendError(res, 404, EMessage.EDelete);
            return SendSuccess(res, SMessage.Delete)
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }


    static async ExportCustomer(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const query = {
                role: {
                    in: ["general"]
                }
            };
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
            const data = await prisma.user.findMany({ where: query });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            const exportData = data.map(item => ({
                Name: item.username,
                PhoneNumber: item.phoneNumber,
                Province: item.province,
                District: item.district,
                Village: item.village,
                Email: item.email,
                Point: item.point
            }));
            // เรียกใช้ ExcelBuilder
            return await ExcelBuilder.export(res, {
                sheetName: "Customer Report",
                columns: ReportColumns.customer,
                data: exportData,
                fileName: "customer-report.xlsx",
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }

    static async ExportAdmin(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const query = {
                role: {
                    in: ["admin"]
                }
            };
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
            const data = await prisma.user.findMany({
                where: query
            });
            if (!data) return SendError(res, 404, EMessage.NotFound);
            const exportData = data.map(item => ({
                Name: item.username,
                PhoneNumber: item.phoneNumber,
                Province: item.province,
                District: item.district,
                Village: item.village,
                Email: item.email

            }));
            // เรียกใช้ ExcelBuilder
            return await ExcelBuilder.export(res, {
                sheetName: "Admin Report",
                columns: ReportColumns.admin,
                data: exportData,
                fileName: "admin-report.xlsx",
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }


    static async ChangeCustomerPassword(req, res) {
        try {
            const user_id = req.params.customer_id;
            const { newPassword } = req.body;
            const validate = await ValidateData({ newPassword });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const user = await FindOneUser(user_id); // ສ້າງຢູ່ Serivce
            const generatePassword = await EncryptData(newPassword);
            const data = await prisma.user.update({
                data: {
                    password: generatePassword,
                },
                where: {
                    user_id: user_id
                }
            });
            if (!data) return SendError(res, 404, EMessage.EUpdate);
            return SendSuccess(res, SMessage.Update)
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }

    }

    static async ResetCutomerPassword(req, res) {
        try {
            const user_id = req.params.customer_id;
            await FindOneUser(user_id);
            if (!user_id) { return res.status(404).json({ success: false, message: "User not found" }); }
            // ================= GENERATE TEMP PASSWORD =================
            const temporaryPassword = Math.random().toString(36).slice(-8);
            // ================= HASH PASSWORD =================
            const generatePassword = await EncryptData(temporaryPassword)

            // ================= UPDATE DATABASE =================
            await prisma.user.update({
                where: {
                    user_id: user_id
                },
                data: {
                    password: generatePassword
                }
            });

            // ================= RETURN TEMP PASSWORD =================

            return res.status(200).json({
                success: true,
                message: "Password reset successfully",
                temporaryPassword
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    }



}