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
}