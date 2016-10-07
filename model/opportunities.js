/*jshint esversion: 6 */

var mongoose = require('mongoose');

var opportunitySchema = new mongoose.Schema({
	oppname: 'string',
	description: 'string',
	orgname: 'string',
  primarycontactname: 'string'
});

mongoose.model('opportunity',opportunitySchema);
