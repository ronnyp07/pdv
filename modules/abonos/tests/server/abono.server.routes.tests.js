'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Abono = mongoose.model('Abono'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, abono;

/**
 * Abono routes tests
 */
describe('Abono CRUD tests', function () {

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

    // Save a user to the test db and create new Abono
    user.save(function () {
      abono = {
        name: 'Abono name'
      };

      done();
    });
  });

  it('should be able to save a Abono if logged in', function (done) {
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

        // Save a new Abono
        agent.post('/api/abonos')
          .send(abono)
          .expect(200)
          .end(function (abonoSaveErr, abonoSaveRes) {
            // Handle Abono save error
            if (abonoSaveErr) {
              return done(abonoSaveErr);
            }

            // Get a list of Abonos
            agent.get('/api/abonos')
              .end(function (abonosGetErr, abonosGetRes) {
                // Handle Abono save error
                if (abonosGetErr) {
                  return done(abonosGetErr);
                }

                // Get Abonos list
                var abonos = abonosGetRes.body;

                // Set assertions
                (abonos[0].user._id).should.equal(userId);
                (abonos[0].name).should.match('Abono name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Abono if not logged in', function (done) {
    agent.post('/api/abonos')
      .send(abono)
      .expect(403)
      .end(function (abonoSaveErr, abonoSaveRes) {
        // Call the assertion callback
        done(abonoSaveErr);
      });
  });

  it('should not be able to save an Abono if no name is provided', function (done) {
    // Invalidate name field
    abono.name = '';

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

        // Save a new Abono
        agent.post('/api/abonos')
          .send(abono)
          .expect(400)
          .end(function (abonoSaveErr, abonoSaveRes) {
            // Set message assertion
            (abonoSaveRes.body.message).should.match('Please fill Abono name');

            // Handle Abono save error
            done(abonoSaveErr);
          });
      });
  });

  it('should be able to update an Abono if signed in', function (done) {
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

        // Save a new Abono
        agent.post('/api/abonos')
          .send(abono)
          .expect(200)
          .end(function (abonoSaveErr, abonoSaveRes) {
            // Handle Abono save error
            if (abonoSaveErr) {
              return done(abonoSaveErr);
            }

            // Update Abono name
            abono.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Abono
            agent.put('/api/abonos/' + abonoSaveRes.body._id)
              .send(abono)
              .expect(200)
              .end(function (abonoUpdateErr, abonoUpdateRes) {
                // Handle Abono update error
                if (abonoUpdateErr) {
                  return done(abonoUpdateErr);
                }

                // Set assertions
                (abonoUpdateRes.body._id).should.equal(abonoSaveRes.body._id);
                (abonoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Abonos if not signed in', function (done) {
    // Create new Abono model instance
    var abonoObj = new Abono(abono);

    // Save the abono
    abonoObj.save(function () {
      // Request Abonos
      request(app).get('/api/abonos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Abono if not signed in', function (done) {
    // Create new Abono model instance
    var abonoObj = new Abono(abono);

    // Save the Abono
    abonoObj.save(function () {
      request(app).get('/api/abonos/' + abonoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', abono.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Abono with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/abonos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Abono is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Abono which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Abono
    request(app).get('/api/abonos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Abono with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Abono if signed in', function (done) {
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

        // Save a new Abono
        agent.post('/api/abonos')
          .send(abono)
          .expect(200)
          .end(function (abonoSaveErr, abonoSaveRes) {
            // Handle Abono save error
            if (abonoSaveErr) {
              return done(abonoSaveErr);
            }

            // Delete an existing Abono
            agent.delete('/api/abonos/' + abonoSaveRes.body._id)
              .send(abono)
              .expect(200)
              .end(function (abonoDeleteErr, abonoDeleteRes) {
                // Handle abono error error
                if (abonoDeleteErr) {
                  return done(abonoDeleteErr);
                }

                // Set assertions
                (abonoDeleteRes.body._id).should.equal(abonoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Abono if not signed in', function (done) {
    // Set Abono user
    abono.user = user;

    // Create new Abono model instance
    var abonoObj = new Abono(abono);

    // Save the Abono
    abonoObj.save(function () {
      // Try deleting Abono
      request(app).delete('/api/abonos/' + abonoObj._id)
        .expect(403)
        .end(function (abonoDeleteErr, abonoDeleteRes) {
          // Set message assertion
          (abonoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Abono error error
          done(abonoDeleteErr);
        });

    });
  });

  it('should be able to get a single Abono that has an orphaned user reference', function (done) {
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

          // Save a new Abono
          agent.post('/api/abonos')
            .send(abono)
            .expect(200)
            .end(function (abonoSaveErr, abonoSaveRes) {
              // Handle Abono save error
              if (abonoSaveErr) {
                return done(abonoSaveErr);
              }

              // Set assertions on new Abono
              (abonoSaveRes.body.name).should.equal(abono.name);
              should.exist(abonoSaveRes.body.user);
              should.equal(abonoSaveRes.body.user._id, orphanId);

              // force the Abono to have an orphaned user reference
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

                    // Get the Abono
                    agent.get('/api/abonos/' + abonoSaveRes.body._id)
                      .expect(200)
                      .end(function (abonoInfoErr, abonoInfoRes) {
                        // Handle Abono error
                        if (abonoInfoErr) {
                          return done(abonoInfoErr);
                        }

                        // Set assertions
                        (abonoInfoRes.body._id).should.equal(abonoSaveRes.body._id);
                        (abonoInfoRes.body.name).should.equal(abono.name);
                        should.equal(abonoInfoRes.body.user, undefined);

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
      Abono.remove().exec(done);
    });
  });
});
