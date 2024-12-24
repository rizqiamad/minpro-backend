import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

// bagian organizer_account
export class OrganizerController {

  async getOrganizers(req: Request, res: Response) {
    try {
        const filter: Prisma.organizer_accountWhereInput = {}
        const { search } = req.query;
      if (search) {
        filter.OR = [
          { organizer_name: { contains: search as string } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const organizers = await prisma.organizer_account.findMany();
      res.status(200).send({ organizers });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getOrganizerId(req: Request, res: Response) {
    try {
      const organizer = await prisma.organizer_account.findUnique({
        where: { organizer_id: req.organizer?.id },
      });
      res.status(200).send({ organizer });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createOrganizer(req: Request, res: Response) {
    try {
      await prisma.organizer_account.create({ data: req.body });
      res.status(201).send("Organizer Created");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  
  async editOrganizer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.organizer_account.update({
        data: req.body,
        where: { organizer_id: +id }
      });
      res.status(200).send("Organizer updated");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async deleteOrganizer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.organizer_account.delete({ where: { organizer_id: +id } });
      res.status(200).send("Organizer deleted");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
