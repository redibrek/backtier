var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

router.route('/')
  .get(function (req, res, next) {
    mongoose.model('contact').find({}, function (err, contacts) {
      if (err) {
        return console.error(err)
      } else {
        res.format({
          html: function () {
            res.render('contacts/index', {
              title: 'All Contacts',
              'contacts': contacts
            })
          },
          json: function () {
            res.json(contacts)
          }
        })
      }
    })
  })
  .post(function (req, res) {
    var fname = req.body.fname
    var lname = req.body.lname
    var email = req.body.email
    var phone = req.body.phone
    var organisation = req.body.organisation

    mongoose.model('contact').create({
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      organisation: organisation
    }, function (err, contact) {
      if (err) {
        res.send('There was a problem adding the information to the database.')
      } else {
        console.log('POST creating new contact: ' + contact)
        res.format({
          html: function () {
            res.location('contacts')
            res.redirect('/contacts')
          },
          json: function () {
            res.json(contact)
          }
        })
      }
    })
  })

router.get('/new', function (req, res) {
  res.render('contacts/new', { title: 'Add New contact' })
})

router.param('id', function (req, res, next, id) {
  mongoose.model('contact').findById(id, function (err, contact) {
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
    } else {
      req.id = id
      next()
    }
  })
})

router.route('/:id')
  .get(function (req, res) {
    mongoose.model('contact').findById(req.id, function (err, contact) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err)
      } else {
        console.log('GET Retrieving ID: ' + contact._id)

        res.format({
          html: function () {
            res.render('contacts/show', {
              'contact': contact
            })
          },
          json: function () {
            res.json(contact)
          }
        })
      }
    })
  })

router.get('/:id/edit', function (req, res) {
  mongoose.model('contact').findById(req.id, function (err, contact) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err)
    } else {
      console.log('GET Retrieving ID: ' + contact._id)
      res.format({
        html: function () {
          res.render('contacts/edit', {
            'contact': contact
          })
        },
        json: function () {
          res.json(contact)
        }
      })
    }
  })
})

router.put('/:id/edit', function (req, res) {
  var fname = req.body.fname
  var lname = req.body.lname
  var email = req.body.email
  var phone = req.body.phone
  var organisation = req.body.organisation

  mongoose.model('contact').findById(req.id, function (err, contact) {
    if (err) {
      res.send('There was a problem updating the information to the database: ' + err)
    } else {
      contact.update({
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        organisation: organisation
      }, function (err, contactID) {
        if (err) {
          res.send('There was a problem updating the information to the database: ' + err)
        } else {
          res.format({
            html: function () {
              res.redirect('/contacts/' + contact._id)
            },
            json: function () {
              res.json(contact)
            }
          })
        }
      })
    }
  })
})

router.delete('/:id/edit', function (req, res) {
  mongoose.model('contact').findById(req.id, function (err, contact) {
    if (err) {
      return console.error(err)
    } else {
      contact.remove(function (err, contact) {
        if (err) {
          return console.error(err)
        } else {
          console.log('DELETE removing ID: ' + contact._id)
          res.format({
            html: function () {
              res.redirect('/contacts')
            },
            json: function () {
              res.json({message: 'deleted',
              item: contact
            })
            }
          })
        }
      })
    }
  })
})

module.exports = router
