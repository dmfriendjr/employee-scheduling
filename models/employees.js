module.exports = (sequelize, DataTypes) => {
  return sequelize.define('employees', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false
  });
}