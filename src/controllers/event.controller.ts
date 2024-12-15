import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../services/cloudinary";
import { Prisma } from "@prisma/client";

export class EventController {
  async getEvents(req: Request, res: Response) {
    try {
      const limit = 8;
      const { sorts = "asc", page = 1, cat } = req.query;
      const filter: Prisma.EventWhereInput = {};

      if (cat) {
        filter.category = cat as Prisma.EnumEventCategoryFilter
      }

      const totalEvent = await prisma.event.aggregate({
        _count: { _all: true },
      });
      const total_page = Math.ceil(totalEvent._count._all / +limit);

      const events = await prisma.event.findMany({
        where: filter,
        take: limit,
        skip: +limit * (+page - 1),
        orderBy: { start_date: sorts as any },
        select: {
          id: true,
          name: true,
          image: true,
          start_date: true,
          end_date: true,
          organizer: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      });
      res.status(200).send({ total_page, page, result: events });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Image does'nt exist" };
      const { secure_url } = await cloudinaryUpload(req.file, "events");
      req.body.image = secure_url;

      const { city, name_place, address, ...restBody } = req.body;

      let findCity = await prisma.city.findFirst({ where: { city } });
      if (!findCity) {
        findCity = await prisma.city.create({ data: { city } });
      }

      let findLocation = await prisma.location.findFirst({
        where: { address },
      });
      if (findLocation?.name_place !== name_place || !findLocation) {
        findLocation = await prisma.location.create({
          data: { name_place, address, city_id: findCity.id },
        });
      }

      const organizer_id = 1;

      if (restBody.coupon_seat) {
        restBody.coupon_seat = Number(restBody.coupon_seat);
      }

      const { id } = await prisma.event.create({
        data: { ...restBody, location_id: findLocation.id, organizer_id },
      });
      res
        .status(200)
        .send({ message: "Your event has been set", event_id: id });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getEventId(req: Request, res: Response) {
    try {
      const event = await prisma.event.findUnique({
        where: { id: req.params.id },
      });
      res.status(200).send({ result: event });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
