'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Partner = mongoose.model('Partner'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, partner;

/**
 * Partner routes tests
 */
describe('Partner CRUD tests', function () {

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

    // Save a user to the test db and create new Partner
    user.save(function () {
      partner = {
        name: 'Partner name'
      };

      done();
    });
  });

  it('should be able to save a Partner if logged in', function (done) {
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

        // Save a new Partner
        agent.post('/api/partners')
          .send(partner)
          .expect(200)
          .end(function (partnerSaveErr, partnerSaveRes) {
            // Handle Partner save error
            if (partnerSaveErr) {
              return done(partnerSaveErr);
            }

            // Get a list of Partners
            agent.get('/api/partners')
              .end(function (partnersGetErr, partnersGetRes) {
                // Handle Partner save error
                if (partnersGetErr) {
                  return done(partnersGetErr);
                }

                // Get Partners list
                var partners = partnersGetRes.body;

                // Set assertions
                (partners[0].user._id).should.equal(userId);
                (partners[0].name).should.match('Partner name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Partner if not logged in', function (done) {
    agent.post('/api/partners')
      .send(partner)
      .expect(403)
      .end(function (partnerSaveErr, partnerSaveRes) {
        // Call the assertion callback
        done(partnerSaveErr);
      });
  });

  it('should not be able to save an Partner if no name is provided', function (done) {
    // Invalidate name field
    partner.name = '';

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

        // Save a new Partner
        agent.post('/api/partners')
          .send(partner)
          .expect(400)
          .end(function (partnerSaveErr, partnerSaveRes) {
            // Set message assertion
            (partnerSaveRes.body.message).should.match('Please fill Partner name');

            // Handle Partner save error
            done(partnerSaveErr);
          });
      });
  });

  it('should be able to update an Partner if signed in', function (done) {
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

        // Save a new Partner
        agent.post('/api/partners')
          .send(partner)
          .expect(200)
          .end(function (partnerSaveErr, partnerSaveRes) {
            // Handle Partner save error
            if (partnerSaveErr) {
              return done(partnerSaveErr);
            }

            // Update Partner name
            partner.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Partner
            agent.put('/api/partners/' + partnerSaveRes.body._id)
              .send(partner)
              .expect(200)
              .end(function (partnerUpdateErr, partnerUpdateRes) {
                // Handle Partner update error
                if (partnerUpdateErr) {
                  return done(partnerUpdateErr);
                }

                // Set assertions
                (partnerUpdateRes.body._id).should.equal(partnerSaveRes.body._id);
                (partnerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Partners if not signed in', function (done) {
    // Create new Partner model instance
    var partnerObj = new Partner(partner);

    // Save the partner
    partnerObj.save(function () {
      // Request Partners
      request(app).get('/api/partners')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Partner if not signed in', function (done) {
    // Create new Partner model instance
    var partnerObj = new Partner(partner);

    // Save the Partner
    partnerObj.save(function () {
      request(app).get('/api/partners/' + partnerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', partner.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Partner with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/partners/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Partner is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Partner which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Partner
    request(app).get('/api/partners/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Partner with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Partner if signed in', function (done) {
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

        // Save a new Partner
        agent.post('/api/partners')
          .send(partner)
          .expect(200)
          .end(function (partnerSaveErr, partnerSaveRes) {
            // Handle Partner save error
            if (partnerSaveErr) {
              return done(partnerSaveErr);
            }

            // Delete an existing Partner
            agent.delete('/api/partners/' + partnerSaveRes.body._id)
              .send(partner)
              .expect(200)
              .end(function (partnerDeleteErr, partnerDeleteRes) {
                // Handle partner error error
                if (partnerDeleteErr) {
                  return done(partnerDeleteErr);
                }

                // Set assertions
                (partnerDeleteRes.body._id).should.equal(partnerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Partner if not signed in', function (done) {
    // Set Partner user
    partner.user = user;

    // Create new Partner model instance
    var partnerObj = new Partner(partner);

    // Save the Partner
    partnerObj.save(function () {
      // Try deleting Partner
      request(app).delete('/api/partners/' + partnerObj._id)
        .expect(403)
        .end(function (partnerDeleteErr, partnerDeleteRes) {
          // Set message assertion
          (partnerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Partner error error
          done(partnerDeleteErr);
        });

    });
  });

  it('should be able to get a single Partner that has an orphaned user reference', function (done) {
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

          // Save a new Partner
          agent.post('/api/partners')
            .send(partner)
            .expect(200)
            .end(function (partnerSaveErr, partnerSaveRes) {
              // Handle Partner save error
              if (partnerSaveErr) {
                return done(partnerSaveErr);
              }

              // Set assertions on new Partner
              (partnerSaveRes.body.name).should.equal(partner.name);
              should.exist(partnerSaveRes.body.user);
              should.equal(partnerSaveRes.body.user._id, orphanId);

              // force the Partner to have an orphaned user reference
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

                    // Get the Partner
                    agent.get('/api/partners/' + partnerSaveRes.body._id)
                      .expect(200)
                      .end(function (partnerInfoErr, partnerInfoRes) {
                        // Handle Partner error
                        if (partnerInfoErr) {
                          return done(partnerInfoErr);
                        }

                        // Set assertions
                        (partnerInfoRes.body._id).should.equal(partnerSaveRes.body._id);
                        (partnerInfoRes.body.name).should.equal(partner.name);
                        should.equal(partnerInfoRes.body.user, undefined);

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
      Partner.remove().exec(done);
    });
  });
});
