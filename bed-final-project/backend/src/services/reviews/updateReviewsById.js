import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateReviewById = async (id, updatedReview) => {
  const review = await prisma.review.update({
    where: { id },
    data: updatedReview,
  });

  return review;
};

export default updateReviewById;
