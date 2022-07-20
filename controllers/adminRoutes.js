const Product=require('../models/Product');
const productVariation = require('../models/productVariation');
const User = require('../models/User');
const Rider=require('../models/Rider');
const fetch = require('node-fetch');
const order = require('../models/Order');
const Pricehistory = require('../models/History');
const productSale=require('../models/Sales');

exports.createPost=(req,res)=>{
   const name=req.body.name;
   const description=req.body.description;
   const category=req.body.category;
   const type0=req.body.type0;
   const price0=req.body.price0;
   const type1=req.body.type1;
   const price1=req.body.price1;
   const type2=req.body.type2;
   const price2=req.body.price2;
   let idGet=0;
    console.log(req.body);
    const url=req.protocol+'://' +req.get('host');
    const imageUrl=url +'/images/' +req.file.filename;
     console.log(req.userData.userId,'userId');
     let data=[];
    let arr=[
      {
        type:type0,
        price:price0,
      }
    ];
   /* if(!req.file)
    {
        return;
    } */
    if(type0 && price0)
    {
       
    }

   Product.create({
       name:name,
       description:description,
       imageUrl:imageUrl,
       AdminId:req.userData.userId,
       category:category,
       qtyOfSale:0
   })
   .then(results=>{
       idGet=results.id;
    const arr=[
      {
        type:type0,
        price:price0,
        productId:results.id,
      }
    ];
    if(type1 && price1)
    {
        arr.push({
            type:type1,
            price:price1,
            productId:results.id,
    })
    }

    if(type2 && price2)
    {
        arr.push({
            type:type2,
            price:price2,
            productId:results.id,
    })
    }
     data=arr;
     return productVariation.bulkCreate(arr)
   })
   .then(results=>{
    console.log(arr);
     return Pricehistory.bulkCreate(data);
   })
    .then(results=>{
      return  productSale.create({ 
            productId:idGet,
            qty:0,
        })
    })
    .then(result=>{
        res.status(200).json({
            message:'Product created successfully',
            result:result,
        });
    })
   .catch(err=>console.log(err));
}

exports.deleteProduct=(req,res)=>{
   console.log('herererererccc');
    const prodId=+req.body.id;
     console.log(prodId);
    Product.findOne({where:{id:prodId}})
    .then(product=>{
      if(!product)
      {
  
        throw new Error("no product found!!!!");
      }
     // fileHelper.deleteFile(product.imageUrl); 
    return  Product.findOne({id:prodId,userId:req.userData.userId})
    })
  
    .then(product=>{
  
      return  product.destroy();
    })
    .then(()=>{
      res.status(200).json( {
         message:'success'
      } )
    })
    .catch(err=>
        res.status(500).json(
      {
        message:"deleting product page",
        err:err
      }
    ));
  }


  exports.postNotification=(req,res,next)=>{
    console.log('in');
    const userId=+req.body.userId;
    const id=+req.body.id;
    const total=req.body.total;
    
    let RidersData;

    Rider.findAll({where:{id:id}})
    .then(riders=>{
      RidersData=riders[0];
      console.log(riders[0])
     return User.findOne({where:{id:userId}})
    })
    .then(user=>{
      return fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to:user.pushToken,
          title:'Your Order On its way',
          body:` 30 to 40 min`+" "+RidersData.userName+RidersData.phone, 
          data:{
            riderPhoneNumber:RidersData.phone,
            time:'30-40 min',
            price:'Rs.'+total,
            riderEmail:RidersData.email,
            riderName:RidersData.userName,
          }
      })
      });
    })
    .then(resD=>{
         console.log(resD);
    })
    .catch(res=>console.log(res));
}


exports.getAdminProducts=(req,res)=>{
  //  console.log('ininin',req.userData.userId);
    Product.findAll({where:{adminId:req.userData.userId},
       include: ["productVariations"] })
    .then(products=>{ 
      console.log(products);
        res.status(200).json({
            message:'success',
            products:products,

        });
    })
    .catch(err=>console.log(err));
}


exports.getProductDetail=(req,res)=>{
  const prodId= req.params.id;
  console.log(prodId);
  Product.findByPk(prodId,{ include: ["productVariations"] })
  .then(product=>{
      res.status(200).json({
          products:product,
      });
  })
  .catch(err=>console.log(err));
}


exports.editProduct=(req,res)=>{
  const prodId= req.params.id;
  const name=req.body.name;
  const description=req.body.description;
  const category=req.body.category;
  const type0=req.body.type0;
  const price0=req.body.price0;
  const type1=req.body.type1;
  const price1=req.body.price1;
  const type2=req.body.type2;
  const price2=req.body.price2;
  let imageUrl=req.body.imageUrl;
 
   let data=[];

  if(req.file){

    const url=req.protocol +'://' +req.get('host');
     imageUrl=url +'/images/' +req.file.filename;
  
   }
   const arr=[
    {
      type:type0,
      price:price0,
      productId:prodId,
    }
  ];


    productVariation.destroy({where:{productId:prodId}})
    .then(res=>{
      return Product.findOne({ include: ["productVariations"] ,
      where:{id:prodId}});
      
    })
  .then(products=>{
    console.log(products);
    // if(products.AdminId!==req.userData.userId)
    // {
    //   return res.status(200).json({
    //     message:'Not Allow',
     
    // });
    // }

   
    if(type1 && price1)
    {
        arr.push({
            type:type1,
            price:price1,
            productId:products.id,
    })
    }

    if(type2 && price2)
    {
        arr.push({
            type:type2,
            price:price2,
            productId:products.id,
    })
    }
      products.name=name,
      products.imageUrl=imageUrl;
      products.category=category;
      products.description=description;
    
      data=arr;

    return  products.save();
  })
  .then((results)=>{
    return productVariation.bulkCreate(arr)
  })
  .then(results=>{
    return  Pricehistory.bulkCreate(data);
  })
  .then(results=>{
    res.status(200).json({
      message:'success',
      products:results,
  });
  })
  .catch(err=>{
   console.log(err);
   });

}

exports.getOrders=(req,res)=>{
 
 
   order.findAll({include:['orderItems']})
  .then(resD=>{
    console.log(resD,'i ned');
       const data=resD.map((prod,index)=>{
         let total=0;
         prod.orderItems.map((p)=>{
              total=total+(p.price*p.qty);
          });
          return{
            address:prod.address,
            createdAt:prod.createdAt,
              totalPrice:total,
              id:prod.id,
              orderitems:prod.orderItems,
              status:prod.status,
              userId:prod.userId,
          }
       });
       res.status(200).json({
        orders:data,
     });
  })

  
  .catch(err=>console.log(err,'here'));
}

exports.updateOrderStatus=(req,res)=>{
  const orderId=req.params.id;
  const status=req.body.status;
  order.findOne({where:{id:orderId}})
  .then(order=>{
    order.status=status;
    return order.save();
  })
  .then(order=>{
    res.status(200).json({
      message:'success',
      order:order,
    });
  })
  .catch(err=>console.log(err));
}

exports.getRiders=(req,res)=>{

  Rider.findAll()
  .then(riders=>{
    res.status(200).json({
      riders:riders,
    });
    });
  
  }
 
  exports.getOrderById=(req,res)=>{
    const prodId= req.params.id;
    order.findByPk(prodId,{ include: ["orderItems"] })
    .then(product=>{
        res.status(200).json({
            products:product,
        });
    })
    .catch(err=>console.log(err));
}

exports.getUsers=(req,res)=>{
  User.findAll()
  .then(users=>{
    res.status(200).json({
      users:users,
    });
    });
}

exports.deleteUser=(req,res)=>{
  const userId=req.params.id;
  User.destroy({where:{id:userId}})
  .then(user=>{
    res.status(200).json({
      message:'success',
      user:user,
    });
  })
  .catch(err=>console.log(err));

}


exports.getProductHistory=(req,res)=>{
 
  Pricehistory.findAll()
  .then(product=>{
      res.status(200).json({
        productHistory:product,
      });
  })
  .catch(err=>console.log(err));
}

exports.addRider=(req,res)=>{
  const name=req.body.name;
  const phone=req.body.phone;
  const email=req.body.email;
 
    
  Rider.create({
    userName:name,
    phone:phone,
    email:email,
  })
  .then(rider=>{
    res.status(200).json({
      message:'success',
      rider:rider,
    });
  })
  .catch(err=>console.log(err));
}