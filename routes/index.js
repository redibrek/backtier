var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

contact = mongoose.model('contact');
organisation = mongoose.model('organisation');
opportunity = mongoose.model('opportunity');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
}));

router.route('/')
    //GET all contacts
    .get(function(req, res, next) {
        //retrieve all contacts from Monogo
        contact.find({}, function (err, contacts) {
          organisation.find({}, function (err, organisations) {
            opportunity.find({}, function (err, opportunities) {
              if (err) {
                  return console.error(err);
              } else {
                    res.format({
                    html: function(){
                        res.render('index', {
                              "contacts" : contacts,
                              "organisations" : organisations,
                              "opportunities" : opportunities
                          });
                    }
                });
              }
            });
           });
        });
    });

module.exports = router;
