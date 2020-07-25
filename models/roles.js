const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Role = sequelize.define("roles",{
    name:{
        type:Sequelize.STRING,
        required:true,
    }
})

module.exports = Role; 

