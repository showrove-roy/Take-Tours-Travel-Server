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
    const reviewCollections = client.db("takeTourTravel").collection("reviews");

    // post service
    app.post("/services", async (req, res) => {
      const reviewData = req.body;
      const result = await collections.insertOne(reviewData);
      res.send(result);
    });

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

    // Update Rating number
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const ratingData = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          rating_Count: ratingData.ratingCount,
          rating: ratingData.new_rating,
        },
      };

      const result = await collections.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // get all review  api
    app.get("/review", async (req, res) => {
      const query = {};

      const cursor = reviewCollections.find(query).sort({ timestamp: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // post review
    app.post("/review", async (req, res) => {
      const reviewData = req.body;
      const result = await reviewCollections.insertOne(reviewData);
      res.send(result);
    });

    // get single user Reviews
    app.get("/review/:uid", async (req, res) => {
      const id = req.params.uid;
      const query = { re_uid: id };
      const cursor = reviewCollections.find(query).sort({ timestamp: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single user Reviews
    app.get("/single-review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollections.findOne(query);
      res.send(result);
    });

    // put single user Reviews
    app.put("/single-review/:id", async (req, res) => {
      const id = req.params.id;
      const reviewData = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          re_text: reviewData.nRe_text,
          re_rating: reviewData.nRe_rating,
        },
      };

      const result = await reviewCollections.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete review
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await reviewCollections.deleteOne(query);
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
