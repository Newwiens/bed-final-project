import { Prisma, PrismaClient } from "@prisma/client";

//Users op ID uitlezen
const getUserById = async (id) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
};

export default getUserById;
