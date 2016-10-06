/*jshint esversion: 6 */

var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
	fname: 'string',
	lname: 'string',
	email: 'string',
  phone: 'string',
  organisation: 'string'
});

mongoose.model('contact',contactSchema);
