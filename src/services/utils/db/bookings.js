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
        type: DataTypes.DATE,
      },
      dateEnd: {
        type: DataTypes.DATE,
      }
    },
    { timestamps: false }
  );
  
  Booking.associate = (models) => {
    Booking.belongsTo(models.User);
  };
  return Booking;
};
