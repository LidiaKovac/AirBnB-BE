const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { Booking, House, Review, User } = require("../../services/utils/db");

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);
const { check, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "houses",
  },
});
const cloudinaryMulter = multer({ storage: storage });

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const catalogue = await House.findAll();
    if (catalogue) {
      res.send(catalogue);
    } else
      res.status(404).send("Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:location", async (req, res, next) => { //search by city
  try {
    const catalogue = await findAll({where: {
      city: req.params.location
    }})
    if (catalogue) {
      res.status(201).send(catalogue);
    } else
    res.status(404).send("Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/:location/:id", async (req, res, next) => {
  try {
    const house = await findAll({where: {
      id: req.params.id
    }})
    if (house) {
      res.status(201).send(house);
    } else
    res.status(404).send("Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/", cloudinaryMulter.single("house-image"), async (req, res, next) => {
  try {
    const newHouse = House.create({...req.body, img: req.file.path})
      res.status(201).send({ newHouse });
    }
  catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/book/:booking", async (req, res, next) => { //booking = booking id
  try {
    const booking = await Booking.findAll({where: { //this returns the booking requested
      id: req.params.booking
    }})
    console.log(booking[0].dataValues)
    const bookData = await booking[0].dataValues
    const user = await User.findAll({where: {
      id: bookData.userId
    }})
    const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: user[0].dataValues.email, 
  from: 'lidia.kovac1998@gmail.com', 
  subject: 'Your Booking',
  text: 'You booked a house!',
  html: '<strong>You booked a house!</strong>',
  //add a PDF here as an attachment
//   const webPage = await browser.newPage();

// const url = "https://livecodestream.dev/post";

// await webPage.goto(url, {
//     waitUntil: "networkidle0"
// });
// await webPage.pdf({
//   printBackground: true,
//   path: "webpage.pdf",
//   format: "Letter",
//   margin: {
//       top: "20px",
//       bottom: "40px",
//       left: "20px",
//       right: "20px"
//   }
// });

// await browser.close();
}
sgMail
  .send(msg)
  .then(() => {
    res.status(201).send("Email sent!")
  })
  .catch((error) => {
    console.error(error.response.body)
  })
} catch(error) {
  console.log(error)
}});

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
router.delete("/:location/:id", async (req, res, next) => {
  const catalogue = await readDataBase("houses.json");
  const filterDB = catalogue.filter((house) => house.id !== req.params.id);
  await fs.writeFileSync(
    path.join(__dirname, "houses.json"),
    JSON.stringify(filterDB)
  );
  res.send({ filterDB });
});

module.exports = router;
