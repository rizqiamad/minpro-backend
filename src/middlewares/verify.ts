import { NextFunction, Request, Response } from "express";
import { RoleIdJwtPayload, verify } from "jsonwebtoken";
import { IPayload } from "../custom";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw { message: "Unauthorized to enter" };

    const verified = <RoleIdJwtPayload>verify(token, process.env.JWT_KEY!);
    if (verified.role === "user") req.user = verified as IPayload;
    else req.organizer = verified as IPayload;

    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
