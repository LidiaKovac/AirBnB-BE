const express = require("express");
const { User } = require("../utils/db");
const bcrypt = require('bcryptjs')
const multer = require("multer");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { admin, basic } = require("../auth") 
//?? on each endpoint there can be up tp two auth middlewares: basic and admin. If the admin mw is present, that is an admin only action ??
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profiles",
  },
});
const cloudinaryMulter = multer({ storage: storage });
const router = express.Router();

router.get("/", basic, admin,  async (req, res, next) => {
  try {
    const users = await User.findAll();
    console.log(users)
    users.length > 0 ? res.send(users) : res.send(404);
  } catch (error) {
    next(error);
  }
});
router.get("/:userid", basic, async (req, res, next) => {
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

router.get('/login/me', basic, async(req,res,next)=> {
  try {
    res.send(req.user)
  } catch(e) {
    next(e)
  }
})
// UserSchema.pre("save", async function (next) { I MOVED THIS STEP IN THE POST ENDPOINT
//   const user = this
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 10)
//   }
//   next()
// })
router.post(
  "/",
  cloudinaryMulter.single("user-image"),
  async (req, res, next) => {
    try {
      const newUser = await User.create({ ...req.body, password: await bcrypt.hash(req.body.password, 10), img: req.file.path }); //not sure
      res.status(201).send({ newUser });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);


router.put("/:userid", basic, async (req, res, next) => {
  try {
    const editUser = await User.update(req.body.password ? {...req.body, password: await bcrypt.hash(req.body.password, 10)} : {...req.body}, {
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

router.delete("/:userid", basic, async (req, res, next) => {
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
