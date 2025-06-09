import { Prisma, PrismaClient } from "@prisma/client";

//Users op ID uitlezen
const getHostById = async (id) => {
  const prisma = new PrismaClient();
  const host = await prisma.host.findUnique({
    where: { id },
  });

  return host;
};

export default getHostById;
