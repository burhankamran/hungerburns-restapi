const Sequelize=require('sequelize');
const sequlize = require('../database/dbConnection');


const cartItems=sequlize.define('cartItems',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    qty:{
        type:Sequelize.INTEGER
    },
    variation:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    price:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports=cartItems;
