import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js"
export default class TimeFixController {
  static async SearchBy(req, res) {
    try {
      const search = req.query.search;
      if (!search) return SendError(res, 400, EMessage.BadRequest);
      const data = await prisma.timeFix.findMany({
        include: {
          time: true,
          zone: true,
        },
        where: {
          time: {
            is: {
              OR: [
                { time: { contains: search } },
                { day: { contains: search } },
              ],
            },
          },
        },
      });
      if (!data.length) return SendError(res, 404, EMessage.NotFound);
      return SendSuccess(res, SMessage.Search, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }

  static async GetAllTimeFix(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        start,
        end,
        search,
      } = req.query;

      const query = {};
      if (search) {
        query['OR'] = [
          { zone: { zoneName: { contains: search } } },
          { time: { time: { contains: search } } },
        ];
      }


      if (start || end) {
        query['createdAt'] = {};
        if (start) query['createdAt']['gte'] = new Date(start);
        if (end) query['createdAt']['lt'] = new Date(end);
      }

      const timeFix = await prisma.timeFix.findMany({
        where: query,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          zone: true,
          time: true,
          branch: true // new
        },
      });
      if (!timeFix.length) return SendError(res, 404, EMessage.NotFound);
      const count = await prisma.timeFix.count({ where: query });
      const totalPage = Math.ceil(count / parseInt(limit));
      return SendSuccess(res, SMessage.SelectAll, { data: timeFix, totalPage });
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }

  static async SelectAll(req, res) {
    try {
      const data = await prisma.timeFix.findMany({
        include: {
          zone: true, time: true, branch: true // new
        }
      });
      if (!data.length) return SendError(res, 404, EMessage.NotFound);
      return SendSuccess(res, SMessage.SelectAll, data)
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const timefix_id = req.params.timefix_id;
      const data = await prisma.timeFix.findFirst({
        where: { timefix_id: timefix_id },
        include: {
          zone: true, time: true, branch: true // new
        }
      });
      if (!data) return SendError(res, 404, EMessage.NotFound);
      return SendSuccess(res, SMessage.SelectOne, data)
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Insert(req, res) {
    try {
      const { timeId, zoneId, branchId } = req.body
      const validate = ValidateData({ timeId, zoneId, branchId });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(','));
      }

      const data = await prisma.timeFix.create({
        data: {
          timeId, zoneId, branchId,
        }
      })
     

      return SendCreate(res, SMessage.Insert, data);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Update(req, res) {
    try {
      const timefix_id = req.params.timefix_id;
      const { timeId, zoneId, branchId } = req.body
      const validate = ValidateData({ timeId, zoneId, branchId });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(','));
      }
      const data = await prisma.timeFix.update({
        data: {
          timeId, zoneId, branchId,
        },
        where: {
          timefix_id: timefix_id
        }
      })
      return SendCreate(res, SMessage.Update, data);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async DeleteTimeFix(req, res) {
    try {
      const timefix_id = req.params.timefix_id;
      const data = await prisma.timeFix.delete({ where: { timefix_id: timefix_id } })
      if (!data) return SendError(res, 404, EMessage.EDelete);
      return SendSuccess(res, SMessage.Delete)
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error)
    }
  }
}