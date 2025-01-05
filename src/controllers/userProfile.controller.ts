import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class UserProfileController {
  async getUsers(req: Request, res: Response) {
    try {
      console.log(req.user);
      const filter: Prisma.UserWhereInput = {};
      const { search } = req.query;
      if (search) {
        filter.OR = [
          { full_name: { contains: search as string } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const users = await prisma.user.findMany({ where: filter });
      res.status(200).send({ users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getEventsUser(req: Request, res: Response) {
    try {
      if (req.organizer) throw { message: "Organizer is not granted" };

      const filter: Prisma.EventWhereInput = {};
      filter.Ticket = {
        some: {
          Ticket_Transaction: {
            some: {
              transaction: {
                AND: [{ user_id: req.user?.id }, { status: "success" }],
              },
            },
          },
        },
      };
      const { type } = req.query;
      if (type === "active") {
        filter.end_date = {
          gt: new Date(),
        };
      } else if (type === "unactive") {
        filter.end_date = {
          lt: new Date(),
        };
      }

      const events = await prisma.event.findMany({
        where: filter,
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

  async getTicketsUser(req: Request, res: Response) {
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          AND: [
            { event_id: req.params.id },
            {
              Ticket_Transaction: {
                some: {
                  transaction: {
                    AND: [{ user_id: req.user?.id }, { status: "success" }],
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
        },
      });
      res.status(200).send({ result: tickets });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getAmountTicketsUser(req: Request, res: Response) {
    try {
      const amountTickets = await prisma.ticketTransaction.aggregate({
        where: {
          AND: [
            {
              transaction: {
                AND: [{ user_id: req.user?.id }, { status: "success" }],
              },
            },
            { ticket_id: +req.params.id },
          ],
        },
        _sum: { quantity: true },
      });
      res.status(200).send({ result: amountTickets._sum.quantity });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserCoupon(req: Request, res: Response) {
    try {
      const coupon = await prisma.coupon.findFirst({
        where: {
          AND: [
            { user_id: req.user?.id },
            { expiresAt: { gt: new Date() } },
            { active: true },
          ],
        },
        select: { active: true },
      });
      res.status(200).send({ result: coupon });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
