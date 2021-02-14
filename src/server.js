const express = require("express");
const cors = require("cors");
const { join } = require("path");
const endpoints = require('express-list-endpoints')

const housesRoute = require('./services/houses')
const reviewsRoute = require('./services/reviews')
const fileRoute = require('./services/files')
const bookingsRoute = require ('./services/bookings')
const usersRoute = require ('./services/users')

const server = express()
const port = process.env.PORT

const db = require("./services/utils/db");

server.use(cors())
server.use(express.json())

const {
    notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
  badRequest
 
} = require("./errors.js"); 

server.use('/houses', housesRoute)
server.use('/reviews', reviewsRoute)
server.use('/files', fileRoute )
server.use('/booking', bookingsRoute)
server.use('/user', usersRoute)

db.sequelize.sync({ force: false }).then((result) => {
  server.listen(port, () => {
    console.log(
      "❗ Server is running on",
      port,
      " with these endpoints: ",
      endpoints(server)
    );
  });
});