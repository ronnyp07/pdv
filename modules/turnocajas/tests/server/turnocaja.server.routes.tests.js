'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Turnocaja = mongoose.model('Turnocaja'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, turnocaja;

/**
 * Turnocaja routes tests
 */
describe('Turnocaja CRUD tests', function () {

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

    // Save a user to the test db and create new Turnocaja
    user.save(function () {
      turnocaja = {
        name: 'Turnocaja name'
      };

      done();
    });
  });

  it('should be able to save a Turnocaja if logged in', function (done) {
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

        // Save a new Turnocaja
        agent.post('/api/turnocajas')
          .send(turnocaja)
          .expect(200)
          .end(function (turnocajaSaveErr, turnocajaSaveRes) {
            // Handle Turnocaja save error
            if (turnocajaSaveErr) {
              return done(turnocajaSaveErr);
            }

            // Get a list of Turnocajas
            agent.get('/api/turnocajas')
              .end(function (turnocajasGetErr, turnocajasGetRes) {
                // Handle Turnocaja save error
                if (turnocajasGetErr) {
                  return done(turnocajasGetErr);
                }

                // Get Turnocajas list
                var turnocajas = turnocajasGetRes.body;

                // Set assertions
                (turnocajas[0].user._id).should.equal(userId);
                (turnocajas[0].name).should.match('Turnocaja name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Turnocaja if not logged in', function (done) {
    agent.post('/api/turnocajas')
      .send(turnocaja)
      .expect(403)
      .end(function (turnocajaSaveErr, turnocajaSaveRes) {
        // Call the assertion callback
        done(turnocajaSaveErr);
      });
  });

  it('should not be able to save an Turnocaja if no name is provided', function (done) {
    // Invalidate name field
    turnocaja.name = '';

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

        // Save a new Turnocaja
        agent.post('/api/turnocajas')
          .send(turnocaja)
          .expect(400)
          .end(function (turnocajaSaveErr, turnocajaSaveRes) {
            // Set message assertion
            (turnocajaSaveRes.body.message).should.match('Please fill Turnocaja name');

            // Handle Turnocaja save error
            done(turnocajaSaveErr);
          });
      });
  });

  it('should be able to update an Turnocaja if signed in', function (done) {
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

        // Save a new Turnocaja
        agent.post('/api/turnocajas')
          .send(turnocaja)
          .expect(200)
          .end(function (turnocajaSaveErr, turnocajaSaveRes) {
            // Handle Turnocaja save error
            if (turnocajaSaveErr) {
              return done(turnocajaSaveErr);
            }

            // Update Turnocaja name
            turnocaja.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Turnocaja
            agent.put('/api/turnocajas/' + turnocajaSaveRes.body._id)
              .send(turnocaja)
              .expect(200)
              .end(function (turnocajaUpdateErr, turnocajaUpdateRes) {
                // Handle Turnocaja update error
                if (turnocajaUpdateErr) {
                  return done(turnocajaUpdateErr);
                }

                // Set assertions
                (turnocajaUpdateRes.body._id).should.equal(turnocajaSaveRes.body._id);
                (turnocajaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Turnocajas if not signed in', function (done) {
    // Create new Turnocaja model instance
    var turnocajaObj = new Turnocaja(turnocaja);

    // Save the turnocaja
    turnocajaObj.save(function () {
      // Request Turnocajas
      request(app).get('/api/turnocajas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Turnocaja if not signed in', function (done) {
    // Create new Turnocaja model instance
    var turnocajaObj = new Turnocaja(turnocaja);

    // Save the Turnocaja
    turnocajaObj.save(function () {
      request(app).get('/api/turnocajas/' + turnocajaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', turnocaja.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Turnocaja with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/turnocajas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Turnocaja is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Turnocaja which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Turnocaja
    request(app).get('/api/turnocajas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Turnocaja with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Turnocaja if signed in', function (done) {
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

        // Save a new Turnocaja
        agent.post('/api/turnocajas')
          .send(turnocaja)
          .expect(200)
          .end(function (turnocajaSaveErr, turnocajaSaveRes) {
            // Handle Turnocaja save error
            if (turnocajaSaveErr) {
              return done(turnocajaSaveErr);
            }

            // Delete an existing Turnocaja
            agent.delete('/api/turnocajas/' + turnocajaSaveRes.body._id)
              .send(turnocaja)
              .expect(200)
              .end(function (turnocajaDeleteErr, turnocajaDeleteRes) {
                // Handle turnocaja error error
                if (turnocajaDeleteErr) {
                  return done(turnocajaDeleteErr);
                }

                // Set assertions
                (turnocajaDeleteRes.body._id).should.equal(turnocajaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Turnocaja if not signed in', function (done) {
    // Set Turnocaja user
    turnocaja.user = user;

    // Create new Turnocaja model instance
    var turnocajaObj = new Turnocaja(turnocaja);

    // Save the Turnocaja
    turnocajaObj.save(function () {
      // Try deleting Turnocaja
      request(app).delete('/api/turnocajas/' + turnocajaObj._id)
        .expect(403)
        .end(function (turnocajaDeleteErr, turnocajaDeleteRes) {
          // Set message assertion
          (turnocajaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Turnocaja error error
          done(turnocajaDeleteErr);
        });

    });
  });

  it('should be able to get a single Turnocaja that has an orphaned user reference', function (done) {
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

          // Save a new Turnocaja
          agent.post('/api/turnocajas')
            .send(turnocaja)
            .expect(200)
            .end(function (turnocajaSaveErr, turnocajaSaveRes) {
              // Handle Turnocaja save error
              if (turnocajaSaveErr) {
                return done(turnocajaSaveErr);
              }

              // Set assertions on new Turnocaja
              (turnocajaSaveRes.body.name).should.equal(turnocaja.name);
              should.exist(turnocajaSaveRes.body.user);
              should.equal(turnocajaSaveRes.body.user._id, orphanId);

              // force the Turnocaja to have an orphaned user reference
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

                    // Get the Turnocaja
                    agent.get('/api/turnocajas/' + turnocajaSaveRes.body._id)
                      .expect(200)
                      .end(function (turnocajaInfoErr, turnocajaInfoRes) {
                        // Handle Turnocaja error
                        if (turnocajaInfoErr) {
                          return done(turnocajaInfoErr);
                        }

                        // Set assertions
                        (turnocajaInfoRes.body._id).should.equal(turnocajaSaveRes.body._id);
                        (turnocajaInfoRes.body.name).should.equal(turnocaja.name);
                        should.equal(turnocajaInfoRes.body.user, undefined);

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
      Turnocaja.remove().exec(done);
    });
  });
});
