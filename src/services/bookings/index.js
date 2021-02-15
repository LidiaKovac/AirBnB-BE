const express = require("express");
const { Booking, User, House } = require("../utils/db");
const sgMail = require("@sendgrid/mail");
const moment = require('moment')
const router = express.Router();

router.get("/:bookid", async (req, res, next) => {
  try {const bookings = await Booking.findAll({
    where: {
      id: req.params.bookid,
    },
  });
  bookings.length > 0 ? res.send(bookings) : res.send(404);}
  catch(error) {
      next(error)
  }
});

router.post("/:houseid/:userid", async (req, res, next) => {
  try {
    let booking = await Booking.create({
      ...req.body,
      userId: req.params.userid,
      houseId: req.params.houseid,
    });
    const bookData = await booking.dataValues;
    const user = await User.findAll({
      where: {
        id: bookData.userId,
      },
    });
    const house = await House.findAll({
      where: {
        id: bookData.houseId,
      },
    });
    let startDate = moment(booking.dataValues.dateStart);
    let endDate = moment(booking.dataValues.dateEnd);
    let nightsNum = endDate.diff(startDate, 'days');
    console.log(nightsNum);
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user[0].dataValues.email,
      from: "lidia.kovac1998@gmail.com",
      subject: `Thank you for booking ${house[0].dataValues.title}`,
      //text: ``,
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
            <style> 
            body {
              /* background-color: #ffc5d0; */
              font-family: Arial, Helvetica, sans-serif;
              line-height: 150%;
              text-align: center;
            }
            </style>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your email</title>
        </head>
        <body>
            <h1>Ehy there ${user[0].dataValues.name} ${
        user[0].dataValues.last_name
      }! </h1>
            <p>Here is your booking details: <br/>
              <strong> House: </strong>${house[0].dataValues.title}. <br/>
      <strong>Dates:</strong> From ${startDate} to ${endDate}. (${nightsNum} nights) <br/>
      <strong>Price:</strong> ${nightsNum * house[0].dataValues.price} $ </p>
      Here is your booking id: ${booking.dataValues.id}
        </body>
      </html>
      `,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).send("Email sent!");
      })
      .catch((error) => { //email catch
        console.error(error.response.body);
      });
  } catch (error) { //try block 
    next(error);
  }
  res.send(201)
});

router.put("/:bookid", async (req, res, next) => {
  try {
    let newBooking = await Booking.update(req.body, {
      where: {
        id: req.params.bookid,
      },
    });
    res.status(200).send("Updated" + newBooking);
  } catch (error) {
    next(error);
  }
});

router.delete("/:bookid", async (req, res, next) => {
  try {
    await Booking.destroy({
      where: {
        id: req.params.bookid,
      },
    });
    res.send(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
