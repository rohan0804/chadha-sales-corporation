const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("chadhasalescorporation", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
