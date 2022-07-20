const Sequelize=require('sequelize');
const sequelize = require('../database/dbConnection');


const order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:true,
        primaryKey:true,
    },
    address:
    {
        type:Sequelize.STRING,
        allowNull:false,
    },
    comment:
    {
        type:Sequelize.STRING,
        allowNull:false,
    },
    status:
    {
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports=order;
