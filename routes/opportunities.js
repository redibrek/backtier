var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
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

// build the REST operations at the base for opportunities
// this will be accessible from http://127.0.0.1:3000/opportunities if the default route for / is left unchanged
router.route('/')
    // GET all opportunities
    .get(function (req, res, next) {
      // retrieve all opportunities from Monogo
      mongoose.model('opportunity').find({}, function (err, opportunities) {
        if (err) {
          return console.error(err)
        } else {
        // respond to both HTML and JSON. JSON responses require 'Accept: application/json' in the Request Header
          res.format({
            // HTML response will render the index.jade file in the views/opportunities folder. We are also setting 'opportunities' to be an accessible variable in our jade view
            html: function () {
              res.render('opportunities/index', {
                title: 'All opportunities',
                'opportunities': opportunities
              })
            },
            // JSON response will show all opportunities in JSON format
            json: function () {
              res.json(opportunities)
            }
          })
        }
      })
    })
    // POST a new opportunity
    .post(function (req, res) {
      // Get values from POST request. These can be done through forms or REST calls. These rely on the 'name' attributes for forms
      var name = req.body.name
      var description = req.body.description
      var name = req.body.name
      var primarycontactname = req.body.primarycontactname

      // call the create function for our database
      mongoose.model('opportunity').create({
        name: name,
        description: description,
        name: name,
        primarycontactname: primarycontactname
      }, function (err, opportunity) {
        if (err) {
          res.send('There was a problem adding the information to the database.')
        } else {
          // opportunity has been created
          console.log('POST creating new opportunity: ' + opportunity)
          res.format({
            // HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
            html: function () {
              // If it worked, set the header so the address bar doesn't still say /adduser
              res.location('opportunities')
              // And forward to success page
              res.redirect('/opportunities')
            },
            // JSON response will show the newly created opportunity
            json: function () {
              res.json(opportunity)
            }
          })
        }
      })
    })

/* GET New opportunity page. */
router.get('/new', function (req, res) {
  res.render('opportunities/new', { title: 'Add New opportunity' })
})

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
  // console.log('validating ' + id + ' exists')
  // find the ID in the Database
  mongoose.model('opportunity').findById(id, function (err, opportunity) {
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
      // console.log(opportunity)
      // once validation is done save the new item in the req
      req.id = id
      // go to the next thing
      next()
    }
  })
})

router.route('/:id')
  .get(function (req, res) {
    mongoose.model('opportunity').findById(req.id, function (err, opportunity) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err)
      } else {
        console.log('GET Retrieving ID: ' + opportunity._id)

        res.format({
          html: function () {
            res.render('opportunities/show', {
              'opportunity': opportunity
            })
          },
          json: function () {
            res.json(opportunity)
          }
        })
      }
    })
  })

// GET the individual opportunity by Mongo ID
router.get('/:id/edit', function (req, res) {
  // search for the opportunity within Mongo
  mongoose.model('opportunity').findById(req.id, function (err, opportunity) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err)
    } else {
      // Return the opportunity
      console.log('GET Retrieving ID: ' + opportunity._id)
      res.format({
        // HTML response will render the 'edit.jade' template
        html: function () {
          res.render('opportunities/edit', {
            'opportunity': opportunity
          })
        },
        // JSON response will return the JSON output
        json: function () {
          res.json(opportunity)
        }
      })
    }
  })
})

// PUT to update a opportunity by ID
router.put('/:id/edit', function (req, res) {
  // Get our REST or form values. These rely on the 'name' attributes
  var name = req.body.name
  var description = req.body.description
  var name = req.body.name
  var primarycontactname = req.body.primarycontactname

  // find the document by ID
  mongoose.model('opportunity').findById(req.id, function (err, opportunity) {
    if (err) {
      console.log(err)
    } else {
      // update it
      opportunity.update({
        name: name,
        description: description,
        name: name,
        primarycontactname: primarycontactname
      }, function (err, opportunityID) {
        if (err) {
          res.send('There was a problem updating the information to the database: ' + err)
        } else {
          // HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function () {
              res.redirect('/opportunities/' + opportunity._id)
            },
            // JSON responds showing the updated values
            json: function () {
              res.json(opportunity)
            }
          })
        }
      })
    }
  })
})

// DELETE a opportunity by ID
router.delete('/:id/edit', function (req, res) {
    // find opportunity by ID
  mongoose.model('opportunity').findById(req.id, function (err, opportunity) {
    if (err) {
      return console.error(err)
    } else {
      // remove it from Mongo
      opportunity.remove(function (err, opportunity) {
        if (err) {
          return console.error(err)
        } else {
          // Returning success messages saying it was deleted
          console.log('DELETE removing ID: ' + opportunity._id)
          res.format({
            // HTML returns us back to the main page, or you can create a success page
            html: function () {
              res.redirect('/opportunities')
            },
              // JSON returns the item with the message that is has been deleted
            json: function () {
              res.json({message: 'deleted',
              item: opportunity
             })
            }
          })
        }
      })
    }
  })
})

module.exports = router
