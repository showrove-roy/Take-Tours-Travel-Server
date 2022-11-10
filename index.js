const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DBUSER_BUCKET}:${process.env.SECRET_KEY}@cluster0.in3ib7y.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const collections = client
      .db("takeTourTravel")
      .collection("travelServices");

    // Get all service api
    app.get("/services", async (req, res) => {
      const limitNum = parseInt(req.query.limit);
      const query = {};

      if (limitNum) {
        const cursor = collections.find(query).limit(limitNum);
        const result = await cursor.toArray();
        res.send(result);
        return;
      }

      const cursor = collections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single service api
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await collections.findOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Take Tour Travel server is Running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
