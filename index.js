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
    client = new MongoClient(uri, { useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents)=>{
            if(err) { 
                console.log(err);
            } else {
              res.send(documents);
            }
        })
        client.close();
      });
})

app.get('/fruit', (req,res)=>{
    const fruit={
        name: "Orange",
        price: 170
    }
    res.send(fruit);
})

app.get('/users/:id', (req,res)=>{
    const id= req.params.id;
    const name= users[id]
    res.send({id,name})
})

// POST
app.post('/addProduct', (req, res)=>{
    // console.log('data recieved',req.body)
    const product= req.body;

    client = new MongoClient(uri, { useNewUrlParser: true});
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
        client.close();
      });
    
})

const port= process.env.PORT || 3000
app.listen(port, ()=>console.log('Listening to port 3000'));