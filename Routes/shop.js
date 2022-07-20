const express=require('express');

const shopController=require('../controllers/shopRoutes');
const authChecker=require('../controllers/auth_checker');

const Router=express.Router();

Router.get('/getProducts',shopController.getProducts);

Router.get('/getProduct/:id',shopController.getProductDetail);

Router.post('/cart',authChecker,shopController.postCart);

Router.get('/cart',authChecker,shopController.cart);

Router.post('/cartDelete',authChecker,shopController.deleteCart);

Router.post('/cartIncrease',authChecker,shopController.cartIncrease);

Router.post('/orders',authChecker,shopController.postOrder);

Router.get('/orders',authChecker,shopController.getOrders);

Router.post('/cancelOrder',authChecker,shopController.deleteOrder);

module.exports=Router;