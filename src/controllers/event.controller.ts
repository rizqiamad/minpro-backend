import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../services/cloudinary";

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
      if (!req.file) throw { message: "Image does'nt exist" };
      const { secure_url } = await cloudinaryUpload(req.file, "events");
      console.log(secure_url);
      req.body.image = secure_url;
      // await prisma.event.create({ data: req.body });
      // res.status(200).send({ message: "Your event has been set" });
      res.status(200).send(req.body);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
