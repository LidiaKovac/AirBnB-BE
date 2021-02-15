const express = require("express");
const multer = require("multer");

const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { House } = require("../../services/utils/db");

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
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  try {
    const catalogue = await House.findAll({
      where: {
        city: capitalize(req.params.location),
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
    const house = await House.findAll({
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
