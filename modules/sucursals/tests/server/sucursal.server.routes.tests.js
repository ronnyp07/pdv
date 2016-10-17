'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sucursal = mongoose.model('Sucursal'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, sucursal;

/**
 * Sucursal routes tests
 */
describe('Sucursal CRUD tests', function () {

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

    // Save a user to the test db and create new Sucursal
    user.save(function () {
      sucursal = {
        name: 'Sucursal name'
      };

      done();
    });
  });

  it('should be able to save a Sucursal if logged in', function (done) {
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

        // Save a new Sucursal
        agent.post('/api/sucursals')
          .send(sucursal)
          .expect(200)
          .end(function (sucursalSaveErr, sucursalSaveRes) {
            // Handle Sucursal save error
            if (sucursalSaveErr) {
              return done(sucursalSaveErr);
            }

            // Get a list of Sucursals
            agent.get('/api/sucursals')
              .end(function (sucursalsGetErr, sucursalsGetRes) {
                // Handle Sucursal save error
                if (sucursalsGetErr) {
                  return done(sucursalsGetErr);
                }

                // Get Sucursals list
                var sucursals = sucursalsGetRes.body;

                // Set assertions
                (sucursals[0].user._id).should.equal(userId);
                (sucursals[0].name).should.match('Sucursal name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sucursal if not logged in', function (done) {
    agent.post('/api/sucursals')
      .send(sucursal)
      .expect(403)
      .end(function (sucursalSaveErr, sucursalSaveRes) {
        // Call the assertion callback
        done(sucursalSaveErr);
      });
  });

  it('should not be able to save an Sucursal if no name is provided', function (done) {
    // Invalidate name field
    sucursal.name = '';

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

        // Save a new Sucursal
        agent.post('/api/sucursals')
          .send(sucursal)
          .expect(400)
          .end(function (sucursalSaveErr, sucursalSaveRes) {
            // Set message assertion
            (sucursalSaveRes.body.message).should.match('Please fill Sucursal name');

            // Handle Sucursal save error
            done(sucursalSaveErr);
          });
      });
  });

  it('should be able to update an Sucursal if signed in', function (done) {
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

        // Save a new Sucursal
        agent.post('/api/sucursals')
          .send(sucursal)
          .expect(200)
          .end(function (sucursalSaveErr, sucursalSaveRes) {
            // Handle Sucursal save error
            if (sucursalSaveErr) {
              return done(sucursalSaveErr);
            }

            // Update Sucursal name
            sucursal.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sucursal
            agent.put('/api/sucursals/' + sucursalSaveRes.body._id)
              .send(sucursal)
              .expect(200)
              .end(function (sucursalUpdateErr, sucursalUpdateRes) {
                // Handle Sucursal update error
                if (sucursalUpdateErr) {
                  return done(sucursalUpdateErr);
                }

                // Set assertions
                (sucursalUpdateRes.body._id).should.equal(sucursalSaveRes.body._id);
                (sucursalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sucursals if not signed in', function (done) {
    // Create new Sucursal model instance
    var sucursalObj = new Sucursal(sucursal);

    // Save the sucursal
    sucursalObj.save(function () {
      // Request Sucursals
      request(app).get('/api/sucursals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sucursal if not signed in', function (done) {
    // Create new Sucursal model instance
    var sucursalObj = new Sucursal(sucursal);

    // Save the Sucursal
    sucursalObj.save(function () {
      request(app).get('/api/sucursals/' + sucursalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sucursal.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sucursal with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sucursals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sucursal is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sucursal which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sucursal
    request(app).get('/api/sucursals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sucursal with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sucursal if signed in', function (done) {
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

        // Save a new Sucursal
        agent.post('/api/sucursals')
          .send(sucursal)
          .expect(200)
          .end(function (sucursalSaveErr, sucursalSaveRes) {
            // Handle Sucursal save error
            if (sucursalSaveErr) {
              return done(sucursalSaveErr);
            }

            // Delete an existing Sucursal
            agent.delete('/api/sucursals/' + sucursalSaveRes.body._id)
              .send(sucursal)
              .expect(200)
              .end(function (sucursalDeleteErr, sucursalDeleteRes) {
                // Handle sucursal error error
                if (sucursalDeleteErr) {
                  return done(sucursalDeleteErr);
                }

                // Set assertions
                (sucursalDeleteRes.body._id).should.equal(sucursalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sucursal if not signed in', function (done) {
    // Set Sucursal user
    sucursal.user = user;

    // Create new Sucursal model instance
    var sucursalObj = new Sucursal(sucursal);

    // Save the Sucursal
    sucursalObj.save(function () {
      // Try deleting Sucursal
      request(app).delete('/api/sucursals/' + sucursalObj._id)
        .expect(403)
        .end(function (sucursalDeleteErr, sucursalDeleteRes) {
          // Set message assertion
          (sucursalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sucursal error error
          done(sucursalDeleteErr);
        });

    });
  });

  it('should be able to get a single Sucursal that has an orphaned user reference', function (done) {
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

          // Save a new Sucursal
          agent.post('/api/sucursals')
            .send(sucursal)
            .expect(200)
            .end(function (sucursalSaveErr, sucursalSaveRes) {
              // Handle Sucursal save error
              if (sucursalSaveErr) {
                return done(sucursalSaveErr);
              }

              // Set assertions on new Sucursal
              (sucursalSaveRes.body.name).should.equal(sucursal.name);
              should.exist(sucursalSaveRes.body.user);
              should.equal(sucursalSaveRes.body.user._id, orphanId);

              // force the Sucursal to have an orphaned user reference
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

                    // Get the Sucursal
                    agent.get('/api/sucursals/' + sucursalSaveRes.body._id)
                      .expect(200)
                      .end(function (sucursalInfoErr, sucursalInfoRes) {
                        // Handle Sucursal error
                        if (sucursalInfoErr) {
                          return done(sucursalInfoErr);
                        }

                        // Set assertions
                        (sucursalInfoRes.body._id).should.equal(sucursalSaveRes.body._id);
                        (sucursalInfoRes.body.name).should.equal(sucursal.name);
                        should.equal(sucursalInfoRes.body.user, undefined);

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
      Sucursal.remove().exec(done);
    });
  });
});
