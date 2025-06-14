import { PrismaClient } from "@prisma/client";

const updateHostById = async (id, updatedHost) => {
  const prisma = new PrismaClient();
  const host = await prisma.host.update({
    where: { id },
    data: updatedHost,
  });

  return host;
  //.count > 0 ? id : null;
};

export default updateHostById;
