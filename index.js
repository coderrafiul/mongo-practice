const express= require('express');
const cors= require('cors');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const users=["Shorna", "Razib", "Sakib", "Ayesha"]


// GET
app.get('/products', (req,res)=>{

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents)=>{
            if(err) { 
                console.log(err);
            } else {
              res.send(documents);
            }
        })
        // client.close();
      });
})

app.get('/fruit', (req,res)=>{
    const fruit={
        name: "Orange",
        price: 170
    }
    res.send(fruit);
})

app.get('/product/:key', (req,res)=>{
    const key= req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key}).toArray((err, documents)=>{
            if(err) { 
                console.log(err);
            } else {
              res.send(documents[0]);
            }
        })
        // client.close();
      });
})


app.post('/getProductsByKey', (req,res)=>{
    const key= req.params.key;
    const productKeys= req.body;
    console.log(productKeys);
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key:{$in:productKeys}}).toArray((err, documents)=>{
            if(err) { 
                console.log(err);
            } else {
              res.send(documents);
            }
        })
        // client.close();
      });
})

// POST
app.post('/addProduct', (req, res)=>{
    // console.log('data recieved',req.body)
    const product= req.body;
  
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result)=>{
            if(err) { 
                console.log(err);
            } else {
              console.log('Successfully inserted', result);
              res.send(result.ops[0]);
            }
        })
        // client.close();
      });
    
})


app.post('/placeOrder', (req, res)=>{

    const orderDetails= req.body;
    orderDetails.orderTime= new Date();
    console.log(orderDetails);
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        collection.insertOne(orderDetails, (err, result)=>{
            if(err) { 
                console.log(err);
            } else {
              console.log('Successfully inserted', result);
              res.send(result.ops[0]);
            }
        })
        // client.close();
      });
    
})

const port= process.env.PORT || 4200
app.listen(port, ()=>console.log('Listening to port 4200'));