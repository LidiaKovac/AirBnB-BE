const express = require("express");
const cors = require("cors");
const { join } = require("path");
const endpoints = require('express-list-endpoints')

const housesRoute = require('./services/houses')
const reviewsRoute = require('./services/reviews')
const fileRoute = require('./services/files')

const server = express()
const port = process.env.PORT

const db = require("./services/utils/db");

server.use(cors())
server.use(express.json())

/*const {
    notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
  badRequest,
  routeNotFound,
 
} = require("./errorHandling.js"); */

server.use('/houses', housesRoute)
server.use('/reviews', reviewsRoute)
server.use('/files', fileRoute )


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