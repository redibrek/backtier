// Defines the schema for the Organisations model

var mongoose = require('mongoose')

var organisationSchema = new mongoose.Schema({
  name: 'string',
  addressLine1: 'string',
  addressLine2: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  creationDate: 'date',
  lastUpdatedDate: 'date'
})

mongoose.model('organisation', organisationSchema)
