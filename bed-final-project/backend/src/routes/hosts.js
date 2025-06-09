//------------------Import-----------------------------

import { Router } from "express";
import getHosts from "../services/host/getHost.js";
import createHost from "../services/host/createHost.js";
import authLocal from "../middleware/authLocal.js";
import getHostById from "../services/host/getHostById.js";
import deleteHostById from "../services/host/deleteHostById.js";
import updateHostById from "../services/host/updateHostById.js";
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

//Alle host uitlezen GET
router.get("/", async (req, res, next) => {
  try {
    const hosts = await getHosts(req.query);
    res.json(hosts);
  } catch (error) {
    next(error);
  }
});

//Nieuwe host aanmaken POST
router.post("/", authLocal, async (req, res, next) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    } = req.body;
    const newHost = await createHost(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe
    );

    res.status(200).json({ message: `Nieuwe host aangemaakt`, ...newHost });
  } catch (error) {
    next(error);
  }
});

//Host op ID uitlezen GET
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await getHostById(id);

    if (!host) {
      res.status(404).json({ message: `Host met id ${id} niet gevonden` });
    } else {
      res.status(200).json({ message: `Host succes opgevraagd.`, ...host });
    }
  } catch (error) {
    next(error);
  }
});

//Users op ID DELETE
router.delete("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await deleteHostById(id);

    if (host) {
      res.status(200).send({
        message: `Host met id ${id} is succes verwijderd`,
        host,
      });
    } else {
      res.status(404).json({
        message: `Host met id ${id} is niet gevonden`,
      });
    }
  } catch (error) {
    next(error);
  }
});

//Host update PUT
router.put("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedHost = req.body;
    const host = await updateHostById(id, updatedHost);

    if (host) {
      res.status(200).json(host);
    } else {
      res.status(404).json({ message: `Er gaat iets verkeerd` });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
