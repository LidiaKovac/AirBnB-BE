const {User} = require("./utils/db")
//const {findByCredential, toJSON} = require('./utils/authUtils')
const bcrypt = require('bcrypt')
const atob = require("atob") //npm lib to encode data-64 back to strings (Ascii TO Binary)

const basicUserMW = async (req, res, next) => {
  if (!req.headers.authorization) {
    const error = new Error("Please provide a basic authentication")
    error.httpStatusCode = 401
    next(error)
  } else {
    const [email, password] = atob( 
      req.headers.authorization.split(" ")[1] // ??? 
    ).split(":")

    // const user = await UserModel.findByCredential(email,password)
    const user = await User.findAll({where: {
        email: email
      }})
    
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) return user
        else return null
      } else return null
    }
    if (!user) {
      const error = new Error("Wrong credentials provided")
      error.httpStatusCode = 401
      next(error)
    } else {
      req.user = user
    }

    next()
  }



const adminMW = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    const err = new Error("Admins Only!")
    err.httpStatusCode = 403
    next(err)
  }
}

module.exports = {
  basic: basicUserMW,
  admin: adminMW,
}