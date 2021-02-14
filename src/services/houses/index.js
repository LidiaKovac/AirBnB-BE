const express = require("express");
const moment = require("moment");
const multer = require("multer");

const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { Sequelize } = require("sequelize");

const { Booking, House, User } = require("../../services/utils/db");
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);

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
      res
        .status(404)
        .send("Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:location", async (req, res, next) => {
  //search by city
  try {
    const catalogue = await findAll({
      where: {
        city: req.params.location,
      },
    });
    if (catalogue) {
      res.status(201).send(catalogue);
    } else
      res
        .status(404)
        .send("Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/:location/:id", async (req, res, next) => {
  try {
    const house = await findAll({
      where: {
        id: req.params.id,
      },
    });
    if (house) {
      res.status(201).send(house);
    } else
      res
        .status(404)
        .send("Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/",
  cloudinaryMulter.single("house-image"),
  async (req, res, next) => {
    try {
      const newHouse = await House.create({ ...req.body, img: req.file.path });
      res.status(201).send(newHouse);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put("/edit/:id", async (req, res, next) => {
  try {
    let location = await House.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    console.log(location);

    res.status(200).send("Updated");
  } catch (error) {
    next(error);
  }
});
router.delete("/delete/:id", async (req, res, next) => {
  try {
    await House.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).send("Deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
