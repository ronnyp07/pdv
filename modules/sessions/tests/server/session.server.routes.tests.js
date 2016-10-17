'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Session = mongoose.model('Session'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, session;

/**
 * Session routes tests
 */
describe('Session CRUD tests', function () {

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

    // Save a user to the test db and create new Session
    user.save(function () {
      session = {
        name: 'Session name'
      };

      done();
    });
  });

  it('should be able to save a Session if logged in', function (done) {
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

        // Save a new Session
        agent.post('/api/sessions')
          .send(session)
          .expect(200)
          .end(function (sessionSaveErr, sessionSaveRes) {
            // Handle Session save error
            if (sessionSaveErr) {
              return done(sessionSaveErr);
            }

            // Get a list of Sessions
            agent.get('/api/sessions')
              .end(function (sessionsGetErr, sessionsGetRes) {
                // Handle Session save error
                if (sessionsGetErr) {
                  return done(sessionsGetErr);
                }

                // Get Sessions list
                var sessions = sessionsGetRes.body;

                // Set assertions
                (sessions[0].user._id).should.equal(userId);
                (sessions[0].name).should.match('Session name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Session if not logged in', function (done) {
    agent.post('/api/sessions')
      .send(session)
      .expect(403)
      .end(function (sessionSaveErr, sessionSaveRes) {
        // Call the assertion callback
        done(sessionSaveErr);
      });
  });

  it('should not be able to save an Session if no name is provided', function (done) {
    // Invalidate name field
    session.name = '';

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

        // Save a new Session
        agent.post('/api/sessions')
          .send(session)
          .expect(400)
          .end(function (sessionSaveErr, sessionSaveRes) {
            // Set message assertion
            (sessionSaveRes.body.message).should.match('Please fill Session name');

            // Handle Session save error
            done(sessionSaveErr);
          });
      });
  });

  it('should be able to update an Session if signed in', function (done) {
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

        // Save a new Session
        agent.post('/api/sessions')
          .send(session)
          .expect(200)
          .end(function (sessionSaveErr, sessionSaveRes) {
            // Handle Session save error
            if (sessionSaveErr) {
              return done(sessionSaveErr);
            }

            // Update Session name
            session.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Session
            agent.put('/api/sessions/' + sessionSaveRes.body._id)
              .send(session)
              .expect(200)
              .end(function (sessionUpdateErr, sessionUpdateRes) {
                // Handle Session update error
                if (sessionUpdateErr) {
                  return done(sessionUpdateErr);
                }

                // Set assertions
                (sessionUpdateRes.body._id).should.equal(sessionSaveRes.body._id);
                (sessionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sessions if not signed in', function (done) {
    // Create new Session model instance
    var sessionObj = new Session(session);

    // Save the session
    sessionObj.save(function () {
      // Request Sessions
      request(app).get('/api/sessions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Session if not signed in', function (done) {
    // Create new Session model instance
    var sessionObj = new Session(session);

    // Save the Session
    sessionObj.save(function () {
      request(app).get('/api/sessions/' + sessionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', session.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Session with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sessions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Session is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Session which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Session
    request(app).get('/api/sessions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Session with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Session if signed in', function (done) {
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

        // Save a new Session
        agent.post('/api/sessions')
          .send(session)
          .expect(200)
          .end(function (sessionSaveErr, sessionSaveRes) {
            // Handle Session save error
            if (sessionSaveErr) {
              return done(sessionSaveErr);
            }

            // Delete an existing Session
            agent.delete('/api/sessions/' + sessionSaveRes.body._id)
              .send(session)
              .expect(200)
              .end(function (sessionDeleteErr, sessionDeleteRes) {
                // Handle session error error
                if (sessionDeleteErr) {
                  return done(sessionDeleteErr);
                }

                // Set assertions
                (sessionDeleteRes.body._id).should.equal(sessionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Session if not signed in', function (done) {
    // Set Session user
    session.user = user;

    // Create new Session model instance
    var sessionObj = new Session(session);

    // Save the Session
    sessionObj.save(function () {
      // Try deleting Session
      request(app).delete('/api/sessions/' + sessionObj._id)
        .expect(403)
        .end(function (sessionDeleteErr, sessionDeleteRes) {
          // Set message assertion
          (sessionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Session error error
          done(sessionDeleteErr);
        });

    });
  });

  it('should be able to get a single Session that has an orphaned user reference', function (done) {
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

          // Save a new Session
          agent.post('/api/sessions')
            .send(session)
            .expect(200)
            .end(function (sessionSaveErr, sessionSaveRes) {
              // Handle Session save error
              if (sessionSaveErr) {
                return done(sessionSaveErr);
              }

              // Set assertions on new Session
              (sessionSaveRes.body.name).should.equal(session.name);
              should.exist(sessionSaveRes.body.user);
              should.equal(sessionSaveRes.body.user._id, orphanId);

              // force the Session to have an orphaned user reference
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

                    // Get the Session
                    agent.get('/api/sessions/' + sessionSaveRes.body._id)
                      .expect(200)
                      .end(function (sessionInfoErr, sessionInfoRes) {
                        // Handle Session error
                        if (sessionInfoErr) {
                          return done(sessionInfoErr);
                        }

                        // Set assertions
                        (sessionInfoRes.body._id).should.equal(sessionSaveRes.body._id);
                        (sessionInfoRes.body.name).should.equal(session.name);
                        should.equal(sessionInfoRes.body.user, undefined);

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
      Session.remove().exec(done);
    });
  });
});
