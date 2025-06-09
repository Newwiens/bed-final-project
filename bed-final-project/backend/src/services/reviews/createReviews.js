import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createReview = async ({ userId, propertyId, rating, comment }) => {
  const newReview = await prisma.review.create({
    data: {
      userId,
      propertyId,
      rating,
      comment,
    },
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
        },
      },
    },
  });

  return newReview;
};

export default createReview;
