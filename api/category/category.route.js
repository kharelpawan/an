const express = require("express");
const router = express.Router();
const mySqlConnection = require("../../config/db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const checkAdmin = require("../middleware/adminAuth");
var validator = require("validator");

let user;
// create category
router.post("/createcategory", checkAdmin, async (req, res) => {
  mySqlConnection.query(
    "SELECT * from category where c_name = ?",
    [req.body.name],
    async (err, rows, fields) => {
      if (rows.length != 0) {
        res.status(400).send({ message: "Duplicate", status: 0 });
      } else {
        const categoryname = req.body.categoryname;
        const categorycode = req.body.categorycode;
        const detaillink = req.body.detaillink;
        const description = req.body.description;
        const createdat = req.body.createdat;

        if (categoryname) {
          mySqlConnection.query(
            "INSERT INTO category(c_name,c_code,c_detail_link,c_description) VALUES(?,?,?,?)",
            [categoryname, categorycode, detaillink, description],
            (err, rows, fields) => {
              if (!err) {
                console.log(rows);
                res
                  .status(201)
                  .send({ message: "Category Added Successfully", status: 1 });
              } else {
                console.log(err);
                res.status(400).send(err.code);
              }
            }
          );
        } else {
          res.status(401).send({ message: "Invalid Request", status: 0 });
        }
      }
    }
  );
});

// router.patch("/admin/edit", checkAdmin, (req, res) => {
//   console.log("success");
// });

module.exports = router;
