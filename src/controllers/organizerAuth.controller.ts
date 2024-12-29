import { Request, Response } from "express";
import path from "path";
import { genSalt, hash, compare } from "bcrypt";
import { findOrganizer } from "../services/organizer.services";
import { sign, verify } from "jsonwebtoken";
import { transporter } from "../services/mailer";
import fs from "fs";
import handlebars from "handlebars";
import prisma from "../prisma";

export class OrganizerAuthController {
  async registerOrganizer(req: Request, res: Response) {
    try {
      const { password, confirmPassword, organizer_name, email, no_handphone } =
        req.body;

      if (password != confirmPassword) throw "Password not match";

      const user = await findOrganizer(organizer_name, email);
      if (user) throw "organizer name or email has been used";

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newOrganizer = await prisma.organizer.create({
        data: {
          password: hashPassword,
          name: organizer_name,
          email,
          no_handphone,
        },
      });

      const payload = { id: newOrganizer.id, role: "organizer" };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "24h" });

      const link = `${process.env.BASE_URL_FE}verify/organizer/${token}`;

      const templatePath = path.join(
        __dirname,
        "../templates",
        "verifyOrganizer.html"
      );
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        organizer_name: req.body.organizer_name,
        link,
      });

      await transporter.sendMail({
        from: "loket.com",
        to: email,
        subject: "Welcome to loket.com",
        html,
      });

      res
        .status(201)
        .send({ message: "Register User success, check your email to verify" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async loginOrganizer(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const organizer = await prisma.organizer.findFirst({
        where: { OR: [{ name: data }, { email: data }] },
      });
      if (!organizer) throw { message: "Organizer not found" };
      if (!organizer.isVerified)
        throw { message: "Your account is not verified yet" };

      const isValidPass = await compare(password, organizer.password);
      if (!isValidPass) throw { message: "Incorrect password" };

      const payload = { id: organizer.id, role: "organizer" };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "24h" });

      res.status(200).send({
        message: "Login Organizer success",
        token,
        organizer,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async verifyOrganizer(req: Request, res: Response) {
    try {
      const { token } = req.params;
      console.log(token);

      const verifiedOrganizer: any = verify(token, process.env.JWT_KEY!);
      await prisma.organizer.update({
        data: { isVerified: true },
        where: { id: verifiedOrganizer.id },
      });

      res.status(200).send({ message: "Account has been verified" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
