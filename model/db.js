// Defines the connection to the datastore
// MongoDB is the configured datastore, situated at localhost/emberData

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/emberData')
