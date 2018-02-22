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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: ["(^[+][0-9]+\ )?([0-9]{3}\-[0-9]{3}\-[0-9]{4})(\ x[0-9]+$)?"]
      }
    }
  }, {
    timestamps: false
  });
}