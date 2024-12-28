import prisma from "../prisma";
import crypto from "crypto";

export const findUser = async (full_name: string, email: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ full_name: full_name }, { email: email }] },
  });

  return user
};

export function generateReferralCode(): string {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}