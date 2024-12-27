import prisma from "../prisma";

export const findUser = async (full_name: string, email: string) => {
  const user = await prisma.user_account.findFirst({
    where: { OR: [{ full_name: full_name }, { email: email }] },
  });

  return user
};
