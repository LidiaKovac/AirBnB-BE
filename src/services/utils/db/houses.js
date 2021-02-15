const { House } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Houses = sequelize.define(
    "house",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      rooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      facilities: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zip_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      province_county: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING
      }
    },
    { timestamps: false }
  );
  Houses.associate = (models) => {
    Houses.hasMany(models.Review);
    Houses.hasMany(models.Booking);
    Houses.belongsTo(models.User);
  };
  return Houses;
};
