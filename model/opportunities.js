// Defines the schema for the Opportunities model

var mongoose = require('mongoose')

var opportunitySchema = new mongoose.Schema({
  name: 'string',
  description: 'string',
  name: 'string',
  primarycontactname: 'string',
  creationDate: 'date',
  lastUpdatedDate: 'date'
})

mongoose.model('opportunity', opportunitySchema)
