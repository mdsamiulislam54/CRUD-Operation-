import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const port = 5000;
const app = express();

// 👉 Middleware
app.use(cors());
app.use(express.json());

// pvxM4lAl79rmGiY2;
// project - 1;
const url =
  "mongodb+srv://project-1:pvxM4lAl79rmGiY2@cluster0.jecu5rj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("userDB");
    const users = database.collection("users");

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await users.insertOne(newUser);
      res.send(result);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);

      console.log(newUser);
    });

    app.get("/user/data", async (req, res) => {
      const data = users.find();
      const UserData = await data.toArray();
      res.send(UserData);
    });

    app.get("/user/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await users.findOne(query);

      if (!result) {
        return res.status(404).send({ message: "User not found" });
      }

      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await users.deleteOne(query);

      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello server");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
