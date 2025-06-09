import { Router } from "express";
import login from "../services/auth/login.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // ✅ Controleer of zowel username als password zijn ingevuld
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    const token = await login(username, password);

    if (!token) {
      res.status(401).json({ message: "Het ingevoerde gegevens is onjuist." });
    } else {
      res.status(200).json({ message: "Inloggen is gelukt", token });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
