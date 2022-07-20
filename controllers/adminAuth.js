const brcypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { validationResult }=require('express-validator/check');

const Admin=require('../models/Admin');

exports.signUp=(req,res)=>{
    console.log('herer');
     const email=req.body.email;
     const password=req.body.password;
     const error=validationResult(req);

     if(!error.isEmpty())
     {
       return  res.status(422).json({error:error.array()[0].msg});
       
     } 

     brcypt.hash(password,12)
     .then(hashedPassword=>{
        return Admin.create({
          email:email,
          password:hashedPassword,
      })
     })
     .then(results=>{
         console.log(results);
         res.status(200).json({
             message:'User Created',
         })
     })
     .catch(err=>console.log(err));
 }
  

exports.login=(req,res,next)=>{

    const email=req.body.email;
    const password=req.body.password;
    let userFound;

    const error=validationResult(req);

    if(!error.isEmpty())
    {
      return  res.status(422).json({error:error.array()[0].msg});
      
    }

 Admin.findOne({where:{email:email}})
    .then(user=>{
        if(!user)
        {
            res.status(422).json( {error: 'Email Not Exist'});
        }
        console.log(user.password,password)
        userFound=user;
      return  brcypt.compare(password,user.password);
    })
    .then(isEqual=>{
        if(!isEqual)
        {
           return res.status(422).json( {error: 'Password is incorrect'});
        }
        console.log(userFound,'jerejr');
        const token=jwt.sign({email:userFound.email,
            userId:userFound.id.toString()},'somesupersceret',
            {expiresIn:'1h'});

         res.status(200).json({token:token,userId:userFound.id.toString(),
            expiresIn:3600});   

    })
    .catch(err=>console.log(err)); 
}




