const cart = require('../models/Cart');
const cartItems = require('../models/cart-item');
const Product=require('../models/Product');

const productVariation=require('../models/productVariation');
// qtyVar = require('../models/qtyVar');
const User = require('../models/User');
const Order = require('../models/Order');
const orderitems = require('../models/order-items');
const order = require('../models/Order');

exports.getProducts=(req,res)=>{
    console.log('herer','ok');
     Product.findAll({ include: ["productVariations"] })
     .then(products=>{
        res.status(200).json({
            products:products,
        })
     })
     .catch(err=>console.log(err));
}

exports.getProductDetail=(req,res)=>{
    const prodId= req.params.id;
    Product.findByPk(prodId,{ include: ["productVariations"] })
    .then(product=>{
        res.status(200).json({
            products:product,
        });
    })
    .catch(err=>console.log(err));
}




exports.postCart=(req,res)=>{
  
    const userId=req.userData.userId;
    const prodId=+req.body.productId;
    const qty1=+req.body.qty;
    const variation=req.body.variation;
     console.log(variation);
    let fetchedCart;
    let prodName;
    let prodPrice;
    Product.findOne({where:{id:prodId}, include: ["productVariations"] })
     .then(resD=>{
      console.log(resD.productVariations);
       prodName=resD.name;
       //console.log(resD.productVariations,'piii');
       resD.productVariations.forEach(data=>{
        //  console.log(data.type,variation);
            if(data.type.charAt(0)==variation.charAt(0))
            {
              
              prodPrice=data.price;
              console.log('incondition')
            }
            console.log(prodPrice,'inprod');
       });
      return User.findOne({where:{id:userId}})
     })
    .then((user)=>{
      return user.getCart()
    })
     .then(cart=>{
      fetchedCart=cart;
       return cartItems.findOne({where:{name:prodName,variation:variation,price:prodPrice,
     cartId:cart.id}});
     })
     .then((products)=>{ 
         
          if(!products)
          {
           return  cartItems.create(
              {name:prodName,variation:variation,price:prodPrice,
                cartId:fetchedCart.id,qty:qty1}
             )
          }
          else
          {
           
            products.qty=products.qty+qty1;
              return  products.save();
          }
          
      })
      .then(resD=>{
        return fetchedCart.getCartItems();
        
      })
      .then(resD=>{
        let totalPrice=0;
         resD.forEach(product=>{
      
           totalPrice=totalPrice+product.price*product.qty;
        })
        
        res.status(200).json({
          products:resD,
          totalPrice:totalPrice,
          message:'Add To Card'
       });
       })
     .catch(err=>console.log(err));
  
  }


  exports.cart=(req,res,next)=>{
    const userId=req.userData.userId;
    let totalPrice=0;
    User.findOne({where:{id:userId}})
    .then((user)=>{
      return user.getCart()
    })
    .then(cart=>{
     return cart.getCartItems()
    })
    .then(resD=>{
       resD.forEach(product=>{
          totalPrice=totalPrice+product.price*product.qty;
       })
       res.status(200).json({
        products:resD,
        totalPrice:totalPrice
     });
    })
    .catch(err=>console.log(err));
 }

exports.deleteCart=(req,res)=>{
     const cartItemId=req.body.cartItemId;
     const userId=req.userData.userId;
     let fetchedCart;
     User.findOne({where:{id:userId}})
     .then(user=>{
       return  user.getCart();
     })
     .then(cart=>{
      fetchedCart=cart;
      
      return cartItems.findOne({where:{id:cartItemId,
        cartId:cart.id}});  
    })
    .then(res=>{
      if(res.qty==1)
      {
        return res.destroy();
      }
      else
      {
        res.qty=res.qty-1;
         return res.save();
      }
    })
    .then(resD=>{
        return fetchedCart.getCartItems();
     
    })
    .then(resD=>{
     let totalPrice=0;
      resD.forEach(product=>{

        totalPrice=totalPrice+product.price*product.qty;
     })
     console.log(totalPrice);
      res.status(200).json({
        resD:resD,
        message:'Deleted Products',
        totalPrice:totalPrice,
   });
    })
     .catch(err=>console.log(err));
}


exports.cartIncrease=(req,res)=>{
  const cartItemId=req.body.cartItemId;
  const userId=req.userData.userId;
  let fetchedCart;
  User.findOne({where:{id:userId}})
  .then(user=>{
    return  user.getCart();
  })
  .then(cart=>{
   fetchedCart=cart;
   
   return cartItems.findOne({where:{id:cartItemId,
     cartId:cart.id}});  
 })
 .then(res=>{
     res.qty=res.qty+1;
    return  res.save();
 })
 .then(resD=>{
  return fetchedCart.getCartItems();
 })
 .then(resD=>{
  let totalPrice=0;
   resD.forEach(product=>{

     totalPrice=totalPrice+product.price*product.qty;
  })
  console.log(totalPrice);
   res.status(200).json({
     resD:resD,
     message:'Increment Products',
     totalPrice:totalPrice,
});
 })
  .catch(err=>console.log(err));
}



exports.postOrder=(req,res)=>{
  let productsAll;
  let fetchCart;
  let ordersD;
  const userId=req.userData.userId;
  const address=req.body.address;
  const comment=req.body.comment;
  console.log(userId,'hrhrhtrhthr');
  let userD;
  User.findOne({where:{id:userId}})
  .then(user=>{
    userD=user;
    return  user.getCart();
  })
  .then(cart=>{
    fetchCart=cart;
     
   return cart.getCartItems();
  })
  .then(products=>{
    console.log(products,'products');
    productsAll=products;
    
    products.map(product=>{
      Product.findOne({where:{name:product.name}})
      .then(prd=>{
        prd.qtyOfSale=product.qty+prd.qtyOfSale;
        return prd.save();
      })
      .then(res=>{

      })
      .catch(res=>console.log(res));
    });


    return userD.createOrder({address:address,comment:comment,
      status:"pending"});
  })
  .then(order=>{
    
    return orderitems.bulkCreate(productsAll.map(product=>{
      console.log(product,'hetetet');
      return {qty:product.qty,variation:product.variation,
      name:product.name,price:product.price,orderId:order.id}
    }));
  })
  .then(orders=>{
    ordersD=orders;
    return fetchCart.setCartItems(null);
  })
  .then(resD=>{
    
        res.status(200).json({
           orders:ordersD,
        });
  })
  .catch(err=>console.log(err,'here'));
}

exports.getOrders=(req,res)=>{
  let productsAll;
  let fetchCart;
  const userId=req.userData.userId;
  let userD;
  User.findOne({where:{id:userId}})
  .then(user=>{
    userD=user;
    return  Order.findAll({where:{userId:userId},include:['orderItems']})
  })
  .then(resD=>{
    console.log(resD);
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
          }
       });
       res.status(200).json({
        orders:data,
     });
  })

  
  .catch(err=>console.log(err,'here'));
}

exports.deleteOrder=(req,res)=>{
   
    const id=req.body.id;
   
    order.findOne({where:{id:id}})
    .then(resD=>{
      return resD.destroy();
    }
    )
    .then(resD=>{
      console.log(resD);
      res.status(200).json({
        message:'Deleted Order',
        data:resD,
   }); 
    })
    .catch(err=>console.log(err));
}

