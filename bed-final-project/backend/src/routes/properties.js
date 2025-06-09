import { Router } from "express";
import authLocal from "../middleware/authLocal.js";
import getProperties from "../services/properties/getProperties.js";
import createProperty from "../services/properties/createProperty.js";
import getPropertyById from "../services/properties/getPropertyById.js";
import deletePropertyById from "../services/properties/deletePropertyById.js";
import updatePropertyById from "../services/properties/updatePropertyById.js";

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

//Properties uitlezen
router.get("/", async (req, res, next) => {
  try {
    const properties = await getProperties(req.query);
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
});

//Properties nieuw aanmaken PoST
router.post("/", authLocal, async (req, res, next) => {
  try {
    const {
      hostId,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      amenities,
    } = req.body;
    const newProperty = await createProperty(
      hostId,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      amenities
    );
    res
      .status(200)
      .json({ message: `Nieuw property is aangemaakt`, ...newProperty });
  } catch (error) {
    next(error);
  }
});

//Property op Id GET
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);

    if (!property) {
      res
        .status(400)
        .json({ message: `Property met id ${id} is niet gevonden.` });
    } else {
      res
        .status(200)
        .json({ message: `Property succes opgevraagd.`, ...property });
    }
  } catch (error) {
    next(error);
  }
});

//Property verwijderen
router.delete("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await deletePropertyById(id);

    if (property) {
      res
        .status(200)
        .json({ message: `Property met id ${id} is succes verwijderd.` });
    } else {
      res.status(404).json({ message: `Property met id ${id} niet gevonden.` });
    }
  } catch (error) {
    next(error);
  }
});

//Property update PUT
router.put("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProperties = req.body;

    const property = await updatePropertyById(id, updatedProperties);

    if (property) {
      res.status(200).json({
        message: `Succes update met id ${id} uitgevoerd.`,
        ...property,
      });
    } else {
      res.status(404).json({ message: `property met ${id} is niet gevonden.` });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
