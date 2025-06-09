import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPropertyById = async (id) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          aboutMe: true,
        },
      },
      amenities: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return property;
};

export default getPropertyById;
