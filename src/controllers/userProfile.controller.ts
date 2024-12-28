import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class UserProfileController {
  async getUsers(req: Request, res: Response) {
    try {
      console.log(req.user)
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
        where: { id: req.user?.id }
      });
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.update({
        data: req.body,
        where: { id: +id }
      });
      res.status(200).send("user updated");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
