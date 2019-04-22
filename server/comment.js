const express = require('express')
const model = require('./model')
const Router = express.Router()
const Comment = model.getModel('comment')

Router.post('/post', function(req, res) {
  const { author, userId, content, movieId } = req.body
  const commentModel = new Comment({ author, userId, content, movieId })
  commentModel.save(function (err, result) {
    if (err) {
      return res.json({code: 1, msg: 'Something wrong. Please try again.'})
    }
    if (result) {
      return res.json({code: 0})
    }
  })
})

Router.get('/:movieId', function(req, res) {
  const movieId = req.params.movieId
  Comment.find({movieId}, function(err, result) {
    if(err) {
      return res.json({code: 1, msg: 'Something wrong. Please try again.'})
    }
    if (result && result.length != 0) {
      return res.json({code: 0, data: result})
    } else {
      return res.json({code: 1})
    }
  })
})


module.exports = Router