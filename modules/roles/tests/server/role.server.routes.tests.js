'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Role = mongoose.model('Role'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, role;

/**
 * Role routes tests
 */
describe('Role CRUD tests', function () {

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

    // Save a user to the test db and create new Role
    user.save(function () {
      role = {
        name: 'Role name'
      };

      done();
    });
  });

  it('should be able to save a Role if logged in', function (done) {
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

        // Save a new Role
        agent.post('/api/roles')
          .send(role)
          .expect(200)
          .end(function (roleSaveErr, roleSaveRes) {
            // Handle Role save error
            if (roleSaveErr) {
              return done(roleSaveErr);
            }

            // Get a list of Roles
            agent.get('/api/roles')
              .end(function (rolesGetErr, rolesGetRes) {
                // Handle Role save error
                if (rolesGetErr) {
                  return done(rolesGetErr);
                }

                // Get Roles list
                var roles = rolesGetRes.body;

                // Set assertions
                (roles[0].user._id).should.equal(userId);
                (roles[0].name).should.match('Role name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Role if not logged in', function (done) {
    agent.post('/api/roles')
      .send(role)
      .expect(403)
      .end(function (roleSaveErr, roleSaveRes) {
        // Call the assertion callback
        done(roleSaveErr);
      });
  });

  it('should not be able to save an Role if no name is provided', function (done) {
    // Invalidate name field
    role.name = '';

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

        // Save a new Role
        agent.post('/api/roles')
          .send(role)
          .expect(400)
          .end(function (roleSaveErr, roleSaveRes) {
            // Set message assertion
            (roleSaveRes.body.message).should.match('Please fill Role name');

            // Handle Role save error
            done(roleSaveErr);
          });
      });
  });

  it('should be able to update an Role if signed in', function (done) {
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

        // Save a new Role
        agent.post('/api/roles')
          .send(role)
          .expect(200)
          .end(function (roleSaveErr, roleSaveRes) {
            // Handle Role save error
            if (roleSaveErr) {
              return done(roleSaveErr);
            }

            // Update Role name
            role.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Role
            agent.put('/api/roles/' + roleSaveRes.body._id)
              .send(role)
              .expect(200)
              .end(function (roleUpdateErr, roleUpdateRes) {
                // Handle Role update error
                if (roleUpdateErr) {
                  return done(roleUpdateErr);
                }

                // Set assertions
                (roleUpdateRes.body._id).should.equal(roleSaveRes.body._id);
                (roleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Roles if not signed in', function (done) {
    // Create new Role model instance
    var roleObj = new Role(role);

    // Save the role
    roleObj.save(function () {
      // Request Roles
      request(app).get('/api/roles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Role if not signed in', function (done) {
    // Create new Role model instance
    var roleObj = new Role(role);

    // Save the Role
    roleObj.save(function () {
      request(app).get('/api/roles/' + roleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', role.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Role with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/roles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Role is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Role which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Role
    request(app).get('/api/roles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Role with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Role if signed in', function (done) {
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

        // Save a new Role
        agent.post('/api/roles')
          .send(role)
          .expect(200)
          .end(function (roleSaveErr, roleSaveRes) {
            // Handle Role save error
            if (roleSaveErr) {
              return done(roleSaveErr);
            }

            // Delete an existing Role
            agent.delete('/api/roles/' + roleSaveRes.body._id)
              .send(role)
              .expect(200)
              .end(function (roleDeleteErr, roleDeleteRes) {
                // Handle role error error
                if (roleDeleteErr) {
                  return done(roleDeleteErr);
                }

                // Set assertions
                (roleDeleteRes.body._id).should.equal(roleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Role if not signed in', function (done) {
    // Set Role user
    role.user = user;

    // Create new Role model instance
    var roleObj = new Role(role);

    // Save the Role
    roleObj.save(function () {
      // Try deleting Role
      request(app).delete('/api/roles/' + roleObj._id)
        .expect(403)
        .end(function (roleDeleteErr, roleDeleteRes) {
          // Set message assertion
          (roleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Role error error
          done(roleDeleteErr);
        });

    });
  });

  it('should be able to get a single Role that has an orphaned user reference', function (done) {
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

          // Save a new Role
          agent.post('/api/roles')
            .send(role)
            .expect(200)
            .end(function (roleSaveErr, roleSaveRes) {
              // Handle Role save error
              if (roleSaveErr) {
                return done(roleSaveErr);
              }

              // Set assertions on new Role
              (roleSaveRes.body.name).should.equal(role.name);
              should.exist(roleSaveRes.body.user);
              should.equal(roleSaveRes.body.user._id, orphanId);

              // force the Role to have an orphaned user reference
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

                    // Get the Role
                    agent.get('/api/roles/' + roleSaveRes.body._id)
                      .expect(200)
                      .end(function (roleInfoErr, roleInfoRes) {
                        // Handle Role error
                        if (roleInfoErr) {
                          return done(roleInfoErr);
                        }

                        // Set assertions
                        (roleInfoRes.body._id).should.equal(roleSaveRes.body._id);
                        (roleInfoRes.body.name).should.equal(role.name);
                        should.equal(roleInfoRes.body.user, undefined);

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
      Role.remove().exec(done);
    });
  });
});
