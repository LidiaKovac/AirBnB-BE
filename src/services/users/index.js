const express = require("express");
const { User } = require("../utils/db");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profiles",
  },
});
const cloudinaryMulter = multer({ storage: storage });
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    users.length > 0 ? res.send(users) : res.send(404);
  } catch (error) {
    next(error);
  }
});
router.get("/:userid", async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {
        id: req.params.userid,
      },
    });
    user.length > 0 ? res.send(user) : res.send(404);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  cloudinaryMulter.single("user-image"),
  async (req, res, next) => {
    try {
      const newUser = await User.create({ ...req.body, img: req.file.path });
      res.status(201).send({ newUser });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);


router.put("/:userid", async (req, res, next) => {
  try {
    const editUser = await User.update(req.body, {
      where: {
        id: req.params.userid,
      },
    });
    console.log(editUser)
    editUser[0] === 0 ? res.send('there was a problem' ) : res.send( 'updated')
  } catch (error) {
    next(error);
  }
});

router.delete("/:userid", async (req, res, next) => {
  try {
    let user = await User.destroy({
      where: {
        id: req.params.userid,
      },
    });
    res.send(user + ": Deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
