var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/shop-api');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(request, response){
    var product=new Product({title:request.body.title,price:request.body.price});
    product.title=request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct){
        if(err){
            response.status(500).send({error:"Could not save product"});
        }
        else
        {
            response.status(200).send(savedProduct);
        }
    });
   // product.likes = 0;
    
});
app.get('/product', function(request,response){
    //console.log(1);
   // var prods;
    Product.find({}, function(err, products) {
        if(err) {
            response.status(500).send({error:"could not fetch the product"});
        }
        else
        {
            //prods = products;
            response.send(products);
        }
      //  console.log(2);
    });
  //  console.log(3);
  //response.send(prods);
  
});
app.get('/wishlist', function(request, response)
        {
            WishList.find({}).populate({path:'products', model: 'Product'}).exec(function(err, wishLists)
             {
                                                                                    if(err)
                                                                                    {
                                                                                       response.status(500).send({error:"Could not fetch the wishlists"}); 
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        response.status(200).send(wishLists);
                                                                                    }
                                                                                    
                                                                                 });                                                                    
        });
app.post('/wishlist', function(request, response){
    var wishList = new WishList();
    wishList.title = request.body.title;
    wishList.save(function(err, newWishList){
        if(err){
            response.status(500).send({error:"Could not create the product"});
        } else {
            response.send(newWishList);
        }
    });
});

app.put('/wishlist/product/add', function(request, response){
    Product.findOne({_id: request.body.productId}, function(err, product) {
        if(err) {
            response.status(500).send({error:"could not add any product to wishlist"});
        } else {
            WishList.update({_id:request.body.wishListId},{$addToSet:{products: product._id}}, function(err, wishList) {
            if(err)
            {
                response.status(500).send({error:"Could not add any product to the wishlist"});
            }
            else
            {
                response.send("Successfully added product to the wishlist");
            }
            });
        }
    });
});

app.listen(3000, function() {console.log("Swag shop Api running on port 3000...");});