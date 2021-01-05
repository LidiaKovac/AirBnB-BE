const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { writeFile } = require("fs-extra");
const { join } = require("path");
const { readJSON, writeJSON } = require("fs-extra");
const { check, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail")

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "houses",
  },
});
const cloudinaryMulter = multer({ storage: storage });

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
      (house) => house.address.city.toLowerCase() === req.params.location
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
router.get("/:location/:id", async (req, res, next) => {
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
        "street": "VIa Segur",
        "city": "Genova",
        "zip code": 20153,
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
        const err = new Error();
        err.message = errors;
        console.log(err.message);
        err.httpStatusCode = 400;
        next(err);
      } else {
        console.log(req);
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
router.post(
  "/:location/:id/upload",
  cloudinaryMulter.array('image', 5),
  async (req, res, next) => {
    try {
      const files = await readDataBase("../files/files.json");
      req.files.forEach((image, index)=>
      addImage = {
        ...req.body,
        img: req.files[index].path,
      })
      
      files.push(addImage)

      await fs.writeFileSync(
        path.join(__dirname, "../files/files.json"),
        JSON.stringify(files)
      );
      res.status(201).send(addImage)
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.post(
  "/book", async(req,res,next) => {
    try {
      sgMail.setApiKey(process.env.SENDGRID_KEY)
  
      const msg = {
        to: "noemiefp@live.it",
        from: "lidia.kovac1998@gmail.com",
        subject: "Sending with Twilio SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      }
  
      await sgMail.send(msg)
      res.send(req.body)
    } catch (error) {
      next(error)
    }
  }
)
router.put(
  "/:location/:id",
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
      const catalogue = await readDataBase("houses.json");
      const filterDB = catalogue.filter((house) => house.id !== req.params.id);
      const modifiedHouse = {
        ...req.body,
        id: req.params.id,
        modifiedAt: new Date(),
      };
      filterDB.push(modifiedHouse);
      await fs.writeFileSync(
        path.join(__dirname, "houses.json"),
        JSON.stringify(filterDB)
      );
      res.send({ filterDB });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  '/:location/:id', async(req,res,next) => {
    const catalogue = await readDataBase('houses.json')
    const filterDB = catalogue.filter((house) => house.id !== req.params.id)
    await fs.writeFileSync(
      path.join(__dirname, 'houses.json'), 
      JSON.stringify(filterDB)
    )
    res.send({filterDB})
  }
)

module.exports = router;
