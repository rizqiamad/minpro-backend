import { Request, Response } from "express";
import prisma from "../prisma";

export class MetadataController {
  async getEventId(req: Request, res: Response) {
    try {
      const events = await prisma.event.findUnique({
        where: { id: req.params.id },
        select: {
          name: true,
          image: true,
        },
      });
      res.status(200).send({ result: events });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
