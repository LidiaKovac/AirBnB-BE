module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "booking",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dateStart: {
        type: DataTypes.STRING,
      },
      dateEnd: {
        type: DataTypes.STRING,
      }
    },
    { timestamps: true }
  );
  
  Booking.associate = (models) => {
    Booking.belongsTo(models.User);
  };
  return Booking;
};
