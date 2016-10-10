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

// build the REST operations at the base for roimodels
// this will be accessible from http://127.0.0.1:3000/roimodels if the default route for / is left unchanged
router.route('/')
    // GET All ROI Models
    .get(function (req, res, next) {
      // retrieve All ROI Models from Monogo
      mongoose.model('roimodel').find({}, function (err, roimodels) {
        if (err) {
          return console.error(err)
        } else {
        // respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
          res.format({
              // HTML response will render the index.jade file in the views/roimodels folder. We are also setting 'roimodels' to be an accessible variable in our jade view
            html: function () {
              res.render('roimodels/index', {
                title: 'All ROI Models',
                'roimodels': roimodels
              })
            },
            // JSON response will show All ROI Models in JSON format
            json: function () {
              res.json(roimodels)
            }
          })
        }
      })
    })
    // POST a new roimodel
    .post(function (req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the 'name' attributes for forms
      var name = req.body.name
      var description = req.body.description
      var valueAName = req.body.valueAName
      var valueAQty = req.body.valueAQty
      var valueACost = req.body.valueACost
      var valueACdssReduction = req.body.valueACdssReduction
      var valueBName = req.body.valueBName
      var valueBQty = req.body.valueBQty
      var valueBCost = req.body.valueBCost
      var valueBCdssReduction = req.body.valueBCdssReduction
      var valueCName = req.body.valueCName
      var valueCQty = req.body.valueCQty
      var valueCCost = req.body.valueCCost
      var valueCCdssReduction = req.body.valueCCdssReduction
      var valueDName = req.body.valueDName
      var valueDQty = req.body.valueDQty
      var valueDCost = req.body.valueDCost
      var valueDCdssReduction = req.body.valueDCdssReduction
      var valueEName = req.body.valueEName
      var valueEQty = req.body.valueEQty
      var valueECost = req.body.valueECost
      var valueECdssReduction = req.body.valueECdssReduction
      var valueFName = req.body.valueFName
      var valueFQty = req.body.valueFQty
      var valueFCost = req.body.valueFCost
      var valueFCdssReduction = req.body.valueFCdssReduction
      var valueGName = req.body.valueGName
      var valueGQty = req.body.valueGQty
      var valueGCost = req.body.valueGCost
      var valueGCdssReduction = req.body.valueGCdssReduction
      var creationDate = req.body.creationDate
      var lastUpdatedDate = req.body.lastUpdatedDate

      // call the create function for our database
      mongoose.model('roimodel').create({
        name: name,
        description: description,
        valueAName: valueAName,
        valueAQty: valueAQty,
        valueACost: valueACost,
        valueACdssReduction: valueACdssReduction,
        valueBName: valueBName,
        valueBQty: valueBQty,
        valueBCost: valueBCost,
        valueBCdssReduction: valueBCdssReduction,
        valueCName: valueCName,
        valueCQty: valueCQty,
        valueCCost: valueCCost,
        valueCCdssReduction: valueCCdssReduction,
        valueDName: valueDName,
        valueDQty: valueDQty,
        valueDCost: valueDCost,
        valueDCdssReduction: valueDCdssReduction,
        valueEName: valueEName,
        valueEQty: valueEQty,
        valueECost: valueECost,
        valueECdssReduction: valueECdssReduction,
        valueFName: valueFName,
        valueFQty: valueFQty,
        valueFCost: valueFCost,
        valueFCdssReduction: valueFCdssReduction,
        valueGName: valueGName,
        valueGQty: valueGQty,
        valueGCost: valueGCost,
        valueGCdssReduction: valueGCdssReduction,
        creationDate: creationDate,
        lastUpdatedDate: lastUpdatedDate
      }, function (err, roimodel) {
        if (err) {
          res.send('There was a problem adding the information to the database.' + (err))
        } else {
          // roimodel has been created
          console.log('POST creating new ROI Model: ' + roimodel)
          res.format({
            // HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
            html: function () {
              // If it worked, set the header so the address bar doesn't still say /adduser
              res.location('roimodels')
              // And forward to success page
              res.redirect('/roimodels')
            },
            // JSON response will show the newly created roimodel
            json: function () {
              res.json(roimodel)
            }
          })
        }
      })
    })

/* GET New roimodel page. */
router.get('/new', function (req, res) {
  res.render('roimodels/new', { title: 'Add New ROI Model' })
})

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
  // console.log('validating ' + id + ' exists');
  // find the ID in the Database
  mongoose.model('roimodel').findById(id, function (err, roimodel) {
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
      // console.log(roimodel);
      // once validation is done save the new item in the req
      req.id = id
      // go to the next thing
      next()
    }
  })
})

router.route('/:id')
  .get(function (req, res) {
    mongoose.model('roimodel').findById(req.id, function (err, roimodel) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err)
      } else {
        console.log('GET Retrieving ID: ' + roimodel._id)

        res.format({
          html: function () {
            res.render('roimodels/show', {
              title: 'ROI Model Details',
              'roimodel': roimodel
            })
          },
          json: function () {
            res.json(roimodel)
          }
        })
      }
    })
  })

// GET the individual roimodel by Mongo ID
router.get('/:id/edit', function (req, res) {
  // Search for the roimodel within Mongo
  mongoose.model('roimodel').findById(req.id, function (err, roimodel) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err)
    } else {
      // Return the roimodel
      console.log('GET Retrieving ID: ' + roimodel._id)
      res.format({
        // HTML response will render the 'edit.jade' template
        html: function () {
          res.render('roimodels/edit', {
            title: 'Edit ROI Model',
            'roimodel': roimodel
          })
        },
        // JSON response will return the JSON output
        json: function () {
          res.json(roimodel)
        }
      })
    }
  })
})

// PUT to update a roimodel by ID
router.put('/:id/edit', function (req, res) {
// Get our REST or form values. These rely on the 'name' attributes
  var name = req.body.name
  var description = req.body.description
  var valueAName = req.body.valueAName
  var valueAQty = req.body.valueAQty
  var valueACost = req.body.valueACost
  var valueACdssReduction = req.body.valueACdssReduction
  var valueBName = req.body.valueBName
  var valueBQty = req.body.valueBQty
  var valueBCost = req.body.valueBCost
  var valueBCdssReduction = req.body.valueBCdssReduction
  var valueCName = req.body.valueCName
  var valueCQty = req.body.valueCQty
  var valueCCost = req.body.valueCCost
  var valueCCdssReduction = req.body.valueCCdssReduction
  var valueDName = req.body.valueDName
  var valueDQty = req.body.valueDQty
  var valueDCost = req.body.valueDCost
  var valueDCdssReduction = req.body.valueDCdssReduction
  var valueEName = req.body.valueEName
  var valueEQty = req.body.valueEQty
  var valueECost = req.body.valueECost
  var valueECdssReduction = req.body.valueECdssReduction
  var valueFName = req.body.valueFName
  var valueFQty = req.body.valueFQty
  var valueFCost = req.body.valueFCost
  var valueFCdssReduction = req.body.valueFCdssReduction
  var valueGName = req.body.valueGName
  var valueGQty = req.body.valueGQty
  var valueGCost = req.body.valueGCost
  var valueGCdssReduction = req.body.valueGCdssReduction
  var creationDate = req.body.creationDate
  var lastUpdatedDate = req.body.lastUpdatedDate

  // find the document by ID
  mongoose.model('roimodel').findById(req.id, function (err, roimodel) {
    if (err) {
      console.log(err)
    } else {
  // Update it
      roimodel.update({
        name: name,
        description: description,
        valueAName: valueAName,
        valueAQty: valueAQty,
        valueACost: valueACost,
        valueACdssReduction: valueACdssReduction,
        valueBName: valueBName,
        valueBQty: valueBQty,
        valueBCost: valueBCost,
        valueBCdssReduction: valueBCdssReduction,
        valueCName: valueCName,
        valueCQty: valueCQty,
        valueCCost: valueCCost,
        valueCCdssReduction: valueCCdssReduction,
        valueDName: valueDName,
        valueDQty: valueDQty,
        valueDCost: valueDCost,
        valueDCdssReduction: valueDCdssReduction,
        valueEName: valueEName,
        valueEQty: valueEQty,
        valueECost: valueECost,
        valueECdssReduction: valueECdssReduction,
        valueFName: valueFName,
        valueFQty: valueFQty,
        valueFCost: valueFCost,
        valueFCdssReduction: valueFCdssReduction,
        valueGName: valueGName,
        valueGQty: valueGQty,
        valueGCost: valueGCost,
        valueGCdssReduction: valueGCdssReduction,
        creationDate: creationDate,
        lastUpdatedDate: lastUpdatedDate
      }, function (err, roimodelID) {
        if (err) {
          res.send('There was a problem updating the information to the database: ' + err)
        } else {
          // HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function () {
              res.redirect('/roimodels/' + roimodel._id)
            },
            // JSON responds showing the updated values
            json: function () {
              res.json(roimodel)
            }
          })
        }
      })
    }
  })
})

// DELETE a roimodel by ID
router.delete('/:id/edit', function (req, res) {
// Find roimodel by ID
  mongoose.model('roimodel').findById(req.id, function (err, roimodel) {
    if (err) {
      return console.error(err)
    } else {
    // Remove it from Mongo
      roimodel.remove(function (err, roimodel) {
        if (err) {
          return console.error(err)
        } else {
          // Returning success messages saying it was deleted
          console.log('DELETE removing ID: ' + roimodel._id)
          res.format({
            // HTML returns us back to the main page, or you can create a success page
            html: function () {
              res.redirect('/roimodels')
            },
            // JSON returns the item with the message that is has been deleted
            json: function () {
              res.json({message: 'deleted',
              item: roimodel
            })
            }
          })
        }
      })
    }
  })
})

module.exports = router
