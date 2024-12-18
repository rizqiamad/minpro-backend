import { Request, Response } from "express";
import prisma from "../prisma";

export class TicketController {
  async getTickets(req: Request, res: Response) {
    try {
      const tickets = await prisma.ticket.findMany({
        where: { event_id: req.params.eventId },
      });
      res.status(200).send({ result: tickets });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createTicket(req: Request, res: Response) {
    try {
      req.body.event_id = req.params.eventId;
      await prisma.ticket.create({ data: req.body });
      res.status(200).send({ message: "Ticket has been created" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
