const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const passport = require('passport');
router.post('/login',adminController.postLogin);
router.post('/signup',adminController.postSignup);
router.get('/login',adminController.getLogin);
router.get('/product/:category',adminController.getProducts);
router.get('/create/product',adminController.getCreateProduct);
router.post('/create/product',adminController.postCreateProduct);
router.get('/admin',(req,res)=>{
    res.render('index');
})
router.get('/change/password',passport.authenticate('jwt',{session:false}),adminController.getChangePassword);
router.post('/change/password',passport.authenticate('jwt',{session:false}),adminController.postChangePassword);
module.exports = router