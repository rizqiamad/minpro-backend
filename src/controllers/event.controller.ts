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
      req.body.image = secure_url;

      const { city, name_place, address, ...restBody } = req.body;
      const { city_id } = await prisma.city.create({ data: { city } });

      const loc = await prisma.location.create({
        data: { name_place, address, city_id },
      });

      const oranizer_id = 1

      await prisma.event.create({ data: {...restBody, location_id: loc.location_id, oranizer_id} });
      res.status(200).send({ message: "Your event has been set" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
