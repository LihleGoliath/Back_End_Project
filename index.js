const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const bodyParser = require('body-parser');

const app = express(); // Initialize express as an app variable
// Set header

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

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
 



app.get("/", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
   res.send(`
    <h1 st>Database Hosted</h1>
    <div style="background-color:green;text-align:center; width:100vw;font-size:2rem;">SUCCESSFUL</div>   
   `)
});


  app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
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
module.exports = {
    devServer: {
        Proxy: '*'
    }
}