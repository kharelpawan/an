const express = require("express");
const router = express.Router();
const mySqlConnection = require("../../config/db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const checkUser = require("../middleware/adminAuth");
var validator = require("validator");

let user;
// create user
router.post("/signup/user", async (req, res) => {
  mySqlConnection.query(
    "SELECT * from user where u_email = ?",
    [req.body.email],
    async (err, rows, fields) => {
      if (rows.length != 0) {
        res.status(400).send({ message: "Duplicate", status: 0 });
      } else {
        const username = req.body.username;
        const fullname = req.body.fullname;
        const email = req.body.email;
        const pass = bcrypt.hashSync(req.body.pass, salt);
        //const pass = req.body.pass;
        const contact = req.body.contact;
        const tempadd = req.body.tempadd;
        const gender = req.body.gender;
        const maincategory = req.body.maincategory;
        const optionalcategory = req.body.optionalcategory;
        console.log(pass);
        if (validator.isEmail("email") && contact.length == 10) {
          mySqlConnection.query(
            "INSERT INTO user(u_fullname,u_username,u_email,u_contact,u_gender,u_pass,u_tempadd,u_maincategory,u_optionalcategory) VALUES(?,?,?,?,?,?,?,?,?)",
            [
              fullname,
              username,
              email,
              contact,
              gender,
              pass,
              tempadd,
              maincategory,
              optionalcategory,
            ],
            (err, rows, fields) => {
              if (!err) {
                console.log(rows);
                res
                  .status(201)
                  .send({ message: "Created Successfully", status: 1 });
              } else {
                console.log(err);
                res.status(400).send(err.code);
              }
            }
          );
        } else {
          res.status(401).send({ message: "Invalid Email", status: 0 });
        }
      }
    }
  );
});

// login user
router.post("/user/login", async (req, res) => {
  mySqlConnection.query(
    "SELECT * from user where u_email = ?",
    [req.body.email],
    async (err, rows, fields) => {
      if (rows.length != 0) {
        console.log(rows[0].u_pass);
        console.log(req.body.pass);
        const result = bcrypt.compareSync(req.body.pass, rows[0].u_pass);
        console.log(result);
        if (result) {
          //if (rows[0].u_pass === req.body.pass) {
          var token = jwt.sign({ username: req.body.username }, "shhhhh");
          res
            .status(200)
            .send({ message: "Login Successfully", status: 1, token });
        } else {
          res.status(400).send({ message: "Incorrect Password", status: 0 });
        }
      } else {
        res
          .status(200)
          .send({ message: "Username and Password didn't matched", status: 0 });
      }
    }
  );
});

// router.patch("/admin/edit", checkAdmin, (req, res) => {
//   console.log("success");
// });

module.exports = router;
