import { PrismaClient } from "@prisma/client";

const createProperty = async (
  hostId,
  title,
  description,
  location,
  pricePerNight,
  bedroomCount,
  bathRoomCount,
  maxGuestCount,
  rating,
  amenities = []
) => {
  const prisma = new PrismaClient();
  const property = await prisma.property.create({
    data: {
      host: {
        connect: { id: hostId },
      },
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      amenities:
        amenities.length > 0
          ? {
              connect: amenities.map((amenityId) => ({ id: amenityId })),
            }
          : undefined, // voorkomt fout als amenities leeg is
    },
    include: {
      amenities: true, // laat meteen de gekoppelde amenities zien
    },
  });

  return property;
};

export default createProperty;
