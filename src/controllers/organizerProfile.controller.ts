import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class OrganizerProfileController {
  async getOrganizers(req: Request, res: Response) {
    try {
      const filter: Prisma.OrganizerWhereInput = {};
      const { search } = req.query;
      if (search) {
        filter.OR = [
          { name: { contains: search as string } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const organizers = await prisma.organizer.findMany();
      res.status(200).send({ organizers });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getOrganizerId(req: Request, res: Response) {
    try {
      const organizer = await prisma.organizer.findUnique({
        where: { id: req.organizer?.id },
      });
      res.status(200).send({ organizer });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async editOrganizer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.organizer.update({
        data: req.body,
        where: { id: +id },
      });
      res.status(200).send("Organizer updated");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getEventsOrganizer(req: Request, res: Response) {
    try {
      const { type } = req.query;
      if (req.user) throw { message: "User is not granted" };

      const filter: Prisma.EventWhereInput = {};
      if (type === "active") {
        filter.AND = [
          { Ticket: { some: {} } },
          { end_date: { gt: new Date() } },
        ];
      } else if (type === "draft") {
        filter.AND = [
          { Ticket: { none: {} } },
          { end_date: { gt: new Date() } },
        ];
      } else if (type === "unactive") {
        filter.end_date = { lt: new Date() };
      }

      const events = await prisma.event.findMany({
        where: { organizer_id: req.organizer?.id, ...filter },
        select: {
          id: true,
          name: true,
          image: true,
          start_date: true,
          end_date: true,
          type: true,
        },
      });
      res.status(200).send({ result: events });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
