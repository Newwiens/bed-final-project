import { PrismaClient } from "@prisma/client";

const getBookings = async (userId) => {
  const prisma = new PrismaClient();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      user: {
        select: {
          name: true, // ✅ User eerst
          email: true,
          phoneNumber: true,
        },
      },
      checkinDate: true,
      checkoutDate: true,
      numberOfGuests: true,
      totalPrice: true,
      bookingStatus: true,

      property: {
        select: {
          title: true,
          location: true,
          pricePerNight: true,
        },
      },
    },
  });

  return bookings;
};

export default getBookings;
