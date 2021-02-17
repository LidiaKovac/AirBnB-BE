const { User } = require("./utils/db");
//const {findByCredential, toJSON} = require('./utils/authUtils')
const bcrypt = require("bcryptjs");
const atob = require("atob"); //npm lib to encode data-64 back to strings (Ascii TO Binary)

const basicUserMW = async (req, res, next) => {
  if (!req.headers.authorization) {
    const error = new Error("Please provide a basic authentication");
    error.httpStatusCode = 401;
    next(error);
  } else {
    //if an auth is provided
    const [email, password] = atob(
      req.headers.authorization.split(" ")[1] // ???
    ).split(":");
    const userData = await User.findAll({
      where: {
        email: email,
      },
    });
    const user = userData[0].dataValues;
    if (user) {
      //if 1
      console.log("user exists");
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (isMatch) { //i had to cut some line from the code showed to class returning null would stop my function from going on in compiling
        req.user = user;
      }
    }
    if (!user) {
      const error = new Error("Wrong credentials provided");
      error.httpStatusCode = 401;
      next(error);
    } else {
    }
    next();
  }
};

const adminMW = async (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    const err = new Error("Admins Only!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = {
  basic: basicUserMW,
  admin: adminMW,
};
