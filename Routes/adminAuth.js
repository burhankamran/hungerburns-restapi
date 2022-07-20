const express=require('express');
const { check,body, validationResult }=require('express-validator/check');



const adminAuthController=require('../controllers/adminAuth');
const adminController=require('../controllers/adminRoutes');
const  authChecker=require('../controllers/auth_checker');
const Admin = require('../models/Admin');

const Router=express.Router();

Router.post('/login',
[body('email').isEmail().withMessage('please enter a valid email'),
body('password','password has to be valid').isLength({min:5}).
isAlphanumeric()]
,adminAuthController.login);

Router.put('/signup',
[check('email').isEmail().withMessage('Please enter a valid email'),
body('email').custom((value,{req})=>{
    return Admin.findOne({where:{email:value}})
     .then(user=>{
         if(user)
         {
           return Promise.reject(
               'E-Mail exists already, please pick a different one.'
             );
         }
         return true;
     })
 }),
 body('password',
 'Please enter a password with only text and number and at least 5 characters').
 isLength({min:5}).isAlphanumeric(),
  body('conPassword').custom((value,{req})=>{
      if(value!==req.body.password){
      throw new Error('Passwords has to match!!!');
      }
      return true;
  })]
,adminAuthController.signUp);

Router.post('/add-product',authChecker,adminController.createPost);

Router.post('/product',authChecker,adminController.deleteProduct);

Router.post('/sendNotification',authChecker,adminController.postNotification);

Router.get('/getProducts',authChecker,adminController.getAdminProducts);

Router.get('/getProductById/:id',authChecker,adminController.getProductDetail);

Router.post('/updateProduct/:id',authChecker,adminController.editProduct);

Router.get('/getOrders',authChecker,adminController.getOrders);

Router.put('/updateOrderStatus/:id',authChecker,adminController.updateOrderStatus);

Router.get('/getRiders',authChecker,adminController.getRiders);

Router.get('/getOrderById/:id',authChecker,adminController.getOrderById);

Router.get('/getUsers',authChecker,adminController.getUsers);

Router.delete('/deleteUser/:id',authChecker,adminController.deleteUser);

Router.get('/getProductHistory',authChecker,adminController.getProductHistory);

Router.post('/addRider',authChecker,adminController.addRider);


module.exports=Router;