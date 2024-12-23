import { Request, Response } from "express";
import prisma from "../prisma";
import { requestBody } from "../types/reqBody";
const midtransClient = require("midtrans-client");

export class TransactionController {
  async createTransaction(req: Request<{},   requestBody>, res: Response) {
    try {
      const userId = 1;
      const { base_price, final_price, ticketCart } = req.body;
      const expiresAt = new Date(new Date().getTime() + 10 * 60000);

      const transactionId = await prisma.$transaction(async (prisma) => {
        const { id } = await prisma.transaction.create({
          data: { user_id: userId, base_price, final_price, expiresAt },
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
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: `${process.env.MID_SERVER_KEY}`,
      });

      const parameters = {
        transaction_details: req.body,
      };

      const transaction = await snap.createTransaction(parameters);
      res.status(200).send({ result: transaction.token });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
