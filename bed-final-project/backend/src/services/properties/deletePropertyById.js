import { PrismaClient } from "@prisma/client";

const deletePropertyById = async (id) => {
  const prisma = new PrismaClient();
  const properties = await prisma.property.deleteMany({
    where: { id },
  });

  return properties.count > 0 ? id : null;
};

export default deletePropertyById;
