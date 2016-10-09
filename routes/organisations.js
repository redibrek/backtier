var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// build the REST operations at the base for organisations
// this will be accessible from http://127.0.0.1:3000/organisations if the default route for / is left unchanged
router.route('/')
    // GET all organisations
    .get(function (req, res, next) {
      // retrieve all organisations from Monogo
      mongoose.model('organisation').find({}, function (err, organisations) {
        if (err) {
          return console.error(err)
        } else {
        // respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
          res.format({
              // HTML response will render the index.jade file in the views/organisations folder. We are also setting 'organisations' to be an accessible variable in our jade view
            html: function () {
              res.render('organisations/index', {
                title: 'All organisations',
                'organisations': organisations
              })
            },
            // JSON response will show all organisations in JSON format
            json: function () {
              res.json(organisations)
            }
          })
        }
      })
    })
    // POST a new organisation
    .post(function (req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the 'name' attributes for forms
      var orgname = req.body.orgname
      var addressLine1 = req.body.addressLine1
      var addressLine2 = req.body.addressLine2
      var city = req.body.city
      var state = req.body.state
      var zip = req.body.zip

      // call the create function for our database
      mongoose.model('organisation').create({
        orgname: orgname,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        zip: zip
      }, function (err, organisation) {
        if (err) {
          res.send('There was a problem adding the information to the database.')
        } else {
          // organisation has been created
          console.log('POST creating new organisation: ' + organisation)
          res.format({
            // HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
            html: function () {
              // If it worked, set the header so the address bar doesn't still say /adduser
              res.location('organisations')
              // And forward to success page
              res.redirect('/organisations')
            },
            // JSON response will show the newly created organisation
            json: function () {
              res.json(organisation)
            }
          })
        }
      })
    })

/* GET New organisation page. */
router.get('/new', function (req, res) {
  res.render('organisations/new', { title: 'Add New organisation' })
})

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
  // console.log('validating ' + id + ' exists');
  // find the ID in the Database
  mongoose.model('organisation').findById(id, function (err, organisation) {
    // if it isn't found, we are going to repond with 404
    if (err) {
      console.log(id + ' was not found')
      res.status(404)
      err = new Error('Not Found')
      err.status = 404
      res.format({
        html: function () {
          next(err)
        },
        json: function () {
          res.json({message: err.status + ' ' + err})
        }
      })
    // if it is found we continue on
    } else {
      // uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
      // console.log(organisation);
      // once validation is done save the new item in the req
      req.id = id
      // go to the next thing
      next()
    }
  })
})

router.route('/:id')
  .get(function (req, res) {
    mongoose.model('organisation').findById(req.id, function (err, organisation) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err)
      } else {
        console.log('GET Retrieving ID: ' + organisation._id)

        res.format({
          html: function () {
            res.render('organisations/show', {
              'organisation': organisation
            })
          },
          json: function () {
            res.json(organisation)
          }
        })
      }
    })
  })

// GET the individual organisation by Mongo ID
router.get('/:id/edit', function (req, res) {
  // Search for the organisation within Mongo
  mongoose.model('organisation').findById(req.id, function (err, organisation) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err)
    } else {
      // Return the organisation
      console.log('GET Retrieving ID: ' + organisation._id)
      res.format({
        // HTML response will render the 'edit.jade' template
        html: function () {
          res.render('organisations/edit', {
            'organisation': organisation
          })
        },
        // JSON response will return the JSON output
        json: function () {
          res.json(organisation)
        }
      })
    }
  })
})

// PUT to update a organisation by ID
router.put('/:id/edit', function (req, res) {
// Get our REST or form values. These rely on the 'name' attributes
  var orgname = req.body.orgname
  var addressLine1 = req.body.addressLine1
  var addressLine2 = req.body.addressLine2
  var city = req.body.city
  var state = req.body.state
  var zip = req.body.zip

  // find the document by ID
  mongoose.model('organisation').findById(req.id, function (err, organisation) {
    if (err) {
      console.log(err)
    } else {
  // Update it
      organisation.update({
        orgname: orgname,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        zip: zip
      }, function (err, organisationID) {
        if (err) {
          res.send('There was a problem updating the information to the database: ' + err)
        } else {
          // HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function () {
              res.redirect('/organisations/' + organisation._id)
            },
            // JSON responds showing the updated values
            json: function () {
              res.json(organisation)
            }
          })
        }
      })
    }
  })
})

// DELETE a organisation by ID
router.delete('/:id/edit', function (req, res) {
// Find organisation by ID
  mongoose.model('organisation').findById(req.id, function (err, organisation) {
    if (err) {
      return console.error(err)
    } else {
    // Remove it from Mongo
      organisation.remove(function (err, organisation) {
        if (err) {
          return console.error(err)
        } else {
          // Returning success messages saying it was deleted
          console.log('DELETE removing ID: ' + organisation._id)
          res.format({
            // HTML returns us back to the main page, or you can create a success page
            html: function () {
              res.redirect('/organisations')
            },
            // JSON returns the item with the message that is has been deleted
            json: function () {
              res.json({message: 'deleted',
              item: organisation
            })
            }
          })
        }
      })
    }
  })
})

module.exports = router
