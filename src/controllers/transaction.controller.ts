import { Request, Response } from "express";
import prisma from "../prisma";
import { requestBody } from "../types/reqBody";
const midtransClient = require("midtrans-client");

export class TransactionController {
  async createTransaction(req: Request<{}, {}, requestBody>, res: Response) {
    try {
      const userId = req.user?.id;
      const { base_price, coupon, final_price, ticketCart } = req.body;
      console.log(req.body);

      const transactionId = await prisma.$transaction(async (prisma) => {
        if (coupon) {
          const coupon = await prisma.coupon.findFirst({
            where: { user_id: userId },
          });
          await prisma.coupon.update({
            where: { id: coupon?.id },
            data: { active: false },
          });
        }
        const { id } = await prisma.transaction.create({
          data: {
            user_id: userId!,
            base_price,
            coupon,
            final_price,
            expiresAt: new Date(new Date().getTime() + 30 * 60000),
          },
        });

        await Promise.all(
          ticketCart.map(async (item) => {
            if (item.qty > item.ticket.seats) {
              throw new Error(
                `Insufficient seats for ticket ID: ${item.ticket.id}`
              );
            }
            await prisma.ticketTransaction.create({
              data: {
                transaction_id: id,
                ticket_id: item.ticket.id,
                quantity: item.qty,
                subtotal: item.qty * item.ticket.price,
              },
            });
            await prisma.ticket.update({
              where: { id: item.ticket.id },
              data: { seats: { decrement: item.qty } },
            });
          })
        );
        return id;
      });

      res
        .status(200)
        .send({ message: "Transaction created", order_id: transactionId });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getTransactionId(req: Request, res: Response) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: +req.params.id },
        select: {
          expiresAt: true,
          coupon: true,
          base_price: true,
          final_price: true,
          Ticket_Transaction: {
            select: {
              quantity: true,
              subtotal: true,
              ticket: {
                select: {
                  name: true,
                  price: true,
                  events: {
                    select: {
                      name: true,
                      image: true,
                      start_date: true,
                      end_date: true,
                      start_time: true,
                      end_time: true,
                      location: {
                        select: {
                          name_place: true,
                          address: true,
                          city: {
                            select: {
                              city: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      res.status(200).send({ result: transaction });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getSnapToken(req: Request, res: Response) {
    try {
      const { order_id } = req.body;
      const item_details = [];

      const checkTransaction = await prisma.transaction.findUnique({
        where: { id: order_id },
        select: { status: true, expiresAt: true, coupon: true },
      });
      if (checkTransaction?.status === "canceled")
        throw "You cannot continue transaction, as your delaying transaction";

      const resMinutes =
        new Date(`${checkTransaction?.expiresAt}`).getTime() -
        new Date().getTime();

      const ticketTransaction = await prisma.ticketTransaction.findMany({
        where: { transaction_id: order_id },
        include: {
          ticket: {
            select: {
              name: true,
            },
          },
        },
      });

      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });

      for (const item of ticketTransaction) {
        item_details.push({
          id: item.ticket_id,
          price: item.subtotal / item.quantity,
          quantity: item.quantity,
          name: item.ticket.name,
        });
      }

      if (checkTransaction?.coupon) {
        const coupon = await prisma.coupon.findFirst({
          where: { user_id: req.user?.id },
        });
        item_details.push({
          id: coupon?.id,
          price: -req.body.base_price / 10,
          quantity: 1,
          name: "Coupon",
        });
      }

      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: `${process.env.MID_SERVER_KEY}`,
      });

      const parameters = {
        transaction_details: req.body,
        customer_details: {
          first_name: user?.full_name,
          email: user?.email,
          phone: user?.no_handphone,
        },
        item_details,
        page_expiry: {
          duration: new Date(resMinutes).getMinutes(),
          unit: "minutes",
        },
        expiry: {
          unit: "minutes",
          duration: new Date(resMinutes).getMinutes(),
        },
      };

      const transaction = await snap.createTransaction(parameters);
      res.status(200).send({ result: transaction.token });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async midtransWebHook(req: Request, res: Response) {
    try {
      const { transaction_status, order_id } = req.body;
      const statusTransaction =
        transaction_status === "settlement"
          ? "success"
          : transaction_status === "pending"
          ? "pending"
          : "canceled";

      if (statusTransaction === "canceled") {
        const tickets = await prisma.ticketTransaction.findMany({
          where: { transaction_id: +order_id },
          select: {
            quantity: true,
            ticket_id: true,
          },
        });

        for (const item of tickets) {
          await prisma.ticket.update({
            where: { id: item.ticket_id },
            data: { seats: { increment: item.quantity } },
          });
        }
      }

      await prisma.transaction.update({
        where: { id: +order_id },
        data: {
          status: statusTransaction,
        },
      });
      res.status(200).send({ message: "Your transaction success" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
