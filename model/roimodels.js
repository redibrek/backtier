// Defines the schema for the Organisations model

var mongoose = require('mongoose')

var roimodelSchema = new mongoose.Schema({
  name: 'string',
  description: 'string',
  valueAName: 'string',
  valueAQty: 'number',
  valueACost: 'number',
  valueACdssReduction: 'number',
  valueBName: 'string',
  valueBQty: 'number',
  valueBCost: 'number',
  valueBCdssReduction: 'number',
  valueCName: 'string',
  valueCQty: 'number',
  valueCCost: 'number',
  valueCCdssReduction: 'number',
  valueDName: 'string',
  valueDQty: 'number',
  valueDCost: 'number',
  valueDCdssReduction: 'number',
  valueEName: 'string',
  valueEQty: 'number',
  valueECost: 'number',
  valueECdssReduction: 'number',
  valueFName: 'string',
  valueFQty: 'number',
  valueFCost: 'number',
  valueFCdssReduction: 'number',
  valueGName: 'string',
  valueGQty: 'number',
  valueGCost: 'number',
  valueGCdssReduction: 'number',
  creationDate: 'number',
  lastUpdatedDate: 'number'
})

mongoose.model('roimodel', roimodelSchema)
