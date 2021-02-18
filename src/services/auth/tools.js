const { User } = require("../utils/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authenticate = async user => {
  try {
    const accessToken = await generateJWT({ id: user.id }) //creates tokens
    const refreshToken = await generateRefreshJWT({ id: user.id })

    // save new refresh token in db
    
    newRefreshTokens = user.refreshTokens.concat(refreshToken)
    await User.update({refreshTokens: newRefreshTokens}, {where: {
      id: user.id
    }})

    // return them
    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

const verifyJWT = (token) =>
  new Promise((res, rej) =>
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err)
      else res(decoded);
    })
  );

const generateJWT = (payload) =>
      new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15 min' }, //value is a string (expressing the time ) or a number (in seconds)
      (err, token) => {
        if (err) rej(err); //reject
        res(token); //sets response
      }
    )
  );

const generateRefreshJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign( //generates jwt
      payload,
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: '1 hour' },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const findByCredentials = async (req, email, password) => {
  const user = await User.findAll({
    where: {
      email: email,
    },
  });
  if (user !== []) {
    const isMatch = await bcrypt.compare(password, user[0].dataValues.password); //i guess this does all the work of encoding and decoding for you
    if (isMatch) req.user = user;
    return user;
  }
};

module.exports = {
  verifyJWT,
  findByCredentials,
  authentication: authenticate
};
