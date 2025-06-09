import { PrismaClient } from "@prisma/client";

/*
- Hij haalt data op uit de database (met Prisma).
- Hij geeft die data terug aan degene die de functie aanroept.
- Maar hij stuurt die data niet automatisch naar een webpagina of API-response.

*/

//Alle users model data uitlezen
const getHosts = async (query) => {
  const prisma = new PrismaClient();

  const allowedFields = ["username", "name", "email", "phoneNumber"];

  const where = {};

  for (const key in query) {
    if (
      allowedFields.includes(key) &&
      typeof query[key] === "string" &&
      query[key].trim() !== ""
    ) {
      where[key] = {
        contains: query[key],
      };
    }
  }

  const hosts = await prisma.host.findMany({
    where,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
    },
  });

  return hosts;
};

export default getHosts;
