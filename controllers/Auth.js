const brcypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetch = require('node-fetch');
const { validationResult }=require('express-validator/check');

const User=require('../models/User'); 
const crypto=require('crypto');



const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "5c6d6eab",
  apiSecret: "v3kg5r47gy4mz0Kg"
})


// const  nodemailer = require('nodemailer');

// const transpoter=nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//       user:'',
//       pass:''

//     },
//     tls:{
//         rejectUnauthorized: false,  
//         ciphers: "SSLv3"  
//      },
//      port: 465,
//    secure: true,    
// })
//  NODE_TLS_REJECT_UNAUTHORIZED=0
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// transpoter.sendMail({
//     from:'',
//      to:"",
//      subject:"Password Reset",
//     text:'very goood!!',
     
//   },(err,data)=>{
//     if(err)
//     {
//       console.log(err,'here');
//     }
//   });

exports.signUp=(req,res)=>{
   console.log('native req');
    const email=req.body.email;
    const password=req.body.password;
    const userName=req.body.userName;
    const phone=req.body.phone;
    const address=req.body.address;
    const pushToken=req.body.pushToken;

    const error=validationResult(req);

    if(!error.isEmpty())
    {
     console.log('ok');
     console.log(error.array()[0].msg);
      return  res.status(422).json({error:error.array()[0].msg});
     
    }

    brcypt.hash(password,12)
    .then(hashedPassword=>{
       return User.create({
         email:email,
         password:hashedPassword,
         userName:userName,
         phone:phone,
         address:address,
         pushToken,
     })
    })
    .then(user=>{
        return   user.createCart();
       })
       .then(results=>{
        
        return fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to:pushToken,
            title:'User SignUp',
            body:`${userName} has been logged In....`,
        })
        });
       })
       .then(data=>{
       
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
    console.log(email,password);

    const error=validationResult(req);

    if(!error.isEmpty())
    {
      return  res.status(422).json({error:error.array()[0].msg});
      
    }
    User.findOne({where:{email:email}})
    .then(user=>{
      if(!user)
      {
         return res.status(422).json( {error: 'Email Not Exist'});
      }
       
        userFound=user;
        console.log(userFound);
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
            {expiresIn:'5h'});

         res.status(200).json({token:token,userId:userFound.id.toString(),
          userName:userFound.userName,address:userFound.address,
          phone:userFound.phone,expiresIn:'3600'});   

    })
    .catch(err=>console.log(err));
}

exports.userUpdate=(req,res)=>{
      const address=req.body.address;
      
      const userId=req.userData.userId;

      User.findOne({where:{id:userId}})
      .then(res=>{
          res.address=address;
          return  res.save()
      })
      .then(user=>{
        res.status(200).json({userId:user.id.toString(),
            userName:user.userName,address:user.address,
            phone:user.phone,});;
           
      })
      .catch(err=>console.log(err));
}

exports.userPasswordReset=(req,res)=>{
     const phoneNumber=req.body.phoneNumber;
     crypto.randomBytes(32,(error,buffer)=>{
      if(error)
      {
        console.log(error,'error');
      }
      //convert normal hex value to ASCI
      
      const token=buffer.toString('hex');
      User.findOne({where:{phone:phoneNumber}})
      .then(user=>{
        if(!user)
        {
          return res.status(422).json( {error: 'No User Found'});
        }
        else
        {
          user.resetToken=token;
          user.resetTokenExpiration=Date.now() + 3600000;
          return user.save();
        }
      })
      .then(data=>{
        
        const num=phoneNumber.replace(0,'92');
        const from = "Hunger Burns"
        const to = num;
         const text = 'PLease Reset'
        const html=`
        Hunger Burns 
        RESET PASSWORD LINK
        http://192.168.192.53:3000/reset/${token}`

            vonage.message.sendSms(from, to, html, (err, responseData) => {
             if (err) {
               console.log(err);
                 } else {
                 if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
              } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
             }
            }
          })
      })
      .catch(err=>console.log(err))
    });
}

exports.getNewPassword=(req,res)=>{

  const token=req.params.token;

  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
  .then(user=>{
    
    res.render('resetPassword',
    {path:'/new_password',pageTitle:'New Password',
    errorMessage:'',
    user_Id:user.id.toString(),
    passwordToken:token,
  });
  })
  .catch(err=>console.log(err));

}


exports.postNewPassword=(req,res)=>{
  console.log('iniinii');
  let resetUser;
  console.log(req.body);
     const newPassword=req.body.password;
     const userId=+req.body.userId;
     const passwordToken=req.body.passwordToken;
     console.log(newPassword,passwordToken,userId,'passs');
    //  const errors= validationResult(req);

    //  if(!errors.isEmpty())
    //  {
    //      return res.render('auth/new_Password',{pageTitle:'New Password',
    //     oldInputs:{password:req.body.password,conPassword:req.body.conPassword}
    //     ,path:'/reset',user_Id:userId,passwordToken:passwordToken,
    //     errorMessage:errors.array()[0].msg,
    //     valiationErrors:errors.array()});
    //  }
    User.findOne({resetToken:passwordToken,
      resetTokenExpiration:{$gt:Date.now()},id:userId})
      .then(user=>{
        resetUser=user;
        console.log(user);
       return  brcypt.hash(newPassword,12)
      })
      .then(hashPassword=>{
         resetUser.password=hashPassword;
         resetUser.resetToken=null;
         resetUser.resetTokenExpiration=null;
         return resetUser.save();
      })
      .then(result=>{
        console.log('donepro');
        console.log(result);
        res.redirect('/passwordChanged');
      })
      .catch(err=>console.log(err));
}

exports.passwordChanged=(req,res)=>{
  console.log('qwwqwq');
  res.render('passwordChanged',
  {path:'/new_password',pageTitle:'New Password',
  
});
}