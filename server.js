const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session  = require('express-session')

const userRouter = require('./server/user')
const commentRouter = require('./server/comment')
const path = require('path')

const app = express()
app.use(cors());

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

app.use(express.static(path.join(__dirname, "client/build")))

console.log(path.join(__dirname, "client/build"))

app.use(cookieParser())
app.use(session({
  secret: "movie",
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 1000 * 30}
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/user', userRouter)
app.use('/comment', commentRouter)


app.listen(5001, function(){
  console.log('Node app start at port 5001')
})