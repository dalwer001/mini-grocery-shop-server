const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5500;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u97y4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("miniGroceryShop").collection("products");
    const orderCollection = client.db("miniGroceryShop").collection("orders");


    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((error, items) => {
                res.send(items)
            })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => [
                res.send(result.insertedCount > 0)
            ])
    })

    app.get('/orders/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productCollection.find({ _id: id })
            .toArray((err, products) => {
                res.send(products[0]);
            })
    })

    app.post('/buyProduct', (req, res) => {
        const newProduct = req.body;
        orderCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })


    app.get('/orderPreview', (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, orders) => {
                res.send(orders);
            })
    })


    app.delete('/deleteProduct/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productCollection.deleteOne({ _id: id })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })


})

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port);