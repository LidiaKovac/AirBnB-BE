const { User } = require("../utils/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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



const auth = async (user) => {
  try {
      console.log('starting generation')
    const newAccessToken = await generateJWT({id: user.id});
    console.log('starting generation of rt')
    const newRefreshToken = await generateRefreshJWT({id: user.id});
    console.log(newRefreshToken)
    user.refreshTokens = user.refreshTokens.concat(newRefreshToken);
    await User.update(user, {where: {
        id: user.id
    }})

    return { token: newAccessToken, refreshToken: newRefreshToken };
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
};

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
  authentication: auth,
};
