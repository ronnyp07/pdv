'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Movimiento = mongoose.model('Movimiento'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, movimiento;

/**
 * Movimiento routes tests
 */
describe('Movimiento CRUD tests', function () {

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

    // Save a user to the test db and create new Movimiento
    user.save(function () {
      movimiento = {
        name: 'Movimiento name'
      };

      done();
    });
  });

  it('should be able to save a Movimiento if logged in', function (done) {
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

        // Save a new Movimiento
        agent.post('/api/movimientos')
          .send(movimiento)
          .expect(200)
          .end(function (movimientoSaveErr, movimientoSaveRes) {
            // Handle Movimiento save error
            if (movimientoSaveErr) {
              return done(movimientoSaveErr);
            }

            // Get a list of Movimientos
            agent.get('/api/movimientos')
              .end(function (movimientosGetErr, movimientosGetRes) {
                // Handle Movimiento save error
                if (movimientosGetErr) {
                  return done(movimientosGetErr);
                }

                // Get Movimientos list
                var movimientos = movimientosGetRes.body;

                // Set assertions
                (movimientos[0].user._id).should.equal(userId);
                (movimientos[0].name).should.match('Movimiento name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Movimiento if not logged in', function (done) {
    agent.post('/api/movimientos')
      .send(movimiento)
      .expect(403)
      .end(function (movimientoSaveErr, movimientoSaveRes) {
        // Call the assertion callback
        done(movimientoSaveErr);
      });
  });

  it('should not be able to save an Movimiento if no name is provided', function (done) {
    // Invalidate name field
    movimiento.name = '';

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

        // Save a new Movimiento
        agent.post('/api/movimientos')
          .send(movimiento)
          .expect(400)
          .end(function (movimientoSaveErr, movimientoSaveRes) {
            // Set message assertion
            (movimientoSaveRes.body.message).should.match('Please fill Movimiento name');

            // Handle Movimiento save error
            done(movimientoSaveErr);
          });
      });
  });

  it('should be able to update an Movimiento if signed in', function (done) {
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

        // Save a new Movimiento
        agent.post('/api/movimientos')
          .send(movimiento)
          .expect(200)
          .end(function (movimientoSaveErr, movimientoSaveRes) {
            // Handle Movimiento save error
            if (movimientoSaveErr) {
              return done(movimientoSaveErr);
            }

            // Update Movimiento name
            movimiento.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Movimiento
            agent.put('/api/movimientos/' + movimientoSaveRes.body._id)
              .send(movimiento)
              .expect(200)
              .end(function (movimientoUpdateErr, movimientoUpdateRes) {
                // Handle Movimiento update error
                if (movimientoUpdateErr) {
                  return done(movimientoUpdateErr);
                }

                // Set assertions
                (movimientoUpdateRes.body._id).should.equal(movimientoSaveRes.body._id);
                (movimientoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Movimientos if not signed in', function (done) {
    // Create new Movimiento model instance
    var movimientoObj = new Movimiento(movimiento);

    // Save the movimiento
    movimientoObj.save(function () {
      // Request Movimientos
      request(app).get('/api/movimientos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Movimiento if not signed in', function (done) {
    // Create new Movimiento model instance
    var movimientoObj = new Movimiento(movimiento);

    // Save the Movimiento
    movimientoObj.save(function () {
      request(app).get('/api/movimientos/' + movimientoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', movimiento.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Movimiento with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/movimientos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Movimiento is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Movimiento which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Movimiento
    request(app).get('/api/movimientos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Movimiento with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Movimiento if signed in', function (done) {
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

        // Save a new Movimiento
        agent.post('/api/movimientos')
          .send(movimiento)
          .expect(200)
          .end(function (movimientoSaveErr, movimientoSaveRes) {
            // Handle Movimiento save error
            if (movimientoSaveErr) {
              return done(movimientoSaveErr);
            }

            // Delete an existing Movimiento
            agent.delete('/api/movimientos/' + movimientoSaveRes.body._id)
              .send(movimiento)
              .expect(200)
              .end(function (movimientoDeleteErr, movimientoDeleteRes) {
                // Handle movimiento error error
                if (movimientoDeleteErr) {
                  return done(movimientoDeleteErr);
                }

                // Set assertions
                (movimientoDeleteRes.body._id).should.equal(movimientoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Movimiento if not signed in', function (done) {
    // Set Movimiento user
    movimiento.user = user;

    // Create new Movimiento model instance
    var movimientoObj = new Movimiento(movimiento);

    // Save the Movimiento
    movimientoObj.save(function () {
      // Try deleting Movimiento
      request(app).delete('/api/movimientos/' + movimientoObj._id)
        .expect(403)
        .end(function (movimientoDeleteErr, movimientoDeleteRes) {
          // Set message assertion
          (movimientoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Movimiento error error
          done(movimientoDeleteErr);
        });

    });
  });

  it('should be able to get a single Movimiento that has an orphaned user reference', function (done) {
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

          // Save a new Movimiento
          agent.post('/api/movimientos')
            .send(movimiento)
            .expect(200)
            .end(function (movimientoSaveErr, movimientoSaveRes) {
              // Handle Movimiento save error
              if (movimientoSaveErr) {
                return done(movimientoSaveErr);
              }

              // Set assertions on new Movimiento
              (movimientoSaveRes.body.name).should.equal(movimiento.name);
              should.exist(movimientoSaveRes.body.user);
              should.equal(movimientoSaveRes.body.user._id, orphanId);

              // force the Movimiento to have an orphaned user reference
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

                    // Get the Movimiento
                    agent.get('/api/movimientos/' + movimientoSaveRes.body._id)
                      .expect(200)
                      .end(function (movimientoInfoErr, movimientoInfoRes) {
                        // Handle Movimiento error
                        if (movimientoInfoErr) {
                          return done(movimientoInfoErr);
                        }

                        // Set assertions
                        (movimientoInfoRes.body._id).should.equal(movimientoSaveRes.body._id);
                        (movimientoInfoRes.body.name).should.equal(movimiento.name);
                        should.equal(movimientoInfoRes.body.user, undefined);

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
      Movimiento.remove().exec(done);
    });
  });
});
