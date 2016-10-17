'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Provider = mongoose.model('Provider'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, provider;

/**
 * Provider routes tests
 */
describe('Provider CRUD tests', function () {

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

    // Save a user to the test db and create new Provider
    user.save(function () {
      provider = {
        name: 'Provider name'
      };

      done();
    });
  });

  it('should be able to save a Provider if logged in', function (done) {
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

        // Save a new Provider
        agent.post('/api/providers')
          .send(provider)
          .expect(200)
          .end(function (providerSaveErr, providerSaveRes) {
            // Handle Provider save error
            if (providerSaveErr) {
              return done(providerSaveErr);
            }

            // Get a list of Providers
            agent.get('/api/providers')
              .end(function (providersGetErr, providersGetRes) {
                // Handle Provider save error
                if (providersGetErr) {
                  return done(providersGetErr);
                }

                // Get Providers list
                var providers = providersGetRes.body;

                // Set assertions
                (providers[0].user._id).should.equal(userId);
                (providers[0].name).should.match('Provider name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Provider if not logged in', function (done) {
    agent.post('/api/providers')
      .send(provider)
      .expect(403)
      .end(function (providerSaveErr, providerSaveRes) {
        // Call the assertion callback
        done(providerSaveErr);
      });
  });

  it('should not be able to save an Provider if no name is provided', function (done) {
    // Invalidate name field
    provider.name = '';

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

        // Save a new Provider
        agent.post('/api/providers')
          .send(provider)
          .expect(400)
          .end(function (providerSaveErr, providerSaveRes) {
            // Set message assertion
            (providerSaveRes.body.message).should.match('Please fill Provider name');

            // Handle Provider save error
            done(providerSaveErr);
          });
      });
  });

  it('should be able to update an Provider if signed in', function (done) {
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

        // Save a new Provider
        agent.post('/api/providers')
          .send(provider)
          .expect(200)
          .end(function (providerSaveErr, providerSaveRes) {
            // Handle Provider save error
            if (providerSaveErr) {
              return done(providerSaveErr);
            }

            // Update Provider name
            provider.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Provider
            agent.put('/api/providers/' + providerSaveRes.body._id)
              .send(provider)
              .expect(200)
              .end(function (providerUpdateErr, providerUpdateRes) {
                // Handle Provider update error
                if (providerUpdateErr) {
                  return done(providerUpdateErr);
                }

                // Set assertions
                (providerUpdateRes.body._id).should.equal(providerSaveRes.body._id);
                (providerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Providers if not signed in', function (done) {
    // Create new Provider model instance
    var providerObj = new Provider(provider);

    // Save the provider
    providerObj.save(function () {
      // Request Providers
      request(app).get('/api/providers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Provider if not signed in', function (done) {
    // Create new Provider model instance
    var providerObj = new Provider(provider);

    // Save the Provider
    providerObj.save(function () {
      request(app).get('/api/providers/' + providerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', provider.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Provider with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/providers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Provider is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Provider which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Provider
    request(app).get('/api/providers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Provider with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Provider if signed in', function (done) {
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

        // Save a new Provider
        agent.post('/api/providers')
          .send(provider)
          .expect(200)
          .end(function (providerSaveErr, providerSaveRes) {
            // Handle Provider save error
            if (providerSaveErr) {
              return done(providerSaveErr);
            }

            // Delete an existing Provider
            agent.delete('/api/providers/' + providerSaveRes.body._id)
              .send(provider)
              .expect(200)
              .end(function (providerDeleteErr, providerDeleteRes) {
                // Handle provider error error
                if (providerDeleteErr) {
                  return done(providerDeleteErr);
                }

                // Set assertions
                (providerDeleteRes.body._id).should.equal(providerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Provider if not signed in', function (done) {
    // Set Provider user
    provider.user = user;

    // Create new Provider model instance
    var providerObj = new Provider(provider);

    // Save the Provider
    providerObj.save(function () {
      // Try deleting Provider
      request(app).delete('/api/providers/' + providerObj._id)
        .expect(403)
        .end(function (providerDeleteErr, providerDeleteRes) {
          // Set message assertion
          (providerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Provider error error
          done(providerDeleteErr);
        });

    });
  });

  it('should be able to get a single Provider that has an orphaned user reference', function (done) {
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

          // Save a new Provider
          agent.post('/api/providers')
            .send(provider)
            .expect(200)
            .end(function (providerSaveErr, providerSaveRes) {
              // Handle Provider save error
              if (providerSaveErr) {
                return done(providerSaveErr);
              }

              // Set assertions on new Provider
              (providerSaveRes.body.name).should.equal(provider.name);
              should.exist(providerSaveRes.body.user);
              should.equal(providerSaveRes.body.user._id, orphanId);

              // force the Provider to have an orphaned user reference
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

                    // Get the Provider
                    agent.get('/api/providers/' + providerSaveRes.body._id)
                      .expect(200)
                      .end(function (providerInfoErr, providerInfoRes) {
                        // Handle Provider error
                        if (providerInfoErr) {
                          return done(providerInfoErr);
                        }

                        // Set assertions
                        (providerInfoRes.body._id).should.equal(providerSaveRes.body._id);
                        (providerInfoRes.body.name).should.equal(provider.name);
                        should.equal(providerInfoRes.body.user, undefined);

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
      Provider.remove().exec(done);
    });
  });
});
