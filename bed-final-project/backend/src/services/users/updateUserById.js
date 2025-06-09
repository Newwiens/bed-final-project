import { PrismaClient } from "@prisma/client";

const updateUserById = async (id, userUpToDate) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.updateMany({
    where: { id },
    data: userUpToDate,
  });

  return user.count > 0 ? id : null;
};

export default updateUserById;
