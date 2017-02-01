'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Lote = mongoose.model('Lote'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, lote;

/**
 * Lote routes tests
 */
describe('Lote CRUD tests', function () {

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

    // Save a user to the test db and create new Lote
    user.save(function () {
      lote = {
        name: 'Lote name'
      };

      done();
    });
  });

  it('should be able to save a Lote if logged in', function (done) {
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

        // Save a new Lote
        agent.post('/api/lotes')
          .send(lote)
          .expect(200)
          .end(function (loteSaveErr, loteSaveRes) {
            // Handle Lote save error
            if (loteSaveErr) {
              return done(loteSaveErr);
            }

            // Get a list of Lotes
            agent.get('/api/lotes')
              .end(function (lotesGetErr, lotesGetRes) {
                // Handle Lote save error
                if (lotesGetErr) {
                  return done(lotesGetErr);
                }

                // Get Lotes list
                var lotes = lotesGetRes.body;

                // Set assertions
                (lotes[0].user._id).should.equal(userId);
                (lotes[0].name).should.match('Lote name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Lote if not logged in', function (done) {
    agent.post('/api/lotes')
      .send(lote)
      .expect(403)
      .end(function (loteSaveErr, loteSaveRes) {
        // Call the assertion callback
        done(loteSaveErr);
      });
  });

  it('should not be able to save an Lote if no name is provided', function (done) {
    // Invalidate name field
    lote.name = '';

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

        // Save a new Lote
        agent.post('/api/lotes')
          .send(lote)
          .expect(400)
          .end(function (loteSaveErr, loteSaveRes) {
            // Set message assertion
            (loteSaveRes.body.message).should.match('Please fill Lote name');

            // Handle Lote save error
            done(loteSaveErr);
          });
      });
  });

  it('should be able to update an Lote if signed in', function (done) {
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

        // Save a new Lote
        agent.post('/api/lotes')
          .send(lote)
          .expect(200)
          .end(function (loteSaveErr, loteSaveRes) {
            // Handle Lote save error
            if (loteSaveErr) {
              return done(loteSaveErr);
            }

            // Update Lote name
            lote.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Lote
            agent.put('/api/lotes/' + loteSaveRes.body._id)
              .send(lote)
              .expect(200)
              .end(function (loteUpdateErr, loteUpdateRes) {
                // Handle Lote update error
                if (loteUpdateErr) {
                  return done(loteUpdateErr);
                }

                // Set assertions
                (loteUpdateRes.body._id).should.equal(loteSaveRes.body._id);
                (loteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Lotes if not signed in', function (done) {
    // Create new Lote model instance
    var loteObj = new Lote(lote);

    // Save the lote
    loteObj.save(function () {
      // Request Lotes
      request(app).get('/api/lotes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Lote if not signed in', function (done) {
    // Create new Lote model instance
    var loteObj = new Lote(lote);

    // Save the Lote
    loteObj.save(function () {
      request(app).get('/api/lotes/' + loteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', lote.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Lote with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/lotes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Lote is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Lote which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Lote
    request(app).get('/api/lotes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Lote with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Lote if signed in', function (done) {
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

        // Save a new Lote
        agent.post('/api/lotes')
          .send(lote)
          .expect(200)
          .end(function (loteSaveErr, loteSaveRes) {
            // Handle Lote save error
            if (loteSaveErr) {
              return done(loteSaveErr);
            }

            // Delete an existing Lote
            agent.delete('/api/lotes/' + loteSaveRes.body._id)
              .send(lote)
              .expect(200)
              .end(function (loteDeleteErr, loteDeleteRes) {
                // Handle lote error error
                if (loteDeleteErr) {
                  return done(loteDeleteErr);
                }

                // Set assertions
                (loteDeleteRes.body._id).should.equal(loteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Lote if not signed in', function (done) {
    // Set Lote user
    lote.user = user;

    // Create new Lote model instance
    var loteObj = new Lote(lote);

    // Save the Lote
    loteObj.save(function () {
      // Try deleting Lote
      request(app).delete('/api/lotes/' + loteObj._id)
        .expect(403)
        .end(function (loteDeleteErr, loteDeleteRes) {
          // Set message assertion
          (loteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Lote error error
          done(loteDeleteErr);
        });

    });
  });

  it('should be able to get a single Lote that has an orphaned user reference', function (done) {
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

          // Save a new Lote
          agent.post('/api/lotes')
            .send(lote)
            .expect(200)
            .end(function (loteSaveErr, loteSaveRes) {
              // Handle Lote save error
              if (loteSaveErr) {
                return done(loteSaveErr);
              }

              // Set assertions on new Lote
              (loteSaveRes.body.name).should.equal(lote.name);
              should.exist(loteSaveRes.body.user);
              should.equal(loteSaveRes.body.user._id, orphanId);

              // force the Lote to have an orphaned user reference
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

                    // Get the Lote
                    agent.get('/api/lotes/' + loteSaveRes.body._id)
                      .expect(200)
                      .end(function (loteInfoErr, loteInfoRes) {
                        // Handle Lote error
                        if (loteInfoErr) {
                          return done(loteInfoErr);
                        }

                        // Set assertions
                        (loteInfoRes.body._id).should.equal(loteSaveRes.body._id);
                        (loteInfoRes.body.name).should.equal(lote.name);
                        should.equal(loteInfoRes.body.user, undefined);

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
      Lote.remove().exec(done);
    });
  });
});
