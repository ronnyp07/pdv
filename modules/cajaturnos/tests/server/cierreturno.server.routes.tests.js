'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cierreturno = mongoose.model('Cierreturno'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, cierreturno;

/**
 * Cierreturno routes tests
 */
describe('Cierreturno CRUD tests', function () {

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

    // Save a user to the test db and create new Cierreturno
    user.save(function () {
      cierreturno = {
        name: 'Cierreturno name'
      };

      done();
    });
  });

  it('should be able to save a Cierreturno if logged in', function (done) {
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

        // Save a new Cierreturno
        agent.post('/api/cierreturnos')
          .send(cierreturno)
          .expect(200)
          .end(function (cierreturnoSaveErr, cierreturnoSaveRes) {
            // Handle Cierreturno save error
            if (cierreturnoSaveErr) {
              return done(cierreturnoSaveErr);
            }

            // Get a list of Cierreturnos
            agent.get('/api/cierreturnos')
              .end(function (cierreturnosGetErr, cierreturnosGetRes) {
                // Handle Cierreturno save error
                if (cierreturnosGetErr) {
                  return done(cierreturnosGetErr);
                }

                // Get Cierreturnos list
                var cierreturnos = cierreturnosGetRes.body;

                // Set assertions
                (cierreturnos[0].user._id).should.equal(userId);
                (cierreturnos[0].name).should.match('Cierreturno name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Cierreturno if not logged in', function (done) {
    agent.post('/api/cierreturnos')
      .send(cierreturno)
      .expect(403)
      .end(function (cierreturnoSaveErr, cierreturnoSaveRes) {
        // Call the assertion callback
        done(cierreturnoSaveErr);
      });
  });

  it('should not be able to save an Cierreturno if no name is provided', function (done) {
    // Invalidate name field
    cierreturno.name = '';

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

        // Save a new Cierreturno
        agent.post('/api/cierreturnos')
          .send(cierreturno)
          .expect(400)
          .end(function (cierreturnoSaveErr, cierreturnoSaveRes) {
            // Set message assertion
            (cierreturnoSaveRes.body.message).should.match('Please fill Cierreturno name');

            // Handle Cierreturno save error
            done(cierreturnoSaveErr);
          });
      });
  });

  it('should be able to update an Cierreturno if signed in', function (done) {
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

        // Save a new Cierreturno
        agent.post('/api/cierreturnos')
          .send(cierreturno)
          .expect(200)
          .end(function (cierreturnoSaveErr, cierreturnoSaveRes) {
            // Handle Cierreturno save error
            if (cierreturnoSaveErr) {
              return done(cierreturnoSaveErr);
            }

            // Update Cierreturno name
            cierreturno.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Cierreturno
            agent.put('/api/cierreturnos/' + cierreturnoSaveRes.body._id)
              .send(cierreturno)
              .expect(200)
              .end(function (cierreturnoUpdateErr, cierreturnoUpdateRes) {
                // Handle Cierreturno update error
                if (cierreturnoUpdateErr) {
                  return done(cierreturnoUpdateErr);
                }

                // Set assertions
                (cierreturnoUpdateRes.body._id).should.equal(cierreturnoSaveRes.body._id);
                (cierreturnoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cierreturnos if not signed in', function (done) {
    // Create new Cierreturno model instance
    var cierreturnoObj = new Cierreturno(cierreturno);

    // Save the cierreturno
    cierreturnoObj.save(function () {
      // Request Cierreturnos
      request(app).get('/api/cierreturnos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cierreturno if not signed in', function (done) {
    // Create new Cierreturno model instance
    var cierreturnoObj = new Cierreturno(cierreturno);

    // Save the Cierreturno
    cierreturnoObj.save(function () {
      request(app).get('/api/cierreturnos/' + cierreturnoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', cierreturno.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cierreturno with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cierreturnos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cierreturno is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cierreturno which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cierreturno
    request(app).get('/api/cierreturnos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cierreturno with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cierreturno if signed in', function (done) {
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

        // Save a new Cierreturno
        agent.post('/api/cierreturnos')
          .send(cierreturno)
          .expect(200)
          .end(function (cierreturnoSaveErr, cierreturnoSaveRes) {
            // Handle Cierreturno save error
            if (cierreturnoSaveErr) {
              return done(cierreturnoSaveErr);
            }

            // Delete an existing Cierreturno
            agent.delete('/api/cierreturnos/' + cierreturnoSaveRes.body._id)
              .send(cierreturno)
              .expect(200)
              .end(function (cierreturnoDeleteErr, cierreturnoDeleteRes) {
                // Handle cierreturno error error
                if (cierreturnoDeleteErr) {
                  return done(cierreturnoDeleteErr);
                }

                // Set assertions
                (cierreturnoDeleteRes.body._id).should.equal(cierreturnoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Cierreturno if not signed in', function (done) {
    // Set Cierreturno user
    cierreturno.user = user;

    // Create new Cierreturno model instance
    var cierreturnoObj = new Cierreturno(cierreturno);

    // Save the Cierreturno
    cierreturnoObj.save(function () {
      // Try deleting Cierreturno
      request(app).delete('/api/cierreturnos/' + cierreturnoObj._id)
        .expect(403)
        .end(function (cierreturnoDeleteErr, cierreturnoDeleteRes) {
          // Set message assertion
          (cierreturnoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Cierreturno error error
          done(cierreturnoDeleteErr);
        });

    });
  });

  it('should be able to get a single Cierreturno that has an orphaned user reference', function (done) {
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

          // Save a new Cierreturno
          agent.post('/api/cierreturnos')
            .send(cierreturno)
            .expect(200)
            .end(function (cierreturnoSaveErr, cierreturnoSaveRes) {
              // Handle Cierreturno save error
              if (cierreturnoSaveErr) {
                return done(cierreturnoSaveErr);
              }

              // Set assertions on new Cierreturno
              (cierreturnoSaveRes.body.name).should.equal(cierreturno.name);
              should.exist(cierreturnoSaveRes.body.user);
              should.equal(cierreturnoSaveRes.body.user._id, orphanId);

              // force the Cierreturno to have an orphaned user reference
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

                    // Get the Cierreturno
                    agent.get('/api/cierreturnos/' + cierreturnoSaveRes.body._id)
                      .expect(200)
                      .end(function (cierreturnoInfoErr, cierreturnoInfoRes) {
                        // Handle Cierreturno error
                        if (cierreturnoInfoErr) {
                          return done(cierreturnoInfoErr);
                        }

                        // Set assertions
                        (cierreturnoInfoRes.body._id).should.equal(cierreturnoSaveRes.body._id);
                        (cierreturnoInfoRes.body.name).should.equal(cierreturno.name);
                        should.equal(cierreturnoInfoRes.body.user, undefined);

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
      Cierreturno.remove().exec(done);
    });
  });
});
