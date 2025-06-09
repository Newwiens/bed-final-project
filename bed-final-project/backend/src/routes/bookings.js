import { Router } from "express";
import authLocal from "../middleware/authLocal.js";
import getBookings from "../services/bookings/getBookings.js";
import createEvent from "../services/bookings/createBooking.js";
import getBookingById from "../services/bookings/getBookingById.js";
import deleteBookingById from "../services/bookings/deleteBookingById.js";
import updateBookById from "../services/bookings/updateBookingById.js";
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

//Alle bookings model uitlezen GET
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const bookings = await getBookings(userId); //variable naam users is zelf gekozen en niet afgeleid van database!!!
    res.json(bookings); // status 200 wordt automatisch gestuurd, met logModdleware
  } catch (error) {
    next(error); //als fout wordt de errorHandler opgeroepen met foutmelding status 500
  }
});

//Nieuw booking aanmaken POST
router.post("/", authLocal, async (req, res, next) => {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    const newEvent = await createEvent(
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );
    res.status(201).json({ message: `Nieuwe booking aangemaakt`, ...newEvent });
  } catch (error) {
    next(error);
  }
});

//Booking op Id GET
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    if (!booking) {
      res
        .status(400)
        .json({ message: `Booking met id ${id} is niet gevonden.` });
    } else {
      res
        .status(200)
        .json({ message: `BookingId succes opgevraagd.`, ...booking });
    }
  } catch (error) {
    next(error);
  }
});

//Booking DELETE
router.delete("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await deleteBookingById(id);

    if (booking) {
      res
        .status(200)
        .json({ message: `Booking met id ${id} is succes verwijderd.` });
    } else {
      res.status(404).json({ message: `Booking met id ${id} niet gevonden.` });
    }
  } catch (error) {
    next(error);
  }
});

//Booking update PUT
router.put("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBooking = req.body;
    const booking = await updateBookById(id, updatedBooking);

    if (booking) {
      res.status(200).json({
        message: `Succes update met id ${id} uitgevoerd.`,
        ...booking,
      });
    } else {
      res.status(404).json({ message: `Booking met ${id} is niet gevonden.` });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
