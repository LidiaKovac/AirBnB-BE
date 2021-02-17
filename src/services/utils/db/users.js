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
      role: {
        type: DataTypes.ENUM('admin', 'basic'),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          min:{
              args:[8],
              msg:"Minimum 8 characters required in password"
          }
      }
      }, 
      refreshTokens: {
        type: DataTypes.ARRAY(DataTypes.STRING(1000)),
       // allowNull: false
      }
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
