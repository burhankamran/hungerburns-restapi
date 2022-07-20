const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try{
    
        const token=req.headers.authorization;
        console.log(token);
       const decodedToken= jwt.verify(token,'somesupersceret');
       req.userData={email:decodedToken.email,userId:decodedToken.userId};
        next();
    }
   catch(error){
    res.status(401).json({
        message:"req failed not logged in",
    })
   }

}