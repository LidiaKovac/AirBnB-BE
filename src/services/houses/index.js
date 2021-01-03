const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { writeFile } = require("fs-extra");
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

router.get("/", async (req, res, next) => {
  try {
    const catalogue = await readDataBase("houses.json");
    console.log(req.body);
    if (catalogue) {
      res.send(catalogue);
    } else
      res.send("404 - Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:location", async (req, res, next) => {
  try {
    const catalogue = await readDataBase("houses.json");
    const locationCatalogue = catalogue.filter(
      (house) => house.address.city === req.params.location
    );
    if (locationCatalogue) {
      res.send(locationCatalogue);
    } else
      res.send("404 - Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const catalogue = await readDataBase("houses.json");
    const exactPremise = catalogue.filter(
      (house) => house.id === req.params.id
    );
    if (exactPremise) {
      res.send(exactPremise);
    } else
      res.send("404 - Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
/*object posted must be structured this way:
{
    {
    "address": {
        "street": "Piazza De Ferrari",
        "city": "Genova",
        "zip code": 16100,
        "country": "Italy",
        "latitude": "44.407311404724986",
        "longitude": "8.934036926941353"
    }, 
    "title": "Wonderful House",
    "description": "Come visit us we have a fridge",
    "price": 99,
    "rooms": 3,
    "info": "We have a fridge and windows",
    "house": "apartment",
    "facilities": "you can flush the toilet",
    "isBooked": false
    }

} */
router.post(
  "/",
  [
    check("address").exists().withMessage("mandatory field"),
    check("title", "description", "info", "house", "facilities")
      .exists()
      .withMessage("mandatory field"),
    check("price", "rooms")
      .exists()
      .withMessage("mandatory field")
      .isNumeric()
      .withMessage("must be a number"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const catalogue = await readDataBase("houses.json");

        const newHouse = {
          ...req.body,
          id: uniqid(),
          createdAt: new Date(),
          modifiedAt: new Date(),
        };
        catalogue.push(newHouse);
        await fs.writeFileSync(
          path.join(__dirname, "houses.json"),
          JSON.stringify(catalogue)
        );
        res.status(201).send({ newHouse });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put("/:id", [
  check("address").exists().withMessage("mandatory field"),
  check("title", "description", "info", "house", "facilities")
    .exists()
    .withMessage("mandatory field"),
  check("price", "rooms")
    .exists()
    .withMessage("mandatory field")
    .isNumeric()
    .withMessage("must be a number"),
], async(req,res,next) => {
    try {
        const catalogue = await readDataBase('houses.json')
        const filterDB = catalogue.filter((house) => house.id !== req.params.id)
        const modifiedHouse = {
            ...req.body, 
            id:req.params.id,
            modifiedAt: new Date()
        }
        filterDB.push(modifiedHouse)
        await fs.writeFileSync(path.join(__dirname, 'houses.json'), JSON.stringify(filterDB))
        res.send({filterDB})
    } catch(error) {
        next(error)
    }
});

module.exports = router;
