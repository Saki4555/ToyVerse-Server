const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// marketplaceUser
// jXRNarHM8D07pwAw




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phgiqsm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const toysCollection = client.db('marketplaceDb').collection('toys');

        app.get('/mytoys/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
      
            const query = { seller_email: email };
            const cursor = await toysCollection.find(query).toArray();
            res.send(cursor);
          });

        app.post('/toys', async (req, res) => {
            const newToy = req.body;
            const result = await toysCollection.insertOne(newToy);
            res.send(result);
        });

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(email);
      
            const query = { _id: new ObjectId(id) };
            const cursor = await toysCollection.find(query).toArray();
            res.send(cursor);
          });

        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('assigenment 11');
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})