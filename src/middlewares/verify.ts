import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { OrganizerPayload, UserPayload } from "../custom";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw { message: "Unauthorised to enter" };

    const verifiedUser = verify(token, "reglogin-auth");
    req.user = verifiedUser as UserPayload;

    const verifiedOrganizer = verify(token, "reglogin-auth");
    req.organizer = verifiedOrganizer as OrganizerPayload;

    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
