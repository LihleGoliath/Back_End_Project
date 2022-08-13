const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally


const app = express(); // Initialize express as an app variable


app.set("port", process.env.PORT || 3000); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Don't let local development give errors


 



//import userRoute
const userRoute = require("./routes/userRoute");
const productsRoute = require("./routes/ProductsRoute");
const ordersRoute = require("./routes/OrdersRoute");
const categoryRoute = require("./routes/categoryRoute");

app.get("/", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
   res.send(`
    <h1>Database Hosted</h1>
    <div style="background-color:green;text-align:center; width:100vw;font-size:2rem;">SUCCESSFUL</div>   
   `)
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