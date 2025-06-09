import { Router } from "express";
import getUsers from "../services/users/getUsers.js";
import getUserById from "../services/users/getUserById.js";
import createUser from "../services/users/createUser.js";
import authLocal from "../middleware/authLocal.js";
import deleteUserById from "../services/users/deleteUserById.js";
import updateUserById from "../services/users/updateUserById.js";
//------------------Import-----------------------------

/*
let op!!!
- De volgorde van de path (route) is belangrijk en 
  niet de volgorde van de http-methode

  Algemene route ("/") vóór specifieke ("/etc")

  router.get("/", ...)      // eerst algemene route
  router.post("/:id", ...)   // daarna specifieke route

  !!---BELANGRIJK---!!
  - req.params --> iets wijzigen of invoeren via URL balk
  - req.body   --> iets wijzigen via de body. vb: 
  {
  "username": "jdoe",
  "email": "jdoe@example.com"
  }
*/

const router = Router(); //router aanmaken

//Alle user model uitlezen GET
router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers(req.query); //variable naam users is zelf gekozen en niet afgeleid van database!!!
    res.json(users); // status 200 wordt automatisch gestuurd, met logModdleware
  } catch (error) {
    next(error); //als fout wordt de errorHandler opgeroepen met foutmelding status 500
  }
});

//Nieuwe gebruikers aanmaken POST
router.post("/", authLocal, async (req, res, next) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture } =
      req.body;
    const newUser = await createUser(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture
    );

    res
      .status(200)
      .json({ message: `Nieuwe gebruikers aangemaakt`, ...newUser });
  } catch (error) {
    next(error);
  }
});

//Users op ID uitlezen GET
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({ message: `Gebruiker met id ${id} niet gevonden` });
    } else {
      res.status(200).json({ message: `UserId succes opgevraagd.`, ...user });
    }
  } catch (error) {
    next(error);
  }
});

//Users op ID DELETE
router.delete("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);

    if (user) {
      res.status(200).send({
        message: `Gebruiker met id ${id} is succes verwijderd`,
        user,
      });
    } else {
      res.status(404).json({
        message: `Gebruikers met id ${id} is niet gevonden`,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Users op ID update PUT
router.put("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password, name, email, phoneNumber, profilePicture } =
      req.body;

    //(id, {....}) = id --> geeft a.d.h.v welke gegevens wilt update
    const user = await updateUserById(id, {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
    });

    if (user) {
      res.status(200).send({
        message: `Gebruiker met id ${id} is succes geupdated`,
        user,
      });
    } else {
      res.status(404).json({
        message: `Gebruikers met id ${id} is niet gevonden`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
