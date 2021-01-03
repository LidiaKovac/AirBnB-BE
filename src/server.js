const express = require("express");
const cors = require("cors");
const { join } = require("path");
const listEndpoint = require('express-list-endpoints')

const housesRoute = require('./services/houses')
const reviewsRoute = require('./services/reviews')

const server = express()
const port = process.env.port

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

server.listen(port, ()=> {
    console.log("Server is up and running on port:", port, "with endpoints:", listEndpoint(server))
})