import { Request, Response } from "express";
import prisma from "../prisma";
import path from "path";
import { genSalt, hash, compare } from "bcrypt";
import { findUser, generateReferralCode } from "../services/user.services";
import { sign, verify } from "jsonwebtoken";
import { transporter } from "../services/mailer";
import fs from "fs";
import handlebars from "handlebars";

export class UserAuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const {
        password,
        confirmPassword,
        full_name,
        email,
        dob,
        jenis_kelamin,
        no_handphone,
        ref_code,
      } = req.body;

      // Validate passwords match
      if (password !== confirmPassword)
        throw { message: "Passwords do not match" };

      // Check if the user already exists
      const user = await findUser(full_name, email);
      if (user) throw { message: "Username or email has already been used" };

      // Hash the password
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          password: hashPassword,
          full_name,
          email,
          dob,
          jenis_kelamin,
          no_handphone,
          ref_code: null, // Clear the referral code for the new user
          refer_by: ref_code, // Save the ID of the referring user
        },
      });

      // Generate a verification token
      const payload = { id: newUser.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "24h" });

      // Verification email link
      const link = `${process.env.BASE_URL_FE}verify/user/${token}`;

      // Compile the email template
      const templatePath = path.join(
        __dirname,
        "../templates",
        "verifyUser.html"
      );
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ full_name: req.body.full_name, link });

      // Send verification email
      await transporter.sendMail({
        from: "loket.com",
        to: req.body.email,
        subject: "Selamat Datang di loket.com",
        html,
      });

      // Respond to the client
      res.status(201).send({
        message: "Registration successful, please check your email to verify",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);
      if (!user) throw { message: "Account not found" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw { message: "Incorrect password" };

      const payload = { id: user.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "24h" });

      res.status(200).send({
        message: "Login User success",
        token,
        user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { token } = req.params;
      console.log(token);

      const verifiedUser: any = verify(token, process.env.JWT_KEY!);
      console.log(verifiedUser);

      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });

      if (!user) throw new Error("User not found");

      if (user.refer_by) {
        const referringUser = await prisma.user.findFirst({
          where: { AND: [{ ref_code: user.refer_by }, { isVerified: true }] },
        });

        if (!referringUser) throw new Error("Invalid or expired referral code");

        // Add 10,000 points t the referring user
        await prisma.point.create({
          data: {
            user_id: referringUser.id,
            total: 10000,
            active: true,
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Set expiry date
          },
        });

        // Create a coupon for the verified user
        await prisma.coupon.create({
          data: {
            user_id: user.id,
            active: true,
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          },
        });
      }

      await prisma.user.update({
        where: { id: verifiedUser.id },
        data: { isVerified: true, ref_code: generateReferralCode() },
      });

      res
        .status(200)
        .send({ message: "Account has been verified and code is generated" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
