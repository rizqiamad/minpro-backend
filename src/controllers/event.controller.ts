import { Request, Response } from "express";
import prisma from "../prisma";

export class EventController {
  async getEvents(req: Request, res: Response) {
    try {
      const events = await prisma.event.findMany();
      res.status(200).send({ results: events });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      await prisma.event.create({ data: req.body });
      res.status(200).send({ message: "Your event has been set" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
