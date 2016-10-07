var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var contact = mongoose.model('contact')
var organisation = mongoose.model('organisation')
var opportunity = mongoose.model('opportunity')

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
      contact.find({}, function (err, contacts) {
        if (err) {
          return console.error(err)
        } else {
          organisation.find({}, function (err, organisations) {
            if (err) {
              return console.error(err)
            } else {
              opportunity.find({}, function (err, opportunities) {
                if (err) {
                  return console.error(err)
                } else {
                  res.format({
                    html: function () {
                      res.render('index', {
                        'contacts': contacts,
                        'organisations': organisations,
                        'opportunities': opportunities
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })

module.exports = router
