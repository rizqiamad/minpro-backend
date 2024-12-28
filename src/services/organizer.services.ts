import prisma from "../prisma";

export const findOrganizer = async (organizer_name: string, email: string) => {
  const user = await prisma.organizer.findFirst({
    where: { OR: [{ name: organizer_name }, { email: email }] },
  });

  return user;
};
