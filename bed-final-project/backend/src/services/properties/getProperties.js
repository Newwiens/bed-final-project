import { PrismaClient } from "@prisma/client";

const getProperties = async (query) => {
  const prisma = new PrismaClient();

  let { location, pricePerNight, amenities } = query;

  // Maak trims en lowercase zodat je niet per ongeluk op spaties/newlines faalt
  if (location) location = location.toLowerCase().trim();
  if (amenities) amenities = amenities.toLowerCase().trim();

  const where = {};

  if (pricePerNight) {
    const price = parseFloat(pricePerNight);
    if (!isNaN(price)) {
      where.pricePerNight = { lte: price };
    }
  }

  // We halen eerst zonder locatie en amenities filter
  let properties = await prisma.property.findMany({
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

  // Dan filteren we locatie case-insensitive in JS
  if (location) {
    properties = properties.filter((property) =>
      property.location.toLowerCase().includes(location)
    );
  }

  // Dan filteren we amenities ook case-insensitive in JS
  if (amenities) {
    properties = properties.filter((property) =>
      property.amenities.some((a) => a.name.toLowerCase() === amenities)
    );
  }

  return properties;
};

export default getProperties;
