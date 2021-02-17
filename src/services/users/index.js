const express = require("express");
const { User } = require("../utils/db");
const bcrypt = require('bcryptjs')
const multer = require("multer");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { admin, auth } = require("../auth/auth"); 
const {findByCredentials, authentication} = require("../auth/tools");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profiles",
  },
});
const cloudinaryMulter = multer({ storage: storage });
const router = express.Router();

router.get("/", auth, admin, async (req, res, next) => {
  try {
    const users = await User.findAll();
    console.log(users)
    users.length > 0 ? res.send(users) : res.send(404);
  } catch (error) {
    next(error);
  }
});
router.get("/:userid", auth, async (req, res, next) => {
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


router.post('/login/me', async(req,res,next)=> { //no mw because this has to be open to all
  //deleting the basic mw means I now have to store the findByCredential somewhere: it's in the tools file. 
  try {
    const {email, password} = req.body
    const userData = await findByCredentials(req, email, password)
    const user = userData[0].dataValues
    console.log(user)
    const tokens = await authentication(user) //fires authentication function NOT THE MIDDLEWARE! 
    res.send(tokens)
  }catch (e) {
    next(e)
  }
})

router.post('/logout/me', auth, async(req,res,next) => { //logs out from current device
  try {
    const user = req.user[0].dataValues
    const newUser = await User.update({refreshTokens: user.refreshTokens.filter((tkn)=> tkn !== req.body.refreshTokens )}, {where: { //this deletes all the refresh tokens and leaves current one (why?)
      id: user.id
    }})
    res.send(newUser[0] === 1 ? 'Logged out' : 'there was a problem')
  }catch(e) {
    next(e)
  }
})

router.post('/logout/all', auth, async(req,res,next)=> { //logs out from all devices
  try {
    const user = req.user[0].dataValues
    const newUser = await User.update({refreshTokens: []}, {where: {
      id: user.id
    }})
    res.send(newUser[0] === 1 ? 'Logged out' : 'there was a problem')
  }catch(e) {
    next(e)
  }
})

router.post(
  "/",
  cloudinaryMulter.single("user-image"),
  async (req, res, next) => {
    try {
      const newUser = await User.create({ ...req.body, password: await bcrypt.hash(req.body.password, 10), img: req.file.path, refreshTokens: [] }); //not sure
      res.status(201).send({ newUser });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);


router.put("/:userid", auth, async (req, res, next) => {
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

router.delete("/:userid", auth, async (req, res, next) => {
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
