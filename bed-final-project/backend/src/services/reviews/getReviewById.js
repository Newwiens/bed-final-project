import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getReviewById = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      rating: true,
      comment: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          pricePerNight: true,
        },
      },
    },
  });

  return review;
};

export default getReviewById;
