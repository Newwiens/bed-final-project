import { PrismaClient } from "@prisma/client";

const deleteHostById = async (hostId) => {
  const prisma = new PrismaClient();
  try {
    // Zet hostId op null voor alle gekoppelde Properties
    await prisma.property.updateMany({
      where: { hostId: hostId },
      data: { hostId: null },
    });

    // Verwijder de Host
    const deletedHost = await prisma.host.delete({
      where: { id: hostId },
    });

    return deletedHost;
  } catch (error) {
    throw new Error(`Fout bij het verwijderen van host: ${error.message}`);
  }
};
export default deleteHostById;
