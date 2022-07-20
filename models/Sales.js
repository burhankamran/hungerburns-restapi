const Sequelize=require('sequelize');
const sequelize = require('../database/dbConnection');


const ProductSale=sequelize.define('ProductSale',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:true,
        primaryKey:true,
    },
   qty:{
        type:Sequelize.INTEGER,
        allowNull:false,
   }
    
    
});

module.exports=ProductSale;
