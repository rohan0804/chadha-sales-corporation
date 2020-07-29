const Category = require("../models/category");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/roles");
const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const Utils = require("../utils/Utils");
const multer = require("multer");
const { raw } = require("express");
// const { where } = require("sequelize/types");
module.exports = {
  postLogin: async (req, res) => {
    const data = req.body;

    if (data.email && emailValidate.test(data.email)) {
      User.findOne({ where: { email: data.email } })
        .then(async (result) => {
          if (!result) {
            throw new Error("You are not registered");
          }
          const response = Utils.comparePassword(
            data.password,
            result.dataValues.password,
            result.salt
          );
          if (!response) {
            throw new Error("Incorrect Password");
          }
          let payload = {
            id: result.id,
            role: result.role_id,
          };
          let token = await Utils.issueToken(payload);

          res.cookie("jwt", token, { maxAge: 360000 });

          return res.redirect("/admin");
        })
        .catch((err) => {
          console.log(err.message);
          res.render("login", {
            error: err.message,
          });
        });
    }
  },
  postSignup: function (req, res) {
    try {
      const data = req.body;
      if (!data.email || !data.name || !data.password) {
        throw new Error("Missing_Parameters");
      }

      const result = Utils.setPassword(data.password);
      data.role_id = 1;
      data.password = result.password;
      data.salt = result.salt;
      User.create(data).then((result) => {
        if (!result) {
          throw new Error("DATABASE_ERROR");
        }
        return res.send(result);
      });
    } catch (error) {
      res.send(error.message);
      console.log(error.message);
    }
  },
  getLogin: (req, res) => {
    res.render("login", { error: undefined });
  },
  postCreateProduct: function (req, res) {
    try {
      let upload = multer({ storage: Utils.fileUpload() }).single("image");
      return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
          if (err) {
            return res.send(err.message);
          }
          const data = req.body;
          if (!data.name || !data.price || !data.description) {
            throw new Error("Missing Params");
          }
          console.log(data);
          data.show_on_home = data.show_on_home == "on" ? 1 : 0;
          data.image = req.file.filename;
          data.category_id = +data.category_id;
          Product.create(data).then((product) => {
            if (!product) {
              throw new Error("Server Error");
            }
            resolve();
            return res.send(product);
          });
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  deleteProduct: function (req, res) {
    try {
      const data = req.body;
      if (!data.id) {
        throw new Error("Missing params");
      }
      Product.destroy({ id: data.id }).then((result) => {
        res.send(result);
      });
    } catch (error) {
      res.send(error.message);
    }
  },
  updateProduct: function (req, res) {
    try {
      const data = req.body;
      const result = {};
      if (!data.id) {
        throw new Error("Missing params");
      }
      Product.update({ id: data.id }, data).then((result) => {
        res.send(result);
      });
    } catch (error) {
      res.send(error.message);
    }
  },
  getCreateProduct: async function (req, res) {
    let result = [];
    const categories = await Category.findAll();
    categories.map((category) => {
      result.push(category.dataValues);
    });
    console.log(result);
    res.render("addProduct", {
      categories: result,
    });
  },
  postChangePassword: function (req, res) {
    const user = req.user.dataValues.id;
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);
    User.findByPk(user)
      .then((result) => {
        console.log(
          "change password outside",
          result.dataValues.password,
          result.dataValues.salt
        );
        const finalresult = Utils.comparePassword(
          oldPassword,
          result.dataValues.password,
          result.dataValues.salt
        );
        console.log(finalresult);
        if (!finalresult) {
          throw new Error("Incorrect Curent Password");
        }
        let encrypt = Utils.setPassword(newPassword);
        console.log("encrypt", encrypt);
        User.update(
          { password: encrypt.password, salt: encrypt.salt },
          { where: { id: result.dataValues.id } }
        ).then((user) => {
          if (!result) {
            throw new Error("Password cannot be updated");
          }
          return res.send(user);
        });
      })
      .catch((error) => {
        res.send(error.message);
      });
  },
  getChangePassword: function (req, res) {
    res.render("changePassword");
  },
  getProducts: async function (req, res) {
    try {
      let condition = {};
      let result = [];
      let category =
        req.params.category !== undefined ? req.params.category : undefined;
      // console.log(category);
      if (category !== undefined && category != "all") {
        condition.category_id = category;
      }
      const category_data = await Category.findOne({
        raw: true,
        where: { id: req.params.category },
      });
      console.log(category_data);
      const products = await Product.findAll({ where: condition });
      products.map((product) => {
        result.push(product.dataValues);
      });
      console.log(result);
      res.render("product", {
        products: result,
        category_name: category_data.name,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
