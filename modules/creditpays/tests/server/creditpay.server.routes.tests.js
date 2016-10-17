'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Creditpay = mongoose.model('Creditpay'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, creditpay;

/**
 * Creditpay routes tests
 */
describe('Creditpay CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Creditpay
    user.save(function () {
      creditpay = {
        name: 'Creditpay name'
      };

      done();
    });
  });

  it('should be able to save a Creditpay if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Creditpay
        agent.post('/api/creditpays')
          .send(creditpay)
          .expect(200)
          .end(function (creditpaySaveErr, creditpaySaveRes) {
            // Handle Creditpay save error
            if (creditpaySaveErr) {
              return done(creditpaySaveErr);
            }

            // Get a list of Creditpays
            agent.get('/api/creditpays')
              .end(function (creditpaysGetErr, creditpaysGetRes) {
                // Handle Creditpay save error
                if (creditpaysGetErr) {
                  return done(creditpaysGetErr);
                }

                // Get Creditpays list
                var creditpays = creditpaysGetRes.body;

                // Set assertions
                (creditpays[0].user._id).should.equal(userId);
                (creditpays[0].name).should.match('Creditpay name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Creditpay if not logged in', function (done) {
    agent.post('/api/creditpays')
      .send(creditpay)
      .expect(403)
      .end(function (creditpaySaveErr, creditpaySaveRes) {
        // Call the assertion callback
        done(creditpaySaveErr);
      });
  });

  it('should not be able to save an Creditpay if no name is provided', function (done) {
    // Invalidate name field
    creditpay.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Creditpay
        agent.post('/api/creditpays')
          .send(creditpay)
          .expect(400)
          .end(function (creditpaySaveErr, creditpaySaveRes) {
            // Set message assertion
            (creditpaySaveRes.body.message).should.match('Please fill Creditpay name');

            // Handle Creditpay save error
            done(creditpaySaveErr);
          });
      });
  });

  it('should be able to update an Creditpay if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Creditpay
        agent.post('/api/creditpays')
          .send(creditpay)
          .expect(200)
          .end(function (creditpaySaveErr, creditpaySaveRes) {
            // Handle Creditpay save error
            if (creditpaySaveErr) {
              return done(creditpaySaveErr);
            }

            // Update Creditpay name
            creditpay.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Creditpay
            agent.put('/api/creditpays/' + creditpaySaveRes.body._id)
              .send(creditpay)
              .expect(200)
              .end(function (creditpayUpdateErr, creditpayUpdateRes) {
                // Handle Creditpay update error
                if (creditpayUpdateErr) {
                  return done(creditpayUpdateErr);
                }

                // Set assertions
                (creditpayUpdateRes.body._id).should.equal(creditpaySaveRes.body._id);
                (creditpayUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Creditpays if not signed in', function (done) {
    // Create new Creditpay model instance
    var creditpayObj = new Creditpay(creditpay);

    // Save the creditpay
    creditpayObj.save(function () {
      // Request Creditpays
      request(app).get('/api/creditpays')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Creditpay if not signed in', function (done) {
    // Create new Creditpay model instance
    var creditpayObj = new Creditpay(creditpay);

    // Save the Creditpay
    creditpayObj.save(function () {
      request(app).get('/api/creditpays/' + creditpayObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', creditpay.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Creditpay with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/creditpays/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Creditpay is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Creditpay which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Creditpay
    request(app).get('/api/creditpays/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Creditpay with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Creditpay if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Creditpay
        agent.post('/api/creditpays')
          .send(creditpay)
          .expect(200)
          .end(function (creditpaySaveErr, creditpaySaveRes) {
            // Handle Creditpay save error
            if (creditpaySaveErr) {
              return done(creditpaySaveErr);
            }

            // Delete an existing Creditpay
            agent.delete('/api/creditpays/' + creditpaySaveRes.body._id)
              .send(creditpay)
              .expect(200)
              .end(function (creditpayDeleteErr, creditpayDeleteRes) {
                // Handle creditpay error error
                if (creditpayDeleteErr) {
                  return done(creditpayDeleteErr);
                }

                // Set assertions
                (creditpayDeleteRes.body._id).should.equal(creditpaySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Creditpay if not signed in', function (done) {
    // Set Creditpay user
    creditpay.user = user;

    // Create new Creditpay model instance
    var creditpayObj = new Creditpay(creditpay);

    // Save the Creditpay
    creditpayObj.save(function () {
      // Try deleting Creditpay
      request(app).delete('/api/creditpays/' + creditpayObj._id)
        .expect(403)
        .end(function (creditpayDeleteErr, creditpayDeleteRes) {
          // Set message assertion
          (creditpayDeleteRes.body.message).should.match('User is not authorized');

          // Handle Creditpay error error
          done(creditpayDeleteErr);
        });

    });
  });

  it('should be able to get a single Creditpay that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Creditpay
          agent.post('/api/creditpays')
            .send(creditpay)
            .expect(200)
            .end(function (creditpaySaveErr, creditpaySaveRes) {
              // Handle Creditpay save error
              if (creditpaySaveErr) {
                return done(creditpaySaveErr);
              }

              // Set assertions on new Creditpay
              (creditpaySaveRes.body.name).should.equal(creditpay.name);
              should.exist(creditpaySaveRes.body.user);
              should.equal(creditpaySaveRes.body.user._id, orphanId);

              // force the Creditpay to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Creditpay
                    agent.get('/api/creditpays/' + creditpaySaveRes.body._id)
                      .expect(200)
                      .end(function (creditpayInfoErr, creditpayInfoRes) {
                        // Handle Creditpay error
                        if (creditpayInfoErr) {
                          return done(creditpayInfoErr);
                        }

                        // Set assertions
                        (creditpayInfoRes.body._id).should.equal(creditpaySaveRes.body._id);
                        (creditpayInfoRes.body.name).should.equal(creditpay.name);
                        should.equal(creditpayInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Creditpay.remove().exec(done);
    });
  });
});
