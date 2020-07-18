const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const User = sequelize.define("users",{
    name:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:true
    },
    salt:{
        type:Sequelize.DataTypes.STRING
    },
    role_id:{
        type:Sequelize.DataTypes.INTEGER,
        references:{
            model:'roles',
            key:'id'
        }

    }
})


module.exports = User;