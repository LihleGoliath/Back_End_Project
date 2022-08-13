const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM categories", (err, result) => {
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
      con.query(`SELECT * FROM categories WHERE category_id = '${req.params.id}}'`, (err, result) => {
          if (err) throw err;
          res.send(result);
      });
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
});

router.post("/",(req,res) => {
  const category = {
    name: req.body.name,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
  } 
  try {
    let sql = "INSERT INTO categories SET ?"
    con.query(sql, category
      , (err, result) => {
        if (err) throw err.message;
        res.send(result)})
  } catch (error) {
    res.send(error)
    // console.log(error);
  }
});

// router.patch("/",(req,res)=>{
//   const {
//      name,
//      description
//   } = req.body
//   try {
   
//     con.query(`SELECT * FROM categories WHERE name="${name}" and description = "${description}"`,(err,result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// } catch (error) {
//     console.log(error);
//     res.status(400).send(console.log(error))
// }
// })

router.put("/:id",(req,res) => {
  const {
        name,
        description,
        thumbnail
   
  }=req.body

try {
   
   
    con.query(`UPDATE categories SET  
    name ="${name}",
    description ="${description}",
    thumbnail ="${thumbnail}"
    WHERE category_id ="${req.params.id}"`, (err, result) => {
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
    con.query(`DELETE  FROM categories WHERE category_id='${req.params.id}'`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
} catch (error) {
    console.log(error);
    res.status(400).send(error)
}
    });


    module.exports = {
      devServer: {
          Proxy: '*'
      }
    }
module.exports = router;




































































































































































































































































































































































































































































































































