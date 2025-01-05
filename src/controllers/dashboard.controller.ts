import { Request, Response } from "express";
import prisma from "../prisma";
import { FormatMonth } from "../helpers/monthCalendar";
import { Prisma } from "@prisma/client";

export class GraphController {
  async getActiveEvent(req: Request, res: Response) {
    const id = req.organizer?.id;
    interface iEvent {
      month: string;
      active_event: number;
    }
    try {
      const event = await prisma.event.findMany({
        where: { organizer_id: id },
      });
      let months = [];
      let dataChart: iEvent[] = [];
      for (const item of event) {
        const month = new Date(item.start_date).getMonth();
        months.push(month);
        months.sort((a, b) => a - b);
      }
      for (const item of months) {
        if (!JSON.stringify(dataChart).includes(FormatMonth(item))) {
          dataChart.push({ month: FormatMonth(item), active_event: 1 });
        } else {
          dataChart[dataChart.length - 1].active_event += 1;
        }
      }
      console.log(dataChart);
      res.status(200).send({ result: dataChart });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getTransactionGraph(req: Request, res: Response) {
    try {
      const filter: Prisma.TransactionWhereInput = {
        AND: [
          { status: "success" },
          {
            Ticket_Transaction: {
              some: { ticket: { events: { organizer_id: req.organizer?.id } } },
            },
          },
        ],
      };

      const trans = await prisma.transaction.findMany({
        where: filter,
        select: { final_price: true, createdAt: true },
      });
      res.status(200).send({ result: trans });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getCourses(req: Request, res: Response) {
    try {
      const id = req.organizer?.id;
      const event = await prisma.event.findMany({
        where: { organizer_id: id },
      });
      const eventTotal: number = event.length;
      console.log(eventTotal);

      res.status(200).send({ eventTotal });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getTotalTransaction(req: Request, res: Response) {
    try {
      const filter: Prisma.TransactionWhereInput = {
        AND: [
          { status: "success" },
          {
            Ticket_Transaction: {
              some: { ticket: { events: { organizer_id: req.organizer?.id } } },
            },
          },
        ],
      };

      const trans = await prisma.transaction.aggregate({
        where: filter,
        _count: { _all: true },
      });
      res.status(200).send({ result: trans._count._all });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
