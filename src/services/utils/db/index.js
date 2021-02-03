const { Sequelize, DataTypes } = require("sequelize");
const User = require("./users");
const Booking = require("./bookings");
const Review = require("./reviews");
const House = require('./houses')

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);

const models = {
  User: User(sequelize, DataTypes),
  Booking: Booking(sequelize, DataTypes),
  Review: Review(sequelize, DataTypes),
  House: House(sequelize, DataTypes)
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => console.log("💡 DB CONNECTED!"))
  .catch((e) => console.log("❌ CONNECTION FAILED!"));

module.exports = models;
