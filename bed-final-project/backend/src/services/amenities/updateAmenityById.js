import { PrismaClient } from "@prisma/client";

const updateAmenityyById = async (id, updatedAmenity) => {
  const prisma = new PrismaClient();
  const amenities = await prisma.amenity.updateMany({
    where: { id },
    data: updatedAmenity,
  });

  return amenities.count > 0 ? id : null;
};

export default updateAmenityyById;
