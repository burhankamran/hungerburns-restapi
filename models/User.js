const Sequelize=require('sequelize');

const sequelize=require('../database/dbConnection');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    userName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    phone:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    address:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    resetToken:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    resetTokenExpiration:{
        type:Sequelize.DATE,
        allowNull:true,
    },
    pushToken:{
        type:Sequelize.STRING,
        allowNull:true,
    },
});

module.exports=User;