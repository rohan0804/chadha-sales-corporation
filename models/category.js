const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const category = sequelize.define("category", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = category;
