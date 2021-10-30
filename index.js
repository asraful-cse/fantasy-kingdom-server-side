const express = require("express");
const { MongoClient } = require("mongodb");

// mongodb er id jonno
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
// middleware 1 by cors must be use
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;
// middleware 2,3 by cors must be use
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v25nn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db("fantasyKingdom");
		const servicesCollection = database.collection("services");
		const ordersCollection = client.db("fantasyKingdom").collection("orders");
		// post api --------------------------------------
		app.post("/addEvent", async (req, res) => {
			const event = req.body;

			console.log("hits the post api", event);
			const result = await servicesCollection.insertOne(event);
			console.log("this is service result", result);
			res.json(result);
		});

		// get products.......................................................
		//  make route and get data
		app.get("/products", (req, res) => {
			servicesCollection.find({}).toArray((err, results) => {
				res.send(results);
			});
		});

		//  Add order-----------------------------------------------------
		app.post("/addOrder", (req, res) => {
			console.log(req.body);
			ordersCollection.insertOne(req.body).then((result) => {
				res.send(result);
			});
		});
		// get all order by email query
		app.get("/myOrders/:email", (req, res) => {
			console.log(req.params);
			ordersCollection
				.find({ email: req.params.email })
				.toArray((err, results) => {
					res.send(results);
				});
		});
		console.log("connected to database");
	} finally {
		//   await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Fantasy kingdom server connection ok >>>>>>");
});

app.listen(port, () => {
	console.log(`running my server port on`, port);
});
