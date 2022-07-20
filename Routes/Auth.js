const express=require('express');
const { check,body, validationResult }=require('express-validator/check');


const authChecker=require('../controllers/auth_checker');
const authController=require('../controllers/Auth');
const User = require('../models/User');

const Router=express.Router();

Router.put('/signup',
[check('email').isEmail().withMessage('Please enter a valid email'),
body('email').custom((value,{req})=>{
    return User.findOne({where:{email:value}})
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
//  body('conPassword').custom((value,{req})=>{
//     if(value!==req.body.password){
//         console.log(value,req.body.password);
//     throw new Error('Passwords has to match!!!');
//     }
//     return true;
// })
]
,authController.signUp);

Router.post('/login',
[body('email').isEmail().withMessage('please enter a valid email'),
body('password','password has to be valid').isLength({min:5}).
isAlphanumeric()]
,authController.login);

Router.post('/userProfileEdit',authChecker,authController.userUpdate);

Router.post('/userPasswordReset',authController.userPasswordReset);

Router.get('/reset/:token',authController.getNewPassword);


Router.post('/new-password',
authController.postNewPassword);

Router.get('/passwordChanged',
authController.passwordChanged);

module.exports=Router;

