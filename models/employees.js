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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: ["^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$"]
      }
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