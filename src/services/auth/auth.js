const { User } = require("../utils/db");
const { verifyJWT } = require("./tools");

const authorize = async (req, res, next) => {
  //repleaces the "basic auth" from yesterday
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    console.log('starting verification with token ', token )
    const decoded = await verifyJWT(token); //takes verifyJWT from the tools file and runs it with the empty token
    console.log(decoded)
    const user = await User.findAll({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      //if there is no user...
      const noUsErr = new Error();
      err.httpStatusCode = 404;
      throw noUsErr; //...throw a 404 error
    }
    console.log(token)
    req.token = token; //adds token to request
    req.user = user; //adds user to request
    next();
  } catch (e) {
    next(e)
  }
};

const adminMW = async (req, res, next) => {  //this doesn't change
console.log(req.user[0].dataValues)
  if (req.user && req.user[0].dataValues.role === "admin") {
    
    next();
  } else {
    const err = new Error("Admins Only!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = {
  auth: authorize,
  admin: adminMW,
};
