const Sequelize=require('sequelize');
const sequelize = require('../database/dbConnection');


const cart=sequelize.define('cart',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:true,
        primaryKey:true,
    }
});

module.exports=cart;
