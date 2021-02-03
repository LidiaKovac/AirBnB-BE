module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isHost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
  Users.associate = (models) => {
    Users.hasMany(models.Booking);
    Users.hasMany(models.Review);
    Users.hasMany(models.House);
  };
  return Users;
};
