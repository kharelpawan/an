const express = require("express");
const router = express.Router();
const mySqlConnection = require("../../config/db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const checkAdmin = require("../middleware/adminAuth");

let user;
// create admin
router.post("/admin/signup", async (req, res) => {
  mySqlConnection.query(
    "SELECT * from admin where a_username = ?",
    [req.body.username],
    async (err, rows, fields) => {
      if (rows.length != 0) {
        res.status(400).send({ message: "Duplicate", status: 0 });
      } else {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.pass, salt);
        console.log(password);
        mySqlConnection.query(
          "INSERT INTO admin(a_username,a_pass) VALUES(? ,?)",
          [username, password],
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
      }
    }
  );
});

// login admin
router.post("/admin/login", async (req, res) => {
  mySqlConnection.query(
    "SELECT * from admin where a_username = ?",
    [req.body.username],
    async (err, rows, fields) => {
      if (rows.length != 0) {
        console.log(rows[0].a_pass);
        const result = bcrypt.compareSync(req.body.pass, rows[0].a_pass);
        if (result) {
          var token = jwt.sign({ username: req.body.username }, "shhhhh");
          console.log(token);
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

router.patch("/admin/edit", checkAdmin, (req, res) => {
  console.log("success");
});

// categories
// it includes 4 categories : loksewa , driving license , +2 entrance and bachelor entrance

router.post("/admin/category", checkAdmin, (req, res) => {
  mySqlConnection.query(
    "INSERT INTO category(name,code,detail_link,description) VALUES(?,?,?,?)",
    [req.body.name, req.body.code, req.body.detail_link, req.body.description],
    async (err, rows, fields) => {
      if (!err) {
        console.log(rows);
        res.status(201).send({ message: "Created Successfully", status: 1 });
      } else {
        console.log(err);
        res.status(400).send(err.code);
      }
    }
  );
});

module.exports = router;
