'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Inventario = mongoose.model('Inventario'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, inventario;

/**
 * Inventario routes tests
 */
describe('Inventario CRUD tests', function () {

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

    // Save a user to the test db and create new Inventario
    user.save(function () {
      inventario = {
        name: 'Inventario name'
      };

      done();
    });
  });

  it('should be able to save a Inventario if logged in', function (done) {
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

        // Save a new Inventario
        agent.post('/api/inventarios')
          .send(inventario)
          .expect(200)
          .end(function (inventarioSaveErr, inventarioSaveRes) {
            // Handle Inventario save error
            if (inventarioSaveErr) {
              return done(inventarioSaveErr);
            }

            // Get a list of Inventarios
            agent.get('/api/inventarios')
              .end(function (inventariosGetErr, inventariosGetRes) {
                // Handle Inventario save error
                if (inventariosGetErr) {
                  return done(inventariosGetErr);
                }

                // Get Inventarios list
                var inventarios = inventariosGetRes.body;

                // Set assertions
                (inventarios[0].user._id).should.equal(userId);
                (inventarios[0].name).should.match('Inventario name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Inventario if not logged in', function (done) {
    agent.post('/api/inventarios')
      .send(inventario)
      .expect(403)
      .end(function (inventarioSaveErr, inventarioSaveRes) {
        // Call the assertion callback
        done(inventarioSaveErr);
      });
  });

  it('should not be able to save an Inventario if no name is provided', function (done) {
    // Invalidate name field
    inventario.name = '';

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

        // Save a new Inventario
        agent.post('/api/inventarios')
          .send(inventario)
          .expect(400)
          .end(function (inventarioSaveErr, inventarioSaveRes) {
            // Set message assertion
            (inventarioSaveRes.body.message).should.match('Please fill Inventario name');

            // Handle Inventario save error
            done(inventarioSaveErr);
          });
      });
  });

  it('should be able to update an Inventario if signed in', function (done) {
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

        // Save a new Inventario
        agent.post('/api/inventarios')
          .send(inventario)
          .expect(200)
          .end(function (inventarioSaveErr, inventarioSaveRes) {
            // Handle Inventario save error
            if (inventarioSaveErr) {
              return done(inventarioSaveErr);
            }

            // Update Inventario name
            inventario.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Inventario
            agent.put('/api/inventarios/' + inventarioSaveRes.body._id)
              .send(inventario)
              .expect(200)
              .end(function (inventarioUpdateErr, inventarioUpdateRes) {
                // Handle Inventario update error
                if (inventarioUpdateErr) {
                  return done(inventarioUpdateErr);
                }

                // Set assertions
                (inventarioUpdateRes.body._id).should.equal(inventarioSaveRes.body._id);
                (inventarioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Inventarios if not signed in', function (done) {
    // Create new Inventario model instance
    var inventarioObj = new Inventario(inventario);

    // Save the inventario
    inventarioObj.save(function () {
      // Request Inventarios
      request(app).get('/api/inventarios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Inventario if not signed in', function (done) {
    // Create new Inventario model instance
    var inventarioObj = new Inventario(inventario);

    // Save the Inventario
    inventarioObj.save(function () {
      request(app).get('/api/inventarios/' + inventarioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', inventario.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Inventario with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/inventarios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Inventario is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Inventario which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Inventario
    request(app).get('/api/inventarios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Inventario with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Inventario if signed in', function (done) {
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

        // Save a new Inventario
        agent.post('/api/inventarios')
          .send(inventario)
          .expect(200)
          .end(function (inventarioSaveErr, inventarioSaveRes) {
            // Handle Inventario save error
            if (inventarioSaveErr) {
              return done(inventarioSaveErr);
            }

            // Delete an existing Inventario
            agent.delete('/api/inventarios/' + inventarioSaveRes.body._id)
              .send(inventario)
              .expect(200)
              .end(function (inventarioDeleteErr, inventarioDeleteRes) {
                // Handle inventario error error
                if (inventarioDeleteErr) {
                  return done(inventarioDeleteErr);
                }

                // Set assertions
                (inventarioDeleteRes.body._id).should.equal(inventarioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Inventario if not signed in', function (done) {
    // Set Inventario user
    inventario.user = user;

    // Create new Inventario model instance
    var inventarioObj = new Inventario(inventario);

    // Save the Inventario
    inventarioObj.save(function () {
      // Try deleting Inventario
      request(app).delete('/api/inventarios/' + inventarioObj._id)
        .expect(403)
        .end(function (inventarioDeleteErr, inventarioDeleteRes) {
          // Set message assertion
          (inventarioDeleteRes.body.message).should.match('User is not authorized');

          // Handle Inventario error error
          done(inventarioDeleteErr);
        });

    });
  });

  it('should be able to get a single Inventario that has an orphaned user reference', function (done) {
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

          // Save a new Inventario
          agent.post('/api/inventarios')
            .send(inventario)
            .expect(200)
            .end(function (inventarioSaveErr, inventarioSaveRes) {
              // Handle Inventario save error
              if (inventarioSaveErr) {
                return done(inventarioSaveErr);
              }

              // Set assertions on new Inventario
              (inventarioSaveRes.body.name).should.equal(inventario.name);
              should.exist(inventarioSaveRes.body.user);
              should.equal(inventarioSaveRes.body.user._id, orphanId);

              // force the Inventario to have an orphaned user reference
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

                    // Get the Inventario
                    agent.get('/api/inventarios/' + inventarioSaveRes.body._id)
                      .expect(200)
                      .end(function (inventarioInfoErr, inventarioInfoRes) {
                        // Handle Inventario error
                        if (inventarioInfoErr) {
                          return done(inventarioInfoErr);
                        }

                        // Set assertions
                        (inventarioInfoRes.body._id).should.equal(inventarioSaveRes.body._id);
                        (inventarioInfoRes.body.name).should.equal(inventario.name);
                        should.equal(inventarioInfoRes.body.user, undefined);

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
      Inventario.remove().exec(done);
    });
  });
});
