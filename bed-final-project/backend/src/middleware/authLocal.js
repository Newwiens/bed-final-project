import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Je heb geen toegang voor wijzigen. (token)" });
  }

  const token = authHeader.split(" ")[1]; // 🔥 Haal token uit "Bearer ..."

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token provided!" });
    }

    req.user = decoded;
    next();
  });
};

export default authMiddleware;
