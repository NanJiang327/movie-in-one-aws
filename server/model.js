const mongoose = require('mongoose')
// Connect mongodb
// const DB_URL = 'mongodb://localhost:27017/movie-in-one'

const uri = "mongodb+srv://j499521010:123.comwyxx@cluster0-s97y5.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const models = {
  user: {
    'email': {type: String, require: true},
    'username': {type: String, require: true},
    'password': {type: String, require: true},
    'language': {type: String, require: true},
    'avatar': {type: String, require: false}
  },
  comment: {
    'userId': {type: String, require: true},
    'author': {type: String, require: true},
    'content': {type: String, require: true},
    'movieId': {type: String, require: true}
  }
    
}

for (let m in models) {
  mongoose.model(m, new mongoose.Schema(models[m]))
}

// User.create({
//   email: 'aaronj.9403@gmail.com',
//   password: '123.comwyxx'
// }, function(err, doc) {
//   if (!err) {
//     console.log(doc)
//   } else {
//     console.log(err)
//   }
// })

mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.on('connected', function(){
  console.log('mongo connect success')
})

module.exports = {
  getModel: function(name) {
    return mongoose.model(name)
  }
}