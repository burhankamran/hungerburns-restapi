const Sequelize=require('sequelize');

const sequelize=require('../database/dbConnection');

const Admin=sequelize.define('Admin',{
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
});

module.exports=Admin;