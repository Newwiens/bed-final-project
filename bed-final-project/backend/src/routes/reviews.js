import { Router } from "express";
import getReview from "../services/reviews/getReviews.js";
import getReviewById from "../services/reviews/getReviewById.js";
import authLocal from "../middleware/authLocal.js";
import createReview from "../services/reviews/createReviews.js";
import deleteReviewById from "../services/reviews/deleteReviewsById.js";
import updateReviewById from "../services/reviews/updateReviewsById.js";
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

//Reviews uitlezen GET
router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReview();

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

//Reviews nieuw aanmaken POST
router.post("/", authLocal, async (req, res, next) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    const review = await createReview({ userId, propertyId, rating, comment });

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: "Review niet gevonden" });
    }
  } catch (error) {
    next(error);
  }
});

//Reviews op Id GET
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: "Review niet gevonden" });
    }
  } catch (error) {
    next(error);
  }
});

//Review DELETE
router.delete("/:id", authLocal, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteReviewById(id);

    if (deleted) {
      res.status(200).json({
        message: "Review succesvol verwijderd",
        deleted,
      });
    } else {
      res.status(404).json({ message: "Review niet gevonden" });
    }
  } catch (error) {
    next(error);
  }
});

//Review update PUT
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedReview = req.body;

    const review = await updateReviewById(id, updatedReview);

    if (!review) {
      res.status(404).json({ message: "Review niet gevonden" });
    } else
      res.status(200).json({
        message: "Review succesvol bijgewerkt",
        review,
      });
  } catch (error) {
    next(error);
  }
});

export default router;
