const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const expressLayouts = require("express-ejs-layouts");
const Category = require("./models/category");
const Product = require("./models/product");
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

Product.belongsTo(Category, { foreignKey: "category_id" });
sequelize
  .sync()
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

let port = 2000;

app.get("/", (req, res, next) => {
  //   res.send("<h1>chadda sales corporations</h1>");
  res.render("homepage");
});
app.listen(2000, (req, res) => {
  console.log(`server is listening at port ${port}`);
});
