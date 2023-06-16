const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5vc4.mongodb.net/?retryWrites=true&w=majority`; 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect()
        const database = client.db("portfolio_data")
        const dataCollection = database.collection("data")

        // Post method
        app.post('/clientData', async (req, res) => {
            const data = req.body;
            console.log(data)
            const result = await dataCollection.insertOne(data);
            res.json(result);
        });

        // Get Method
        app.get('/allData', async(req, res)=>{
            const cursor = dataCollection.find({});
            const result = await cursor.toArray()
            res.send(result)
        })
    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Howdy!')
})

app.listen(port, () => {
    console.log(`listening on Port: ${port}`)
})