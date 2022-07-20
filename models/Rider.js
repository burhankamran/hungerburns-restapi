const Sequelize=require('sequelize');

const sequelize=require('../database/dbConnection');

const User=sequelize.define('rider',{
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
  
    userName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    phone:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    
});

module.exports=User;