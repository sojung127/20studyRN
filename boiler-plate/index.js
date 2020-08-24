const express = require('express')
const app = express()
const port = 3000
const bodyParser= require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')

const mongoose = require('mongoose')
const { User } = require('./models/User')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! ')
})

// register. 회원가입을 위한 route
app.post('/register',(req,res) => {


  const user = new User(req.body)
  //save 전에 비밀번호 암호화
  user.save((err,userInfo)=> {
    if(err) return res.json( { success: false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/login',(req,res) => {
  //요청된 이메일을 데이터베이스에서 찾는다
  User.findOne({ email: req.body.email },(err,user)=> {
      if(!user){
          return res.json({
              loginSuccess: false,
              message:"이메일을 찾을 수 없습니다."
          })
      }
      // 비밀번호가 이메일과 일치하는지 확인
      user.comparePassword(req.body.password, (err,isMatch)=> {
          if(!isMatch)
            return res.json({ loginSuccess:false, message:"비밀번호가 틀렸습니다."})

          user.generateToken((err,user)=> {
            if(err) return res.status(400).send(err);
            // 토큰을 쿠키 혹은 local strage등에 저장한다.
            res.cookie("x_auth",user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id})
          })
      })
  })

  // 비밀번호 확인 후 토큰 생성
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})