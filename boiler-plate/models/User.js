const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//salt를 이용해서 비밀번호 암호화 하므로 salt를 생성. saltRounds는 salt의 글자수 의미.
const saltRounds = 10
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique:1
    },
    password: {
        type:String,
        minlength:5
    },
    lastname: {
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default: 0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save',function(next){

    var user = this; // userschema를 가리킴 body-parser로 받아온..
    if (user.isModified('password')) {
        //비밀번호 암호화.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    }
    else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plain과 암호화된걸 체크해야됨 암호화된걸 복호화할 수는 없어서 plain도 암호화를 해야함.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken= function(cb){
    var user = this;
    // json web token을 이용해서 token을 생성하기
    
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    user.token = token
    user.save(function(err,user) {
        if(err) return cb(err)
        cb(null,user)
    })
    
}

const User = mongoose.model('User',userSchema)

module.exports = { User }