import { Router } from "express";
import authLocal from "../middleware/authLocal.js";
import getAmenities from "../services/amenities/getAmenities.js";
import createAmenities from "../services/amenities/createAmenity.js";
import getAmenityById from "../services/amenities/getAmenityById.js";
import deleteAmenityById from "../services/amenities/deleteAmenityById.js";
import updateAmenityyById from "../services/amenities/updateAmenityById.js";

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

const router = Router();

//Amenity uitlezen GET
router.get("/", async (req, res, next) => {
  try {
    const amenities = await getAmenities();
    res.json(amenities);
  } catch (error) {
    next(error);
  }
});

//Nieuw amenity aanmaken POST
router.post("/", authLocal, async (req, res, next) => {
  try {
    const { name } = req.body;
    const newAmenities = await createAmenities(name);
    res.status(201).json(newAmenities);
  } catch (error) {
    next(error);
  }
});

//Amenities op Id GET
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await getAmenityById(id);

    if (!amenity) {
      res
        .status(400)
        .json({ message: `amenity met id ${id} is niet gevonden.` });
    } else {
      res
        .status(200)
        .json({ message: `amenity succes opgevraagd.`, ...amenity });
    }
  } catch (error) {
    next(error);
  }
});

//Amenity verwijderen
router.delete("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await deleteAmenityById(id);

    if (amenity) {
      res
        .status(200)
        .json({ message: `amenity met id ${id} is succes verwijderd.` });
    } else {
      res.status(404).json({ message: `amenity met id ${id} niet gevonden.` });
    }
  } catch (error) {
    next(error);
  }
});

//Amenity update PUT
router.put("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const amenity = await updateAmenityyById(id, { name });

    if (amenity) {
      res.status(200).send({
        message: `amenity with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `amenity with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
