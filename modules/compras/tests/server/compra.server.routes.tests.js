'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Compra = mongoose.model('Compra'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, compra;

/**
 * Compra routes tests
 */
describe('Compra CRUD tests', function () {

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

    // Save a user to the test db and create new Compra
    user.save(function () {
      compra = {
        name: 'Compra name'
      };

      done();
    });
  });

  it('should be able to save a Compra if logged in', function (done) {
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

        // Save a new Compra
        agent.post('/api/compras')
          .send(compra)
          .expect(200)
          .end(function (compraSaveErr, compraSaveRes) {
            // Handle Compra save error
            if (compraSaveErr) {
              return done(compraSaveErr);
            }

            // Get a list of Compras
            agent.get('/api/compras')
              .end(function (comprasGetErr, comprasGetRes) {
                // Handle Compra save error
                if (comprasGetErr) {
                  return done(comprasGetErr);
                }

                // Get Compras list
                var compras = comprasGetRes.body;

                // Set assertions
                (compras[0].user._id).should.equal(userId);
                (compras[0].name).should.match('Compra name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Compra if not logged in', function (done) {
    agent.post('/api/compras')
      .send(compra)
      .expect(403)
      .end(function (compraSaveErr, compraSaveRes) {
        // Call the assertion callback
        done(compraSaveErr);
      });
  });

  it('should not be able to save an Compra if no name is provided', function (done) {
    // Invalidate name field
    compra.name = '';

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

        // Save a new Compra
        agent.post('/api/compras')
          .send(compra)
          .expect(400)
          .end(function (compraSaveErr, compraSaveRes) {
            // Set message assertion
            (compraSaveRes.body.message).should.match('Please fill Compra name');

            // Handle Compra save error
            done(compraSaveErr);
          });
      });
  });

  it('should be able to update an Compra if signed in', function (done) {
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

        // Save a new Compra
        agent.post('/api/compras')
          .send(compra)
          .expect(200)
          .end(function (compraSaveErr, compraSaveRes) {
            // Handle Compra save error
            if (compraSaveErr) {
              return done(compraSaveErr);
            }

            // Update Compra name
            compra.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Compra
            agent.put('/api/compras/' + compraSaveRes.body._id)
              .send(compra)
              .expect(200)
              .end(function (compraUpdateErr, compraUpdateRes) {
                // Handle Compra update error
                if (compraUpdateErr) {
                  return done(compraUpdateErr);
                }

                // Set assertions
                (compraUpdateRes.body._id).should.equal(compraSaveRes.body._id);
                (compraUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Compras if not signed in', function (done) {
    // Create new Compra model instance
    var compraObj = new Compra(compra);

    // Save the compra
    compraObj.save(function () {
      // Request Compras
      request(app).get('/api/compras')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Compra if not signed in', function (done) {
    // Create new Compra model instance
    var compraObj = new Compra(compra);

    // Save the Compra
    compraObj.save(function () {
      request(app).get('/api/compras/' + compraObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', compra.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Compra with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/compras/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Compra is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Compra which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Compra
    request(app).get('/api/compras/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Compra with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Compra if signed in', function (done) {
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

        // Save a new Compra
        agent.post('/api/compras')
          .send(compra)
          .expect(200)
          .end(function (compraSaveErr, compraSaveRes) {
            // Handle Compra save error
            if (compraSaveErr) {
              return done(compraSaveErr);
            }

            // Delete an existing Compra
            agent.delete('/api/compras/' + compraSaveRes.body._id)
              .send(compra)
              .expect(200)
              .end(function (compraDeleteErr, compraDeleteRes) {
                // Handle compra error error
                if (compraDeleteErr) {
                  return done(compraDeleteErr);
                }

                // Set assertions
                (compraDeleteRes.body._id).should.equal(compraSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Compra if not signed in', function (done) {
    // Set Compra user
    compra.user = user;

    // Create new Compra model instance
    var compraObj = new Compra(compra);

    // Save the Compra
    compraObj.save(function () {
      // Try deleting Compra
      request(app).delete('/api/compras/' + compraObj._id)
        .expect(403)
        .end(function (compraDeleteErr, compraDeleteRes) {
          // Set message assertion
          (compraDeleteRes.body.message).should.match('User is not authorized');

          // Handle Compra error error
          done(compraDeleteErr);
        });

    });
  });

  it('should be able to get a single Compra that has an orphaned user reference', function (done) {
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

          // Save a new Compra
          agent.post('/api/compras')
            .send(compra)
            .expect(200)
            .end(function (compraSaveErr, compraSaveRes) {
              // Handle Compra save error
              if (compraSaveErr) {
                return done(compraSaveErr);
              }

              // Set assertions on new Compra
              (compraSaveRes.body.name).should.equal(compra.name);
              should.exist(compraSaveRes.body.user);
              should.equal(compraSaveRes.body.user._id, orphanId);

              // force the Compra to have an orphaned user reference
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

                    // Get the Compra
                    agent.get('/api/compras/' + compraSaveRes.body._id)
                      .expect(200)
                      .end(function (compraInfoErr, compraInfoRes) {
                        // Handle Compra error
                        if (compraInfoErr) {
                          return done(compraInfoErr);
                        }

                        // Set assertions
                        (compraInfoRes.body._id).should.equal(compraSaveRes.body._id);
                        (compraInfoRes.body.name).should.equal(compra.name);
                        should.equal(compraInfoRes.body.user, undefined);

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
      Compra.remove().exec(done);
    });
  });
});
