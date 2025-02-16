import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../services/cloudinary";
import { Prisma } from "../../prisma/generated/client";

export class EventController {
  async getEvents(req: Request, res: Response) {
    try {
      const limit = 8;
      const { sorts = "asc", page = "1", cat, search, c } = req.query;
      const filter: Prisma.EventWhereInput = {
        AND: [{ Ticket: { some: {} } }, { end_date: { gte: new Date() } }],
      };

      if (cat) filter.category = cat as Prisma.EnumEventCategoryFilter;
      if (search) filter.name = { contains: `${search}`, mode: "insensitive" };
      if (c) {
        filter.location = {
          city: { city: { equals: `${c}`, mode: "insensitive" } },
        };
      }

      const totalEvent = await prisma.event.aggregate({
        where: filter,
        _count: { _all: true },
      });
      const total_page = Math.ceil(totalEvent._count._all / +limit);

      const events = await prisma.event.findMany({
        where: filter,
        take: limit,
        skip: +limit * (+page - 1),
        orderBy: { start_date: sorts as Prisma.SortOrder },
        select: {
          id: true,
          name: true,
          image: true,
          start_date: true,
          end_date: true,
          type: true,
          organizer: {
            select: {
              name: true,
              avatar: true,
            },
          },
          Ticket: {
            select: {
              price: true,
            },
            orderBy: {
              price: "asc",
            },
            take: 1,
          },
        },
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
      if (req.user) throw { message: "User is not granted" };
      const { secure_url } = await cloudinaryUpload(req.file, "events");
      req.body.image = secure_url;

      const { city, name_place, address, ...restBody } = req.body;
      console.log(req.body);

      let findCity = await prisma.city.findFirst({
        where: { city: { equals: city, mode: "insensitive" } },
      });
      let newCity = false;
      if (!findCity) {
        findCity = await prisma.city.create({
          data: { city: `${city[0].toUpperCase()}${city.slice(1)}` },
        });
        newCity = true;
      }

      let findLocation = await prisma.location.findFirst({
        where: { address: { equals: address, mode: "insensitive" } },
      });
      if (findLocation?.name_place !== name_place || !findLocation || newCity) {
        findLocation = await prisma.location.create({
          data: { name_place, address, city_id: findCity.id },
        });
      }

      const organizer_id = req.organizer?.id;

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

  async getEventDetail(req: Request, res: Response) {
    try {
      const { end_date, type } = req.query;
      const eventSelect: Prisma.EventSelect = {
        name: true,
        image: true,
        start_date: true,
        end_date: true,
        start_time: true,
        end_time: true,
        location: {
          select: {
            name_place: true,
            address: true,
            city: {
              select: {
                city: true,
              },
            },
          },
        },
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        description: true,
        terms_condition: true,
      };
      const event = await prisma.event.findUnique({
        where: { id: req.params.id },
        select: Number(type)
          ? { type: true }
          : Number(end_date)
          ? { end_date: true }
          : eventSelect,
      });
      res.status(200).send({ result: event });
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

  async getEventsDisplay(req: Request, res: Response) {
    try {
      const filter: Prisma.EventWhereInput = {
        AND: [{ Ticket: { some: {} } }, { end_date: { gte: new Date() } }],
      };

      const events = await prisma.event.findMany({
        take: 5,
        where: filter,
        select: {
          id: true,
          name: true,
          image: true,
          start_date: true,
          end_date: true,
          type: true,
          organizer: {
            select: {
              name: true,
              avatar: true,
            },
          },
          Ticket: {
            select: {
              price: true,
            },
            orderBy: {
              price: "asc",
            },
            take: 1,
          },
        },
      });

      res.status(200).send({ result: events });
    } catch (err) {
      console.log(err);
      res.status(200).send(err);
    }
  }
}
