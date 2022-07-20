const express =require('express');
const bodyParser=require('body-parser');
const multer=require('multer');
const path=require('path');
const helmet=require('helmet');
const compression=require('compression');

const AuthRoutes=require('./Routes/Auth');
const sequelize=require('./database/dbConnection');
const Admin=require('./models/Admin');
const adminAuthRoutes=require('./Routes/adminAuth');
const Product=require('./models/Product');
const history=require('./models/History');
const productVariation=require('./models/productVariation');
const shopRoutes=require('./Routes/shop');
const User=require('./models/User');
const Cart=require('./models/Cart');
const cartItems=require('./models/cart-item');
const Order=require('./models/Order');
const orderItems=require('./models/order-items');
const rider=require('./models/Rider');
// const ProductSale=require('./models/Sales');

const app=express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  const Mime_Type={
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg '
  }
  
   

  const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      console.log(file,'ijjj');
      const isValid=Mime_Type[file.mimetype];
      let err=new Error("Invalid mime type")
      if(isValid){
        err=null;
      }
      console.log(err,'here');
          cb(err,"images");
    },
    filename:(req,file,cb)=>{
      const name=file.originalname.toLowerCase().split(' ').join('-');
      const ext=Mime_Type[file.mimetype];
      cb(null,name +'-'+Date.now() + '.' +ext)
    }
  })
  

// app.use(bodyParser.json());

app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({extended:false}));
    
   app.use('/images',express.static(path.join(__dirname,'images')));

app.use(multer({storage:storage}).single("imageUrl"));

app.use(express.static(path.join(__dirname,'public')));


app.set('view engine','ejs');
app.set('views','views')




app.use(AuthRoutes);

app.use('/admin',adminAuthRoutes)

app.use(shopRoutes)

app.use(helmet());

app.use(compression());

//Association or Realtionships b/w entities

Product.belongsTo(Admin,{constraints:true,onDelete:'CASCADE'});
Admin.hasMany(Product);

productVariation.belongsTo(Product,{constraints:true,onDelete:'CASCADE'});
Product.hasMany(productVariation);

 Product.hasMany(history);

//  Product.hasMany(ProductSale);


User.hasOne(Cart);
Cart.belongsTo(User); 

cartItems.belongsTo(Cart,{constraints:true,onDelete:'CASCADE'});
Cart.hasMany(cartItems);

// Many to Many relationship
//Product.belongsToMany(Cart,{through:cartItems});
//Cart.belongsToMany(Product,{through:cartItems})

//qtyVar.belongsTo(cartItems,{constraints:true,onDelete:'CASCADE'});
//cartItems.hasMany(qtyVar);

User.hasOne(Order);
Order.belongsTo(User); 

orderItems.belongsTo(Order,{constraints:true,onDelete:'CASCADE'});
Order.hasMany(orderItems);



sequelize.sync()
.then(()=>{
  app.listen(process.env.PORT||3000);
 
}).catch(err=>console.log(err));