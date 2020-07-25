const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('config');
const multer = require('multer');
module.exports={
    setPassword:function(password) { 
           const  salt = crypto.randomBytes(16).toString('hex'); 
           let hash = crypto.pbkdf2Sync(password, salt,  
           1000, 64, `sha512`).toString(`hex`); 

           return {password:hash,salt:salt};
       },
    comparePassword:function(password,hashedpassword,salt){
        let hash = crypto.pbkdf2Sync(password, salt,  
            1000, 64, `sha512`).toString(`hex`); 
            console.log("change password util",hash,hashedpassword);
        if(hash==hashedpassword){
            return true;
        }
        return false;
    },
    issueToken:async function(payload){
        let token = await jwt.sign(payload,config.get("Secret"),{expiresIn:'1d'},);
        return token;
    },
    fileUpload:function(){
       let storage =  multer.diskStorage({destination:function (req, file, cb) {
            cb(null,`${process.cwd()}/public/images/products`)
          },
        filename:function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now()+'.jpg')
          }})
       return storage;
    }
    
}