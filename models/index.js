const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose
var MONGODB_URL =
    'mongodb+srv://Jenish4024:Jenish4024@codebyte.1uoga.mongodb.net/codebyte?retryWrites=true&w=majority'
db.mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //don't show the log when it is test
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to %s', MONGODB_URL)
            console.log('App is running ... \n')
            console.log('Press CTRL + C to stop the process. \n')
        }
    })
    .catch((err) => {
        console.error('App starting error:', err.message)
        process.exit(1)
    })
// db.user = require("./userModel");
db.problem = require('./problemsModel')
// db.submission = require("./submissionModel");

module.exports = db
