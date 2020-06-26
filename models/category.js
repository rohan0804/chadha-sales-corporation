const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const category = sequelize.define("category", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = category;
