const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Product = sequelize.define("product", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  show_on_home:{
    type:Sequelize.BOOLEAN,
    defaultValue:0
  },
  image:{
    type:Sequelize.STRING,
    
    allowNull:false
  },
  category_id:{
    type:Sequelize.DataTypes.INTEGER,
    references:{
      model:'categories',
      key:'id'
    }
  }
});

module.exports = Product;
