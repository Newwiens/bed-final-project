import { PrismaClient } from "@prisma/client";

const getAmenityById = async (id) => {
  const prisma = new PrismaClient();

  const amenities = await prisma.amenity.findUnique({
    where: { id },
  });

  return amenities;
};

export default getAmenityById;
