import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//- buiten de functie maakt maar één databaseconnectie per client
//- binnen de functie constant nieuw databaseconnectie bij elke inlog per client,
//  kan overload zijn of crash, want heeft beperking met connectie van databases.

const login = async (username, password) => {
  const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";

  const user = await prisma.user.findFirst({
    //gezocht naar username en password en wordt vergelijken
    //in praktijk niet veilig, de wachtwoord wordt opgeslagen als plaintext.
    //beter gezocht naar findQnique, met wachtwoord opslaan als hash methode(bcrypt)
    where: { username, password },
  });

  if (!user) {
    return null;
  }

  const token = jwt.sign({ userId: user.id }, secretKey);

  return token;
};

export default login;
