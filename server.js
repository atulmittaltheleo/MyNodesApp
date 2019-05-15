var express = require("express");
var app=express();
var port = process.env.port || 4000;

var bodyParser = require("body-parser");
//Create applicatoin/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({extended: true}));
//Create applicatoin/json parser
app.use(bodyParser.json());


// Loading productController module
var productController = require ('./controller/ProductController')();
app.use("/api/products",productController);



// Listening to port
app.listen(port,function(){
    var datetime=new Date();
    var message="Server running on Port :" + port + "Started at : " + datetime;
    console.log(message);
})


