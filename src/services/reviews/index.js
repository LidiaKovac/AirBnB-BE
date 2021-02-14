const express = require("express");
const { Review } = require("../utils/db");

const router = express.Router();

router.get("/:houseid", async (req, res, next) => {
  const reviews = await Review.findAll({
    where: {
      houseId: req.params.houseid,
    },
  });
  reviews.length > 0 ? res.send(reviews) : res.send(404);
});

router.get("/:houseid/:revid", async (req, res, next) => {
  const review = await Review.findAll({
    where: {
      houseId: req.params.houseid,
      id: req.params.id,
    },
  });
  review.length > 0 ? res.send(review) : res.send(404);
});

router.post(
  "/:houseid",

  async (req, res, next) => {
    try {
      let review = await Review.create({
        ...req.body,
        houseId: req.params.houseid,
      });
      res.send(review);
    } catch (e) {
      next(e);
    }
  }
);

router.put("/:revid", async (req, res, next) => {
  try {
    let editReview = await Review.update(req.body, {where: {
      id: req.params.revid
    }})
    editReview[0] === 0 ? res.send(editReview + ': there was a problem') : res.send(editReview + ': updated')
  } catch (e) {
    next(e);
  }
});

router.delete("/:reviewId", async (req, res, next) => {
  let review = await Review.destroy({
    where: {
      id: req.params.reviewId,
    },
  });
  res.send(204);
});

module.exports = router;
