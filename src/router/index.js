import express from 'express';
import UserController from '../controller/user.js';
import ServiceController from '../controller/service.js'
import PromotionController from "../controller/promotion.js"
import TimeController from "../controller/time.js"
import ZoneController from "../controller/zone.js"
import GiftCardController from "../controller/giftcard.js"
import GiftHistoryController from '../controller/gifthistory.js'
import CardController from "../controller/card.js"
import CarController from "../controller/car.js"
import BookingController from "../controller/booking.js"
import FixController from '../controller/fix.js';
import { auth } from '../middleware/auth.js'
import BookingDetailController from '../controller/bookingDetail.js';
import EmployeeController from '../controller/employee.js';
import BranchController from '../controller/branch.js';
import NotificationController from '../controller/notification.js';
import TimeFixController from '../controller/timefix.js';
const router = express.Router();
//----- User----
router.post("/user/register", UserController.Register);
router.post("/user/registerAdmin", auth, UserController.RegisterAdmin);
router.post("/user/login", UserController.Login);
router.post("/user/loginAdmin", UserController.LoginAdmin);
router.get("/user/selAll", auth, UserController.SelectAll);
router.get("/user/selOne/:user_id", auth, UserController.SelectOne);
router.get("/user/search", auth, UserController.SearchUser);
router.get("/user/profile", auth, UserController.GetProfile);
router.get("/user/getAll", auth, UserController.getAllUser);
router.get("/user/exportCustomer", auth, UserController.ExportCustomer);
router.get("/user/exportEmployee", auth, UserController.ExportEmployee);
router.get("/user/exportAdmin", auth, UserController.ExportAdmin);
router.put("/user/forgot", UserController.Forgot);
router.put("/user/changePassword", auth, UserController.ChangePassword);
router.put("/user/refresh", UserController.Refresh);
router.put("/user/update", auth, UserController.UpdateUser);
router.put("/user/update/profile", auth, UserController.updateProfile);
router.put("/user/update/:customer_id", auth, UserController.UpdateCustomer);
router.put("/user/updatePoint", auth, UserController.UpdatePoint);
router.put("/user/changeCustomerPassword/:customer_id", auth, UserController.ChangeCustomerPassword);
router.delete("/user/delete/:customer_id", auth, UserController.DeleteCustomer);
router.delete("/user/delete", auth, UserController.DeleteUser);
//---- Service ----     
router.get("/service/selAll", auth, ServiceController.SelectAll);
router.get("/service/selOne/:service_id", auth, ServiceController.SelectOne);
router.get("/service/getAll", auth, ServiceController.GetAllService);
router.get("/service/export", auth, ServiceController.ExportService);
router.post("/service/insert", auth, ServiceController.Insert);
router.put("/service/update/:service_id", auth, ServiceController.Updateservice);
router.delete("/service/delete/:service_id", auth, ServiceController.Deleteservice);
//---- promotion ----
router.get("/promotion/selAll", auth, PromotionController.SelectAll);
router.get("/promotion/selOne/:promotion_id", auth, PromotionController.SelectOne);
router.get("/promotion/getAll", auth, PromotionController.getAllPromotion);
router.get("/promotion/export", auth, PromotionController.ExportPromotion);
router.post("/promotion/insert", auth, PromotionController.Insert);
router.put("/promotion/update/:promotion_id", auth, PromotionController.UpdatePromotion);
router.delete("/promotion/delete/:promotion_id", auth, PromotionController.DeletePromotion);
//---- time ----
router.get("/time/selAll", auth, TimeController.SelectAll);
router.get("/time/all", auth, TimeController.SelectAlls);
router.get("/time/selBy/:branchId", auth, TimeController.SelectByBranch);
router.get("/time/selOne/:time_id", auth, TimeController.SelectOne);
router.get("/time/getAll", auth, TimeController.GetAllTime);
router.get("/time/export", auth, TimeController.ExportTime);
router.post("/time/insert", auth, TimeController.Insert);
router.put("/time/update/:time_id", auth, TimeController.UpdateTime);
router.put("/time/updateQty/:time_id", auth, TimeController.UpdateQty);
router.put("/time/updateStatus/:time_id", auth, TimeController.UpdateTimeStatus);
router.delete("/time/delete/:time_id", auth, TimeController.DeleteTime);
//---- zone ----
router.get("/zone/selAll", auth, ZoneController.SelectAll);
router.get("/zone/search", auth, ZoneController.SearchZone);
router.get("/zone/selOne/:zone_id", auth, ZoneController.SelectOne);
router.get("/zone/selBy/:time_id", auth, ZoneController.SelectBy);
router.get("/zone/getAll", auth, ZoneController.getAllZone);
router.get("/zone/export", auth, ZoneController.ExportZone);
router.post("/zone/insert", auth, ZoneController.Insert);
router.put("/zone/update/:zone_id", auth, ZoneController.UpdateZone);
router.put("/zone/updateStatus/:zone_id", auth, ZoneController.UpdateZoneStatus);
router.delete("/zone/delete/:zone_id", auth, ZoneController.DeleteZone);
//---- timefix -----
router.get("/timefix/getAll", auth, TimeFixController.GetAllTimeFix);
router.get("/timefix/search", auth, TimeFixController.SearchBy);
router.get("/timefix/selAll", auth, TimeFixController.SelectAll);
router.get("/timefix/selOne/:timefix_id", auth, TimeFixController.SelectOne);
router.post("/timefix/insert", auth, TimeFixController.Insert);
router.put("/timefix/update/:timefix_id", auth, TimeFixController.Update);
router.delete("/timefix/delete/:timefix_id", auth, TimeFixController.DeleteTimeFix);
//---- giftcard ----
router.get("/giftcard/selAll", auth, GiftCardController.SelectAll);
router.get("/giftcard/selOne/:giftcard_id", auth, GiftCardController.SelectOne);
router.get("/giftcard/getAll", auth, GiftCardController.getAllGiftCard);
router.get("/giftcard/export", auth, GiftCardController.ExportGiftCard);
router.post("/giftcard/insert", auth, GiftCardController.Insert);
router.put("/giftcard/update/:giftcard_id", auth, GiftCardController.UpdateGiftCard);
router.put("/giftcard/updateStatus/:giftcard_id", auth, GiftCardController.UpdateStatus);
router.delete("/giftcard/delete/:giftcard_id", auth, GiftCardController.DeleteGiftcard);
//---- giftcardhistory ----
router.get("/gifthistory/selAll", auth, GiftHistoryController.SelectAll);
router.get("/gifthistory/selOne/:gifthistory_id", auth, GiftHistoryController.SelectOne);
router.get("/gifthistory/getAll", auth, GiftHistoryController.getAllGiftHistory);
router.get("/gifthistory/export", auth, GiftHistoryController.ExportGiftHistory);
router.post("/gifthistory/insert", auth, GiftHistoryController.Insert);
// router.put("/gifthistory/update/:gifthistory_id", auth, GiftHistoryController.UpdateGifthistory);
router.delete("/gifthistory/delete/:gifthistory_id", auth, GiftHistoryController.DeleteGifthistory);
//---- card ----
router.get("/card/selAll", auth, CardController.SelectAll);
router.get("/card/selOne/:card_id", auth, CardController.SelectOne);
router.get("/card/getAll", auth, CardController.getAllCard);
router.post("/card/insert", auth, CardController.Insert);
router.put("/card/update/:card_id", auth, CardController.UpdateCard);
router.delete("/card/delete/:card_id", auth, CardController.DeleteCard);
//---- car ----
router.get("/car/selAll", auth, CarController.SelectAll);
router.get("/car/search", auth, CarController.SearchCar);
router.get("/car/selOne/:car_id", auth, CarController.SelectOne);
router.get("/car/selBy/:userId", auth, CarController.SelectBy);
router.get("/car/getAll", auth, CarController.getAllCar);
router.get("/car/export", auth, CarController.ExportCar);
router.post("/car/insert", auth, CarController.Insert);
router.put("/car/update/:car_id", auth, CarController.UpdateCar);
router.delete("/car/delete/:car_id", auth, CarController.DeleteCar);
//---- booking ----
router.get("/booking/selAll", auth, BookingController.SelectAll);
router.get("/booking/search", auth, BookingController.SearchBooking);
router.get("/booking/selOne/:booking_id", auth, BookingController.SelectOne);
router.get("/booking/selByUser", auth, BookingController.SelectByUser);
router.get("/booking/selByBranch/:branch_id", auth, BookingController.SelectByBranch);
router.get("/booking/selByStatus", auth, BookingController.SelectBy);
router.get("/booking/getAll", auth, BookingController.getAllBooking);
router.get("/booking/getAllByBranch/:branch_id", auth, BookingController.getAllBookingByBranch);
router.get("/booking/export", auth, BookingController.exportBooking)
router.post("/booking/insert", auth, BookingController.Insert);
router.put("/booking/update/:booking_id", auth, BookingController.Updatebooking);
router.put("/booking/updateStatus/:booking_id", auth, BookingController.UpdateBookingStatus);
router.delete("/booking/delete/:booking_id", auth, BookingController.DeleteBooking);
//----- employ ---
router.get("/employee/selAll", auth, EmployeeController.SelectAll);
router.get("/employee/getAll", auth, EmployeeController.getAllSuper);
router.get("/employee/search", auth, EmployeeController.SearchEmployee);
router.get("/employee/selOne/:employee_id", auth, EmployeeController.SelectOne);
router.get("/employee/getAll", auth, EmployeeController.getAllSuper);
router.post("/employee/insert", auth, EmployeeController.Insert);
router.put("/employee/update/:employee_id", auth, EmployeeController.Updateemployee);
router.delete("/employee/delete/:employee_id", auth, EmployeeController.Deleteemployee);
//---- branch ----
router.get("/branch/selAll", auth, BranchController.SelectAll);
router.get("/branch/getAll", auth, BranchController.getAllAdmin);
router.get("/branch/selOne/:branch_id", auth, BranchController.SelectOne);
router.get("/branch/export", auth, BranchController.ExportBranch);
router.post("/branch/insert", auth, BranchController.Insert);
router.put("/branch/update/:branch_id", auth, BranchController.Updatebranch);
router.delete("/branch/delete/:branch_id", auth, BranchController.Deletebranch);

//----- booking detail -----
router.post("/bookingDetail/insert", auth, BookingDetailController.insert);
router.get("/bookingDetail/selBy/:bookingId", auth, BookingDetailController.getByBooking);
//---- fix ----
router.get("/fix/selAll", auth, FixController.SelectAll);
router.get("/fix/search", auth, FixController.SearchFix);
router.get("/fix/selOne/:fix_id", auth, FixController.SelectOne);
router.get("/fix/selByStatus", auth, FixController.SelectBy);
router.get("/fix/getAll", auth, FixController.getAllFix);
router.get("/fix/getAllByBranch", auth, FixController.getAllFixByBranch);
router.get("/fix/export", auth, FixController.ExportFix);
router.post("/fix/insert", auth, FixController.Insert);
router.put("/fix/update/:fix_id", auth, FixController.UpdateFix);
router.put("/fix/updateStatus/:fix_id", auth, FixController.UpdateFixSuccess);
router.delete("/fix/delete/:fix_id", auth, FixController.DeleteFix);
//----- noti ----
router.post("/noti/send", auth, NotificationController.sendData);
router.post("/noti/one", auth, NotificationController.sendDataOneToOne);
export default router;