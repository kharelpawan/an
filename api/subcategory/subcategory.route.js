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
// create subcategory
router.post("/createsubcategory", checkAdmin, async (req, res) => {
  mySqlConnection.query(
    "SELECT * from subcategory where sc_name = ?",
    [req.body.name],
    async (err, rows, fields) => {
      if (rows.length != 0) {
        res.status(400).send({ message: "Duplicate", status: 0 });
      } else {
        const categoryid = req.body.categoryid;
        const subcategoryname = req.body.subcategoryname;
        const subcategorycode = req.body.subcategorycode;
        const detaillink = req.body.detaillink;
        const description = req.body.description;

        if (subcategoryname) {
          mySqlConnection.query(
            "INSERT INTO subcategory(c_id,sc_name,sc_code,sc_detail_link,sc_description) VALUES(?,?,?,?,?)",
            [
              categoryid,
              subcategoryname,
              subcategorycode,
              detaillink,
              description,
            ],
            (err, rows, fields) => {
              if (!err) {
                console.log(rows);
                res.status(201).send({
                  message: "Sub Category Added Successfully",
                  status: 1,
                });
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
//check
