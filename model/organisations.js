/*jshint esversion: 6 */

var mongoose = require('mongoose');

var organisationSchema = new mongoose.Schema({
	orgname: 'string',
	addressLine1: 'string',
	addressLine2: 'string',
  city: 'string',
  state: 'string',
  zip: 'string'
});

mongoose.model('organisation',organisationSchema);
