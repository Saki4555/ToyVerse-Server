const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());







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
        // await client.connect();


        const toysCollection = client.db('marketplaceDb').collection('toys');

        const indexKeys = { name: 1 };
        const indexOptions = { name: "nameIndex" };
        const result = await toysCollection.createIndex(indexKeys, indexOptions);
        console.log(result);

        app.get('/alltoys', async (req, res) => {
            const result = await toysCollection.find().limit(20).toArray();
            res.send(result);

        });

        app.get("/getToysByText/:text", async (req, res) => {
            const text = req.params.text;
            const result = await toysCollection.find({ name: { $regex: text, $options: "i" } }).toArray();
            res.send(result);
        });



        app.get('/mytoys/:email', async (req, res) => {
            const email = req.params.email;
            const toSort = req.query.toSort;
            
            console.log(toSort);
            // console.log(email);


            const query = { seller_email: email };
            if(toSort === 'Ascending'){
                const cursor = await toysCollection.find(query).sort({ price: 1 }).toArray();
                res.send(cursor);
            }
            else{
                const cursor = await toysCollection.find(query).sort({ price: -1 }).toArray();
                res.send(cursor);
            }

           
           
        });

        app.post('/toys', async (req, res) => {
            const newToy = req.body;
            const result = await toysCollection.insertOne(newToy);
            res.send(result);
        });

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);

            const query = { _id: new ObjectId(id) };
            const cursor = await toysCollection.findOne(query);
            res.send(cursor);
        });

        app.patch('/toys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(req.body);
            const filter = { _id: new ObjectId(id) };
            const { price, quantity, details } = req.body;
            const updatedDoc = {
                $set: {
                    price: price,
                    quantity: quantity,
                    details: details
                },
            };

            const result = await toysCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete('/mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await toysCollection.deleteOne(query);
            res.send(result);
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