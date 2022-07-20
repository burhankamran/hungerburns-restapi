const Sequelize=require('sequelize');

const sequelize=require('../database/dbConnection');

const productVariation=sequelize.define('productVariation',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    type:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    price:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    

});

module.exports=productVariation;