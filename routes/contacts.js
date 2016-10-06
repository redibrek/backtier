/*jshint esversion: 6 */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
}));

//build the REST operations at the base for contacts
//this will be accessible from http://127.0.0.1:3000/contacts if the default route for / is left unchanged
router.route('/')
    //GET all contacts
    .get(function(req, res, next) {
        //retrieve all contacts from Monogo
        mongoose.model('contact').find({}, function (err, contacts) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/contacts folder. We are also setting "contacts" to be an accessible variable in our jade view
                    html: function(){
                        res.render('contacts/index', {
                              title: 'All Contacts',
                              "contacts" : contacts
                          });
                    },
                    //JSON response will show all contacts in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
              }
        });
    })
    //POST a new contact
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var phone = req.body.phone;
        var organisation = req.body.organisation;

        //call the create function for our database
        mongoose.model('contact').create({
            fname : fname,
            lname : lname,
            email : email,
            phone : phone,
            organisation : organisation
        }, function (err, contact) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //contact has been created
                  console.log('POST creating new contact: ' + contact);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("contacts");
                        // And forward to success page
                        res.redirect("/contacts");
                    },
                    //JSON response will show the newly created contact
                    json: function(){
                        res.json(contact);
                    }
                });
              }
        });
    });

/* GET New contact page. */
router.get('/new', function(req, res) {
    res.render('contacts/new', { title: 'Add New contact' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('contact').findById(id, function (err, contact) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404);
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(contact);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('contact').findById(req.id, function (err, contact) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + contact._id);

        res.format({
          html: function(){
              res.render('contacts/show', {
                "contact" : contact
              });
          },
          json: function(){
              res.json(contact);
          }
        });
      }
    });
  });

//GET the individual contact by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the contact within Mongo
    mongoose.model('contact').findById(req.id, function (err, contact) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the contact
            console.log('GET Retrieving ID: ' + contact._id);
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('contacts/edit', {
                          "contact" : contact
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(contact);
                 }
            });
        }
    });
});

//PUT to update a contact by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var phone = req.body.phone;
    var organisation = req.body.organisation;

   //find the document by ID
        mongoose.model('contact').findById(req.id, function (err, contact) {
            //update it
            contact.update({
              fname : fname,
              lname : lname,
              email : email,
              phone : phone,
              organisation : organisation
            }, function (err, contactID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/contacts/" + contact._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(contact);
                         }
                      });
               }
            });
        });
});

//DELETE a contact by ID
router.delete('/:id/edit', function (req, res){
    //find contact by ID
    mongoose.model('contact').findById(req.id, function (err, contact) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            contact.remove(function (err, contact) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + contact._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/contacts");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : contact
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
