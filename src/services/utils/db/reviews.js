module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }, 
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rate: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: false }
  );
  Reviews.associate = (models) => {
    Reviews.belongsTo(models.House);
    
  };
  return Reviews;
};
