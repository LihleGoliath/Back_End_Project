const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth")
const user = require("../routes/userRoute")

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM products", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});

router.get("/:id",(req, res) => {
  try {
      con.query(`SELECT * FROM products WHERE product_id = '${req.params.id}}'`, (err, result) => {
          if (err) throw err;
          res.send(result);
      });
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
});

router.post("/",(req,res) => {
    // if(req.user.user_type === "admin" ){


        const product = {
          sku: req.body.sku,
          name: req.body.name,
          price: req.body.price,
          weight: req.body.weight,
          descriptions: req.body.descriptions,
          thumbnail: req.body.thumbnail,
          image: req.body.image,
          category: req.body.category,
          create_date:req.body.create_date,
          stock:req.body.stock
        } 
        try {
          let sql = "INSERT INTO products SET ?"
          con.query(sql, product
            , (err, result) => {
              if (err) throw err.message;
              res.send(result)})
        } catch (error) {
          res.send(error)
          // console.log(error);
        }
    // }else{
    //     res.send("Not ALLOWED")
    // }
});

// router.patch("/",(req,res)=>{
//   const {
//      sku,
//      name
//   } = req.body
//   try {
   
//     con.query(`SELECT * FROM products WHERE sku="${sku}" and name = "${name}"`,(err,result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// } catch (error) {
//     console.log(error);
//     res.status(400).send(console.log(error))
// }
// })

router.put("/:id",middleware,(req,res) => {
    

    if(req.user.user_type === "admin" ){
  const {
        sku,
        name,
        price,
        weight,
        descriptions,
        thumbnail,
        image,
        category,
        create_date,
        stock
  }=req.body

try {
   
   
    con.query(`UPDATE products SET  
    sku ="${sku}",
    name ="${name}",
    price ="${price}",
    weight ="${weight}",
    descriptions ="${descriptions}",
    thumbnail="${thumbnail}",
    image ="${image}",
    category ="${category}",
    create_date ="${create_date}",
    stock ="${stock}"
    WHERE product_id ="${req.params.id}"
    
    
    `, (err, result) => {
        if (err) throw err.message;
        res.send(result);
    });
} catch (error) {
  console.log(error);
  res.status(400).send(error)
}
}else{
    res.send("Not ALLOWED")
}
});


router.delete("/:id",(req,res)=> {
    // if(req.user.user_type === "admin" ){
  try {
    con.query(`DELETE  FROM products WHERE product_id='${req.params.id}'`, (err, result) => {
        if (err) throw err.message;
        res.send(result);
    });
} catch (error) {
    console.log(error);
    res.status(400).send(error)
}
// }else{
//     res.send("Not ALLOWED")
// }
    });


    module.exports = {
        devServer: {
            Proxy: '*'
        }
    }
module.exports = router;