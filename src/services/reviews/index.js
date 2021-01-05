const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { writeFile} = require("fs-extra")
const { join } = require("path");
const { readJSON, writeJSON } = require("fs-extra");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const readDataBase = async (path) => {
    try {
      const jsonFile = await readJSON(join(__dirname, path));
      return jsonFile;
    } catch (error) {
      throw new Error(error);
      console.log(error);
    }
  };

//router.get('/:id')
router.get("/:houseid", async (req, res, next) => {
    try {
      const reviewDB = await readDataBase("reviews.json");
      console.log(req.body);
      if (reviewDB) {
          let houseRevs = reviewDB.filter((rev)=> rev.houseID === req.params.houseid)
        res.send(houseRevs);
      } else
        res.send("404 - Nothing seems to be here. Try to post something first.");
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  router.get("/:houseid/:revid", async (req, res, next) => {
    try {
      const reviewDB = await readDataBase("reviews.json");
      if (reviewDB) {
        let houseRevs = reviewDB.filter((rev)=> rev.houseID === req.params.houseid)
          let review = houseRevs.filter((rev)=> rev.id === req.params.revid)
        res.send(review);
      } else
        res.send("404 - Nothing seems to be here. Try to post something first.");
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
//router.post("/:id")
/* 

{
    "user": "",
    "rating": "",
    "review": "",
    "houseID": "",
    "id": "" //server generated
}

*/
router.post(
    "/:houseid",
    [
      check("user","rating", "review").exists().withMessage("mandatory field"),
      check("rating")
        .exists()
        .withMessage("mandatory field")
        .isFloat({min: 1, max: 5})
        .withMessage("must be a number between 1 and 5"),
    ],
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const err = new Error();
          err.message = errors;
          console.log(err.message);
          err.httpStatusCode = 400;
          next(err);
        } else {
          console.log(req);
          const reviewsDB = await readDataBase("reviews.json");
  
          const newReview = {
            ...req.body,
            houseID: req.params.houseid,
            id: uniqid(),
            createdAt: new Date(),
            modifiedAt: new Date(),
          };
          reviewsDB.push(newReview);
          await fs.writeFileSync(
            path.join(__dirname, "reviews.json"),
            JSON.stringify(reviewsDB)
          );
          res.status(201).send({ newReview });
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
//router.delete("/:revid")
//dividere id casa da id review, 

module.exports = router;
