const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('config');

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
  };
const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.get('Secret')
}


module.exports = (passport)=>{
    passport.use( new jwtStrategy(options,async function(jwt_payload,done){
        const user = await User.findOne({where:{id:jwt_payload.id}});
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }))
}

