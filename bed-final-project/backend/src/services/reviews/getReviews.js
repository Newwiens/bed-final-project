import { PrismaClient } from "@prisma/client";

const getReview = async () => {
  const prisma = new PrismaClient();
  const reviews = await prisma.review.findMany();

  return reviews;
};

export default getReview;
