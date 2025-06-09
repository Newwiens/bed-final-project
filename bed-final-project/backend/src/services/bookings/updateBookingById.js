import { PrismaClient } from "@prisma/client";

const updateBookById = async (id, updatedBooking) => {
  const prisma = new PrismaClient();

  const { userId, propertyId, ...rest } = updatedBooking;

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...rest,
      //Dit is de naam van de relatie zoals gedefinieerd in het Prisma-schema
      //user User @relation(...)
      user: userId
        ? {
            //connect: voor many-to-one relatie
            //als set: many-to-many en met .map() uit loopen

            connect: { id: userId },
          }
        : undefined,
      property: propertyId
        ? {
            connect: { id: propertyId },
          }
        : undefined,
    },
  });

  return booking;
};

export default updateBookById;
