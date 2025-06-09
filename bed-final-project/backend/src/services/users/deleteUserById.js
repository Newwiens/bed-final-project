import { PrismaClient } from "@prisma/client";

const deleteUserById = async (id) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.deleteMany({
    where: { id },
  });

  return user.count > 0 ? id : null;
  /*
  - Als user.count groter is dan 0, dan is er ten minste één gebruiker verwijderd
    user.count > 0 → geef id terug
  - Als user.count gelijk is aan 0, niets is verwijderd, dan geeft null terug
    Anders (dus als user.count <= 0, oftewel 0) → geef null terug
    ----------------------
    Langer vorm logica (klassiek)
    if (user.count > 0) {
        return id;
    } else {
        return null;
    }
 */
};

export default deleteUserById;
