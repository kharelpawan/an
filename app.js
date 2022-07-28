require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRoute = require("./api/admin/admin.route");
const userRoute = require("./api/user/user.route");
const categoryRoute = require("./api/category/category.route");
const subCategoryRoute = require("./api/subcategory/subcategory.route");

var cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is rest api working",
  });
});

const mySqlConnection = require("./config/db");

app.use(adminRoute);
app.use(userRoute);
app.use(categoryRoute);
app.use(subCategoryRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server running ..." + process.env.APP_PORT);
});
