'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Log = mongoose.model('Log'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, log;

/**
 * Log routes tests
 */
describe('Log CRUD tests', function () {

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

    // Save a user to the test db and create new Log
    user.save(function () {
      log = {
        name: 'Log name'
      };

      done();
    });
  });

  it('should be able to save a Log if logged in', function (done) {
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

        // Save a new Log
        agent.post('/api/logs')
          .send(log)
          .expect(200)
          .end(function (logSaveErr, logSaveRes) {
            // Handle Log save error
            if (logSaveErr) {
              return done(logSaveErr);
            }

            // Get a list of Logs
            agent.get('/api/logs')
              .end(function (logsGetErr, logsGetRes) {
                // Handle Log save error
                if (logsGetErr) {
                  return done(logsGetErr);
                }

                // Get Logs list
                var logs = logsGetRes.body;

                // Set assertions
                (logs[0].user._id).should.equal(userId);
                (logs[0].name).should.match('Log name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Log if not logged in', function (done) {
    agent.post('/api/logs')
      .send(log)
      .expect(403)
      .end(function (logSaveErr, logSaveRes) {
        // Call the assertion callback
        done(logSaveErr);
      });
  });

  it('should not be able to save an Log if no name is provided', function (done) {
    // Invalidate name field
    log.name = '';

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

        // Save a new Log
        agent.post('/api/logs')
          .send(log)
          .expect(400)
          .end(function (logSaveErr, logSaveRes) {
            // Set message assertion
            (logSaveRes.body.message).should.match('Please fill Log name');

            // Handle Log save error
            done(logSaveErr);
          });
      });
  });

  it('should be able to update an Log if signed in', function (done) {
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

        // Save a new Log
        agent.post('/api/logs')
          .send(log)
          .expect(200)
          .end(function (logSaveErr, logSaveRes) {
            // Handle Log save error
            if (logSaveErr) {
              return done(logSaveErr);
            }

            // Update Log name
            log.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Log
            agent.put('/api/logs/' + logSaveRes.body._id)
              .send(log)
              .expect(200)
              .end(function (logUpdateErr, logUpdateRes) {
                // Handle Log update error
                if (logUpdateErr) {
                  return done(logUpdateErr);
                }

                // Set assertions
                (logUpdateRes.body._id).should.equal(logSaveRes.body._id);
                (logUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Logs if not signed in', function (done) {
    // Create new Log model instance
    var logObj = new Log(log);

    // Save the log
    logObj.save(function () {
      // Request Logs
      request(app).get('/api/logs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Log if not signed in', function (done) {
    // Create new Log model instance
    var logObj = new Log(log);

    // Save the Log
    logObj.save(function () {
      request(app).get('/api/logs/' + logObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', log.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Log with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/logs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Log is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Log which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Log
    request(app).get('/api/logs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Log with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Log if signed in', function (done) {
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

        // Save a new Log
        agent.post('/api/logs')
          .send(log)
          .expect(200)
          .end(function (logSaveErr, logSaveRes) {
            // Handle Log save error
            if (logSaveErr) {
              return done(logSaveErr);
            }

            // Delete an existing Log
            agent.delete('/api/logs/' + logSaveRes.body._id)
              .send(log)
              .expect(200)
              .end(function (logDeleteErr, logDeleteRes) {
                // Handle log error error
                if (logDeleteErr) {
                  return done(logDeleteErr);
                }

                // Set assertions
                (logDeleteRes.body._id).should.equal(logSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Log if not signed in', function (done) {
    // Set Log user
    log.user = user;

    // Create new Log model instance
    var logObj = new Log(log);

    // Save the Log
    logObj.save(function () {
      // Try deleting Log
      request(app).delete('/api/logs/' + logObj._id)
        .expect(403)
        .end(function (logDeleteErr, logDeleteRes) {
          // Set message assertion
          (logDeleteRes.body.message).should.match('User is not authorized');

          // Handle Log error error
          done(logDeleteErr);
        });

    });
  });

  it('should be able to get a single Log that has an orphaned user reference', function (done) {
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

          // Save a new Log
          agent.post('/api/logs')
            .send(log)
            .expect(200)
            .end(function (logSaveErr, logSaveRes) {
              // Handle Log save error
              if (logSaveErr) {
                return done(logSaveErr);
              }

              // Set assertions on new Log
              (logSaveRes.body.name).should.equal(log.name);
              should.exist(logSaveRes.body.user);
              should.equal(logSaveRes.body.user._id, orphanId);

              // force the Log to have an orphaned user reference
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

                    // Get the Log
                    agent.get('/api/logs/' + logSaveRes.body._id)
                      .expect(200)
                      .end(function (logInfoErr, logInfoRes) {
                        // Handle Log error
                        if (logInfoErr) {
                          return done(logInfoErr);
                        }

                        // Set assertions
                        (logInfoRes.body._id).should.equal(logSaveRes.body._id);
                        (logInfoRes.body.name).should.equal(log.name);
                        should.equal(logInfoRes.body.user, undefined);

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
      Log.remove().exec(done);
    });
  });
});
