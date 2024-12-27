import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

// bagian user_account
export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      console.log(req.user)
      const filter: Prisma.user_accountWhereInput = {};
      const { search } = req.query;
      if (search) {
        filter.OR = [
          { full_name: { contains: search as string } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const users = await prisma.user_account.findMany({ where: filter });
      res.status(200).send({ users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const user = await prisma.user_account.findUnique({
        where: { user_id: req.user?.id }
      });
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      await prisma.user_account.create({ data: req.body });
      res.status(201).send("User Created");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user_account.update({
        data: req.body,
        where: { user_id: +id }
      });
      res.status(200).send("user updated");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user_account.delete({ where: { user_id: +id } });
      res.status(200).send("user deleted");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
