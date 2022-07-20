const Sequelize=require('sequelize');
const sequelize = require('../database/dbConnection');


const Pricehistory=sequelize.define('Pricehistory',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:true,
        primaryKey:true,
    },
   price:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    type:
    {
        type:Sequelize.STRING,
        allowNull:false,
    }
    
    
});

module.exports=Pricehistory;
