'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Caja = mongoose.model('Caja'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, caja;

/**
 * Caja routes tests
 */
describe('Caja CRUD tests', function () {

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

    // Save a user to the test db and create new Caja
    user.save(function () {
      caja = {
        name: 'Caja name'
      };

      done();
    });
  });

  it('should be able to save a Caja if logged in', function (done) {
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

        // Save a new Caja
        agent.post('/api/cajas')
          .send(caja)
          .expect(200)
          .end(function (cajaSaveErr, cajaSaveRes) {
            // Handle Caja save error
            if (cajaSaveErr) {
              return done(cajaSaveErr);
            }

            // Get a list of Cajas
            agent.get('/api/cajas')
              .end(function (cajasGetErr, cajasGetRes) {
                // Handle Caja save error
                if (cajasGetErr) {
                  return done(cajasGetErr);
                }

                // Get Cajas list
                var cajas = cajasGetRes.body;

                // Set assertions
                (cajas[0].user._id).should.equal(userId);
                (cajas[0].name).should.match('Caja name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Caja if not logged in', function (done) {
    agent.post('/api/cajas')
      .send(caja)
      .expect(403)
      .end(function (cajaSaveErr, cajaSaveRes) {
        // Call the assertion callback
        done(cajaSaveErr);
      });
  });

  it('should not be able to save an Caja if no name is provided', function (done) {
    // Invalidate name field
    caja.name = '';

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

        // Save a new Caja
        agent.post('/api/cajas')
          .send(caja)
          .expect(400)
          .end(function (cajaSaveErr, cajaSaveRes) {
            // Set message assertion
            (cajaSaveRes.body.message).should.match('Please fill Caja name');

            // Handle Caja save error
            done(cajaSaveErr);
          });
      });
  });

  it('should be able to update an Caja if signed in', function (done) {
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

        // Save a new Caja
        agent.post('/api/cajas')
          .send(caja)
          .expect(200)
          .end(function (cajaSaveErr, cajaSaveRes) {
            // Handle Caja save error
            if (cajaSaveErr) {
              return done(cajaSaveErr);
            }

            // Update Caja name
            caja.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Caja
            agent.put('/api/cajas/' + cajaSaveRes.body._id)
              .send(caja)
              .expect(200)
              .end(function (cajaUpdateErr, cajaUpdateRes) {
                // Handle Caja update error
                if (cajaUpdateErr) {
                  return done(cajaUpdateErr);
                }

                // Set assertions
                (cajaUpdateRes.body._id).should.equal(cajaSaveRes.body._id);
                (cajaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cajas if not signed in', function (done) {
    // Create new Caja model instance
    var cajaObj = new Caja(caja);

    // Save the caja
    cajaObj.save(function () {
      // Request Cajas
      request(app).get('/api/cajas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Caja if not signed in', function (done) {
    // Create new Caja model instance
    var cajaObj = new Caja(caja);

    // Save the Caja
    cajaObj.save(function () {
      request(app).get('/api/cajas/' + cajaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', caja.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Caja with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cajas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Caja is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Caja which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Caja
    request(app).get('/api/cajas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Caja with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Caja if signed in', function (done) {
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

        // Save a new Caja
        agent.post('/api/cajas')
          .send(caja)
          .expect(200)
          .end(function (cajaSaveErr, cajaSaveRes) {
            // Handle Caja save error
            if (cajaSaveErr) {
              return done(cajaSaveErr);
            }

            // Delete an existing Caja
            agent.delete('/api/cajas/' + cajaSaveRes.body._id)
              .send(caja)
              .expect(200)
              .end(function (cajaDeleteErr, cajaDeleteRes) {
                // Handle caja error error
                if (cajaDeleteErr) {
                  return done(cajaDeleteErr);
                }

                // Set assertions
                (cajaDeleteRes.body._id).should.equal(cajaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Caja if not signed in', function (done) {
    // Set Caja user
    caja.user = user;

    // Create new Caja model instance
    var cajaObj = new Caja(caja);

    // Save the Caja
    cajaObj.save(function () {
      // Try deleting Caja
      request(app).delete('/api/cajas/' + cajaObj._id)
        .expect(403)
        .end(function (cajaDeleteErr, cajaDeleteRes) {
          // Set message assertion
          (cajaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Caja error error
          done(cajaDeleteErr);
        });

    });
  });

  it('should be able to get a single Caja that has an orphaned user reference', function (done) {
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

          // Save a new Caja
          agent.post('/api/cajas')
            .send(caja)
            .expect(200)
            .end(function (cajaSaveErr, cajaSaveRes) {
              // Handle Caja save error
              if (cajaSaveErr) {
                return done(cajaSaveErr);
              }

              // Set assertions on new Caja
              (cajaSaveRes.body.name).should.equal(caja.name);
              should.exist(cajaSaveRes.body.user);
              should.equal(cajaSaveRes.body.user._id, orphanId);

              // force the Caja to have an orphaned user reference
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

                    // Get the Caja
                    agent.get('/api/cajas/' + cajaSaveRes.body._id)
                      .expect(200)
                      .end(function (cajaInfoErr, cajaInfoRes) {
                        // Handle Caja error
                        if (cajaInfoErr) {
                          return done(cajaInfoErr);
                        }

                        // Set assertions
                        (cajaInfoRes.body._id).should.equal(cajaSaveRes.body._id);
                        (cajaInfoRes.body.name).should.equal(caja.name);
                        should.equal(cajaInfoRes.body.user, undefined);

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
      Caja.remove().exec(done);
    });
  });
});
