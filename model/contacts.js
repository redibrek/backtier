// Defines the schema for the Contacts model

var mongoose = require('mongoose')

var contactSchema = new mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  phone: 'string',
  organisation: 'string',
  creationDate: 'date',
  lastUpdatedDate: 'date'
})

mongoose.model('contact', contactSchema)
