const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const bodyParser = require('body-parser');

const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 3000); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Don't let local development give errors
app.use(express.static("public"));

 
app.use(bodyParser.urlencoded({ extended: false }))


//import userRoute
const userRoute = require("./routes/userRoute");
const productsRoute = require("./routes/ProductsRoute");
const ordersRoute = require("./routes/OrdersRoute");
const categoryRoute = require("./routes/categoryRoute");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080/#/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
 



app.get("/", (req, res) => {
   res.send(`
    <h1 st>Database Hosted</h1>
    <div style="background-color:green;text-align:center; width:100vw;font-size:2rem;">SUCCESSFUL</div>   
   `)
});
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/#/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use("/users",userRoute);
app.use("/products",productsRoute);
app.use("/orders",ordersRoute);
app.use("/category",categoryRoute);

app.listen(app.get("port"), () => {
    console.log(`http://localhost:${app.get("port")}`);
    console.log("Press Ctrl+C to exit server");
});