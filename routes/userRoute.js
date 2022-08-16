const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middleware = require("../middleware/auth");
const nodemailer = require("nodemailer");
require("dotenv").config();


// Register Route
// The Route where Encryption starts
router.post("/register",  async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  try {
    let sql = "INSERT INTO users SET ?";
    const salt = await bcrypt.genSaltSync(10);
    const password = await req.body.password;
    const hash = await bcrypt.hashSync(password, salt);

    let user =  await { 
      full_name:full_name.req.body,
      email:email.req.body,
      // We sending the hash value to be stored within the table
      password:hash,
      user_type:user_type.req.body,
      phone:phone.req.body,
      country:country.req.body
    };   
    con.query(sql,user, (err, result) => {
      if (err) throw err;
      console.log(result);
       res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Login
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    console.log(user);
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          // The information the should be stored inside token
          const payload = {
            user: {
              user_id: result[0].user_id,
              full_name: result[0].full_name,
              email: result[0].email,
              user_type: result[0].user_type,
              phone: result[0].phone,
              country: result[0].country,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/forgot-psw', (req, res) => {
  try {
  let sql = "SELECT * FROM users WHERE ?";
  let user = {
    email: req.body.email,
  };
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    console.log(result);
    if(result === 0) {
      res.status(400), res.send("Email not found")
    }
    else {

      // Allows me to connect to the given email account || Your Email
      const transporter = nodemailer.createTransport({
        host: process.env.MAILERHOST,
        port: process.env.MAILERPORT,
        auth: {
          user: process.env.MAILERUSER,
          pass: process.env.MAILERPASS,
        },
      });

      // How the email should be sent out
    var mailData = {
      from: process.env.MAILERUSER,
      // Sending to the person who requested
      to: result[0].email,

      subject: 'Password Reset',
      html:
        `<div>
          <h3>Hi ${result[0].full_name},</h3>
          <br>
          <h4>Click link below to reset your password</h4>

          <a href="https://http://localhost:8081/reset-psw.html">
            Click Here to Reset Password
            user_id = ${result[0].user_id}
          </a>

          <br>
          <p>For any queries feel free to contact us...</p>
          <div>
            Email: ${process.env.MAILERUSER}
            <br>
            Tel: If needed you can add this
          <div>
        </div>`
    };

    // Check if email can be sent
    // Check password and email given in .env file
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email valid! ', success)
      }
    });

    transporter.sendMail(mailData,  (error, info) => {
      if (error) {
        console.log(error);
      } else {
        res.send('Please Check your email', result[0].user_id)
      }
    });

    }
  });
} catch (error) {
  console.log(error);
}
});
router.put('reset-psw/:id', (req, res) => {
  let sql = "SELECT * FROM users WHERE ?";
  let user = {
    user_id: req.params.id,
  };
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    if (result === 0) {
      res.status(400), res.send("User not found");
    } else {
      let newPassword = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const updatedPassword = {
        full_name: result[0].full_name,
        email: result[0].email,
        user_type: result[0].user_type,
        phone: result[0].phone,
        country: result[0].country,


        // Only thing im changing in table
        password: hash,
      };

      con.query(newPassword, updatedPassword, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Password Updated please login");
      });
    }
  });
});


// Verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});


router.get("/", (req, res) => {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql,(err, result) => {
      if (err) throw err;
        res.send(result)
    });
  } catch (error) {
    console.log(error);
  }
});

// 
// The Route where Decryption happens
// router.post("/login", (req, res) => {
//   try {
//     let sql = "SELECT * FROM users WHERE ?";
//     let user = {
//       email: req.body.email
//     };
//     con.query(sql, user, async (err, result) => {
//       if (err) throw err;
//       if (result.length === 0) {
//         res.send("Email not found please register");
//       } else {
//         // Decryption
//         // Accepts the password stored in database and the password given by user (req.body)
//         const isMatch = await bcrypt.compare(
//           req.body.password,
//           result[0].hash
//         );
//         // If password does not match
//         if (!isMatch) {
//           res.send("Password incorrect");
//         }
//         else {
//           res.send(result)
//         }
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });









router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM users", (err, result) => {
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
      con.query(`SELECT * FROM users WHERE user_id = '${req.params.id}}'`, (err, result) => {
          if (err) throw err;
          res.send(result);
      });
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
});

// router.post("/",(req,res) => {
//   const user = {
//     email: req.body.email,
//     password: req.body.password,
//     full_name: req.body.full_name,
//     billing_address: req.body.billing_address,
//     default_shipping_address: req.body.default_shipping_address,
//     country: req.body.country,
//     phone: req.body.phone,
//     user_type: req.body.user_type
//   } 
//   try {
//     let sql = "INSERT INTO users SET ?"
//     con.query(sql, user
//       , (err, result) => {
//         if (err) throw err.message;
//         res.send(result)})
//   } catch (error) {
//     res.send(error)
//     // console.log(error);
//   }
// });

// router.patch("/",(req,res)=>{
//   const {
//      email,
//      password
//   } = req.body
//   try {
   
//     con.query(`SELECT * FROM users WHERE email="${email}" and password = "${password}"`,(err,result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// } catch (error) {
//     console.log(error);
//     res.status(400).send(console.log(error))
// }
// })

router.put("/:id",middleware,(req,res) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const user = {
        email: req.body.email,
        password :hash ,
        full_name:req.body.full_name,
        billing_address:req.body.billing_address,
        default_shipping_address:req.body.default_shipping_address,
        country:req.body.country,
        phone:req.body.phone
  }

try {   
   let sql = `UPDATE users SET ? WHERE user_id ="${req.params.id}"`
    con.query( sql,user  
    , (err, result) => {
        if (err) throw err;
        res.send(result);
    });
} catch (error) {
  console.log(error);
  res.status(400).send(error)
}
});


// router.delete("/:id",(req,res)=> {
//   try {
//     con.query(`DELETE  FROM users WHERE user_id='${req.params.id}'`, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// } catch (error) {
//     console.log(error);
//     res.status(400).send(error)
// }
//     });



module.exports = router;