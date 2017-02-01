'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ncf = mongoose.model('Ncf'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ncf;

/**
 * Ncf routes tests
 */
describe('Ncf CRUD tests', function () {

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

    // Save a user to the test db and create new Ncf
    user.save(function () {
      ncf = {
        name: 'Ncf name'
      };

      done();
    });
  });

  it('should be able to save a Ncf if logged in', function (done) {
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

        // Save a new Ncf
        agent.post('/api/ncfs')
          .send(ncf)
          .expect(200)
          .end(function (ncfSaveErr, ncfSaveRes) {
            // Handle Ncf save error
            if (ncfSaveErr) {
              return done(ncfSaveErr);
            }

            // Get a list of Ncfs
            agent.get('/api/ncfs')
              .end(function (ncfsGetErr, ncfsGetRes) {
                // Handle Ncf save error
                if (ncfsGetErr) {
                  return done(ncfsGetErr);
                }

                // Get Ncfs list
                var ncfs = ncfsGetRes.body;

                // Set assertions
                (ncfs[0].user._id).should.equal(userId);
                (ncfs[0].name).should.match('Ncf name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ncf if not logged in', function (done) {
    agent.post('/api/ncfs')
      .send(ncf)
      .expect(403)
      .end(function (ncfSaveErr, ncfSaveRes) {
        // Call the assertion callback
        done(ncfSaveErr);
      });
  });

  it('should not be able to save an Ncf if no name is provided', function (done) {
    // Invalidate name field
    ncf.name = '';

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

        // Save a new Ncf
        agent.post('/api/ncfs')
          .send(ncf)
          .expect(400)
          .end(function (ncfSaveErr, ncfSaveRes) {
            // Set message assertion
            (ncfSaveRes.body.message).should.match('Please fill Ncf name');

            // Handle Ncf save error
            done(ncfSaveErr);
          });
      });
  });

  it('should be able to update an Ncf if signed in', function (done) {
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

        // Save a new Ncf
        agent.post('/api/ncfs')
          .send(ncf)
          .expect(200)
          .end(function (ncfSaveErr, ncfSaveRes) {
            // Handle Ncf save error
            if (ncfSaveErr) {
              return done(ncfSaveErr);
            }

            // Update Ncf name
            ncf.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ncf
            agent.put('/api/ncfs/' + ncfSaveRes.body._id)
              .send(ncf)
              .expect(200)
              .end(function (ncfUpdateErr, ncfUpdateRes) {
                // Handle Ncf update error
                if (ncfUpdateErr) {
                  return done(ncfUpdateErr);
                }

                // Set assertions
                (ncfUpdateRes.body._id).should.equal(ncfSaveRes.body._id);
                (ncfUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ncfs if not signed in', function (done) {
    // Create new Ncf model instance
    var ncfObj = new Ncf(ncf);

    // Save the ncf
    ncfObj.save(function () {
      // Request Ncfs
      request(app).get('/api/ncfs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ncf if not signed in', function (done) {
    // Create new Ncf model instance
    var ncfObj = new Ncf(ncf);

    // Save the Ncf
    ncfObj.save(function () {
      request(app).get('/api/ncfs/' + ncfObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', ncf.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ncf with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ncfs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ncf is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ncf which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ncf
    request(app).get('/api/ncfs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ncf with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ncf if signed in', function (done) {
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

        // Save a new Ncf
        agent.post('/api/ncfs')
          .send(ncf)
          .expect(200)
          .end(function (ncfSaveErr, ncfSaveRes) {
            // Handle Ncf save error
            if (ncfSaveErr) {
              return done(ncfSaveErr);
            }

            // Delete an existing Ncf
            agent.delete('/api/ncfs/' + ncfSaveRes.body._id)
              .send(ncf)
              .expect(200)
              .end(function (ncfDeleteErr, ncfDeleteRes) {
                // Handle ncf error error
                if (ncfDeleteErr) {
                  return done(ncfDeleteErr);
                }

                // Set assertions
                (ncfDeleteRes.body._id).should.equal(ncfSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ncf if not signed in', function (done) {
    // Set Ncf user
    ncf.user = user;

    // Create new Ncf model instance
    var ncfObj = new Ncf(ncf);

    // Save the Ncf
    ncfObj.save(function () {
      // Try deleting Ncf
      request(app).delete('/api/ncfs/' + ncfObj._id)
        .expect(403)
        .end(function (ncfDeleteErr, ncfDeleteRes) {
          // Set message assertion
          (ncfDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ncf error error
          done(ncfDeleteErr);
        });

    });
  });

  it('should be able to get a single Ncf that has an orphaned user reference', function (done) {
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

          // Save a new Ncf
          agent.post('/api/ncfs')
            .send(ncf)
            .expect(200)
            .end(function (ncfSaveErr, ncfSaveRes) {
              // Handle Ncf save error
              if (ncfSaveErr) {
                return done(ncfSaveErr);
              }

              // Set assertions on new Ncf
              (ncfSaveRes.body.name).should.equal(ncf.name);
              should.exist(ncfSaveRes.body.user);
              should.equal(ncfSaveRes.body.user._id, orphanId);

              // force the Ncf to have an orphaned user reference
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

                    // Get the Ncf
                    agent.get('/api/ncfs/' + ncfSaveRes.body._id)
                      .expect(200)
                      .end(function (ncfInfoErr, ncfInfoRes) {
                        // Handle Ncf error
                        if (ncfInfoErr) {
                          return done(ncfInfoErr);
                        }

                        // Set assertions
                        (ncfInfoRes.body._id).should.equal(ncfSaveRes.body._id);
                        (ncfInfoRes.body.name).should.equal(ncf.name);
                        should.equal(ncfInfoRes.body.user, undefined);

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
      Ncf.remove().exec(done);
    });
  });
});
