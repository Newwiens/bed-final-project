import { PrismaClient } from "@prisma/client";

const updatePropertyById = async (id, updatedProperties) => {
  const prisma = new PrismaClient();

  const { hostId, ...rest } = updatedProperties;

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...rest, // Spread overige velden (title, description, etc.)
      host: hostId
        ? {
            connect: { id: hostId }, // Koppel aan bestaande Host
          }
        : undefined, // Geen update als hostId niet is meegegeven
    },
  });
  return property;
};

export default updatePropertyById;
