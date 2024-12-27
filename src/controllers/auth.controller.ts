import { Request, Response } from "express";
import prisma from "../prisma";
import path from "path";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.services";
import { findOrganizer } from "../services/organizer.services";
import { sign, verify } from "jsonwebtoken";
import { transporter } from "../services/mailer";
import fs, { link } from "fs";
import handlebars from "handlebars";
import crypto from "crypto";

function generateReferralCode(): string {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

//valid ref code
async function validateReferralCode(ref_code: string): Promise<boolean> {
  // Find the first user with the provided referral code
  const referByUser = await prisma.user_account.findFirst({
    where: { ref_code },
  });

  if (referByUser && referByUser.isVerify) {
    // If the user with the referral code exists and is verified, return true
    return true;
  }

  // Referral code is either invalid or the referring user is not verified
  return false;
}

export class AuthController {
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
      if (password !== confirmPassword) throw "Passwords do not match";

      // Check if the user already exists
      const user = await findUser(full_name, email);
      if (user) throw "Username or email has already been used";

      // Hash the password
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Create the new user
      const newUser = await prisma.user_account.create({
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
      const payload = { id: newUser.user_id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });

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
      if (!user) throw "Account not found";

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw "Incorrect password";

      const payload = { id: user.user_id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1m" });

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

      const user = await prisma.user_account.findUnique({
        where: { user_id: verifiedUser.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.refer_by) {
        const referringUser = await prisma.user_account.findFirst({
          where: { AND: [{ ref_code: user.refer_by }, { isVerify: true }] },
        });

        if (!referringUser) {
          throw new Error("Invalid or expired referral code");
        }

        // Add 10,000 points t the referring user
        await prisma.points.create({
          data: {
            user_id: referringUser.user_id,
            total: 10000,
            active: true,
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Set expiry date
          },
        });
      }

      await prisma.user_account.update({
        where: { user_id: verifiedUser.id },
        data: { isVerify: true, ref_code: generateReferralCode() },
      });

      // Create a coupon for the verified user
      await prisma.coupon.create({
        data: {
          user_id: user.user_id, // Correctly set user_id for the coupon
          active: true, // Coupon is active by default
        },
      });

      res
        .status(200)
        .send({ message: "Account has been verified and code is generated" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  // auth organiser
  async registerOrganizer(req: Request, res: Response) {
    try {
      const { password, confirmPassword, organizer_name, email, no_handphone } =
        req.body;

      if (password != confirmPassword) throw "Password not match";

      const user = await findOrganizer(organizer_name, email);
      if (user) throw "organizer name or email has been used";

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newOrganizer = await prisma.organizer_account.create({
        data: { password: hashPassword, organizer_name, email, no_handphone },
      });

      const payload = { id: newOrganizer.organizer_id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });

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
      const organizer = await prisma.organizer_account.findFirst({
        where: { OR: [{ organizer_name: data }, { email: data }] },
      });
      if (!organizer) throw "Organizer not found";

      const isValidPass = await compare(password, organizer.password);
      if (!isValidPass) throw "Incorrect password";

      const payload = { id: organizer.organizer_id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });

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
      await prisma.organizer_account.update({
        data: { isVerify: true },
        where: { organizer_id: verifiedOrganizer.id },
      });

      res.status(200).send({ message: "Account has been verified" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
