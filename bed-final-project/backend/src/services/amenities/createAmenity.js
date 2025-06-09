import { PrismaClient } from "@prisma/client";

const createAmenities = async (name) => {
  const prisma = new PrismaClient();
  const newAmenities = { name };

  const amenities = await prisma.amenity.create({
    data: newAmenities,
  });

  return amenities;
};

export default createAmenities;
