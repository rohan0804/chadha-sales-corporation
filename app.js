const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
const adminRoutes = require("./routes/admin");
const Category = require("./models/category");
const Product = require("./models/product");
const User = require("./models/user");
const Role = require("./models/roles");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("./utils/passportconfig")(passport);
app.use(passport.initialize());
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(expressLayouts);
app.use(adminRoutes);

Product.belongsTo(Category, {as:'categories', foreignKey: "category_id" });

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

let port = 2000;

app.get("/", async (req, res, next) => {
  //   res.send("<h1>chadda sales corporations</h1>");
  const result = [];
  const categories = await Category.findAll();
  categories.map((category) => {
    result.push(category.dataValues);
  });
  res.render("homepage", {
    categories: result,
  });
});
app.get("/aboutus", (req, res, next) => {
  //   res.send("<h1>chadda sales corporations</h1>");
  res.render("aboutus");
});

app.get("/products", (req, res, next) => {
  res.render("product");
});

app.listen(2000, (req, res) => {
  console.log(`server is listening at port ${port}`);
});
