const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM orders", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});

router.get("/:id", (req, res) => {
  try {
      con.query(`SELECT * FROM orders WHERE order_id = '${req.params.id}}'`, (err, result) => {
          if (err) throw err;
          res.send(result);
      });
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
});

router.post("/",(req,res) => {
  const order = {
    user_id: req.body.user_id ,
    amount: req.body.amount,
    shipping_address: req.body.shipping_address,
    order_email: req.body.order_email,
    order_date: req.body.order_date,
    order_status: req.body.order_status,
  } 
  try {
    let sql = "INSERT INTO orders SET ?"
    con.query(sql, order
      , (err, result) => {
        if (err) throw err.message;
        res.send(result)})
  } catch (error) {
    res.send(error)
    // console.log(error);
  }
});

router.patch("/",(req,res)=>{
  const {
     amount,
     shipping_address
  } = req.body
  try {
   
    con.query(`SELECT * FROM orders WHERE amount="${amount}" and shipping_address = "${shipping_address}"`,(err,result) => {
        if (err) throw err;
        res.send(result);
    });
} catch (error) {
    console.log(error);
    res.status(400).send(console.log(error))
}
})

router.put("/:id",(req,res) => {
  const {
        user_id,
        amount,
        shipping_address,
        order_email,
        order_date,
        order_status,
    
  }=req.body

try {
   
   
    con.query(`UPDATE orders SET  
    user_id ="${user_id}",
    amount ="${amount}",
    shipping_address ="${shipping_address}",
    order_email ="${order_email}",
    order_date ="${order_date}",
    order_status ="${order_status}",
    WHERE order_id ="${req.params.id}"   
    `, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
} catch (error) {
  console.log(error);
  res.status(400).send(error)
}
});


router.delete("/:id",(req,res)=> {
  try {
    con.query(`DELETE  FROM orders WHERE order_id='${req.params.id}'`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
} catch (error) {
    console.log(error);
    res.status(400).send(error)
}
    });


module.exports = router;