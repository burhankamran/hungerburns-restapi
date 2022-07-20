const Sequelize=require('sequelize');

const sequelize=require('../database/dbConnection');

const Product=sequelize.define('product',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    imageUrl:
    {
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:
    {
        type:Sequelize.STRING,
        allowNull:false,
    },
    qtyOfSale:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
   
});

module.exports=Product;