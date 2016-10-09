// Defines the schema for the Opportunities model

var mongoose = require('mongoose')

var opportunitySchema = new mongoose.Schema({
  oppname: 'string',
  description: 'string',
  orgname: 'string',
  primarycontactname: 'string',
  creationDate: 'date',
  lastUpdatedDate: 'date'
})

mongoose.model('opportunity', opportunitySchema)
