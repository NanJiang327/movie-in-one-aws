const express = require('express')
const model = require('./model')
const utils = require('utility')
const Router = express.Router()
const User = model.getModel('user')
const _filter = {'password': 0, '__v': 0}

Router.get('/list', function(req, res) {
  User.find({}, function(err, result) {
    return res.json(result)
  })
})

Router.get('/info', function(req, res){
  if (!req.session.userInfo) {
    return res.json({code: 1})
  }
  const userId = req.session.userInfo['_id']
  User.findOne({_id: userId}, _filter, function(err,result) {
    if (err) {
      return res.json({code: 1, msg: 'Something wrong. Please try again.'})
    }
    if (result) {
      return res.json({code: 0, data: req.session.userInfo})
    }
  })
})

Router.get('/logout', function(req, res) {
  console.log('Logut call')
  req.session.destroy(() => {
    res.clearCookie("userInfo", {})
    res.clearCookie("connect.sid", {path: '/'})
    res.json({code: 0, data: 'Logout'})
  })
})

Router.post('/changeLang', function(req, res) {
  const { username, language } = req.body
  User.updateOne({username}, {language}, function(err, docs) {
    if(err) console.log(err);
    console.log('Change success' + docs);
  })
})

Router.post('/login', function(req, res) {
  const { username, password } = req.body
  User.findOne({username, password: md5Password(password)}, _filter, function(err, result) {
    if (!result) {
      return res.json({code: 1, msg: 'Username doesn\'t exist or password incorrect.'})
    } else {
      req.session.userInfo = result
      return res.json({code: 0, data: result})
    }
  })
})

Router.post('/register', function(req, res) {
  const { username, email, password, language } = req.body
  return new Promise((resolve, reject) => {
    User.findOne({username} , _filter, function(err, result){
      if(result) {
        reject('Unfortunately, this username has been taken.')
      } else {
        resolve()
      }
    })
  }).then(() => {
    return new Promise((resolve, reject) => {
      User.findOne({email}, function(err, result){
        if(result) {
          reject('Unfortunately, this email has been taken.')
        } else {
          resolve()
        }
      })
    })
  }, err => {
    return Promise.reject(err)
  }).then(() => {
    const userModel = new User({username, email, password: md5Password(password), language})
    userModel.save(function (err, result) {
      if (err) {
        return res.json({code: 1, msg: 'Something wrong. Please try again.'})
      }
      const { username, email, _id, language } = result
      req.session.userInfo = result
      return res.json({code: 0, data: { username, email, _id, language }})
    })
  }, err => {
    return res.json({code: 1, msg: err})
  })
})

function md5Password(pwd) {
  const salt = 'imsoGrEAteaTFrontENDu7yh#@!#!dswq'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router