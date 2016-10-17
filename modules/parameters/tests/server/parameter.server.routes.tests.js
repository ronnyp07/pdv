'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Parameter = mongoose.model('Parameters'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, parameter;

/**
 * Parameter routes tests
 */
describe('Parameter CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'admin',
      password: 'Sk3l3t0n$'
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

    // Save a user to the test db and create new Parameter
    user.save(function () {
      parameter = {
        name: 'Parameter name'
      };

      done();
    });
  });

  it('should be able to save a Parameter if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = '579802970dbf66d0528fae30';
        // console.log(credentials);
         //console.log(signinRes);

        // Save a new Parameter
        agent.post('/api/parameters')
          .send(parameter)
          .expect(200)
          .end(function (parameterSaveErr, parameterSaveRes) {
            // Handle Parameter save error
            if (parameterSaveErr) {
              return done(parameterSaveErr);
            }

            // Get a list of Parameters
            agent.get('/api/parameters')
              .end(function (parametersGetErr, parametersGetRes) {
                // Handle Parameter save error
                if (parametersGetErr) {
                  return done(parametersGetErr);
                }

                // Get Parameters list
                var parameters = parametersGetRes.body.results;
                // Set assertions
                //(parameters[0].user._id).should.equal(userId);
                (parameters[0].name).should.match('Parameter name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Parameter if not logged in', function (done) {
    agent.post('/api/parameters')
      .send(parameter)
      .expect(403)
      .end(function (parameterSaveErr, parameterSaveRes) {
        // Call the assertion callback
        done(parameterSaveErr);
      });
  });

  it('should not be able to save an Parameter if no name is provided', function (done) {
    // Invalidate name field
    parameter.name = '';

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

        // Save a new Parameter
        agent.post('/api/parameters')
          .send(parameter)
          .expect(400)
          .end(function (parameterSaveErr, parameterSaveRes) {
            // Set message assertion
            (parameterSaveRes.body.message).should.match('Nombre del parametro requerido');

            // Handle Parameter save error
            done(parameterSaveErr);
          });
      });
  });

  it('should be able to update an Parameter if signed in', function (done) {
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

        // Save a new Parameter
        agent.post('/api/parameters')
          .send(parameter)
          .expect(200)
          .end(function (parameterSaveErr, parameterSaveRes) {
            // Handle Parameter save error
            if (parameterSaveErr) {
              return done(parameterSaveErr);
            }

            // Update Parameter name
            parameter.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Parameter
            agent.put('/api/parameters/' + parameterSaveRes.body._id)
              .send(parameter)
              .expect(200)
              .end(function (parameterUpdateErr, parameterUpdateRes) {
                // Handle Parameter update error
                if (parameterUpdateErr) {
                  return done(parameterUpdateErr);
                }

                // Set assertions
                (parameterUpdateRes.body._id).should.equal(parameterSaveRes.body._id);
                (parameterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should be able to get a list of Parameters if not signed in', function (done) {
  //   // Create new Parameter model instance
  //   var parameterObj = new Parameter(parameter);

  //   // Save the parameter
  //   parameterObj.save(function () {
  //     // Request Parameters
  //     request(app).get('/api/parameters')
  //       .end(function (req, res) {
  //         // Set assertion
  //         res.body.results.should.be.instanceof(Array).and.have.lengthOf(1);

  //         // Call the assertion callback
  //         done();
  //       });

  //   });
  // });

  // it('should be able to get a single Parameter if not signed in', function (done) {
  //   // Create new Parameter model instance
  //   var parameterObj = new Parameter(parameter);

  //   // Save the Parameter
  //   parameterObj.save(function () {
  //     request(app).get('/api/parameters/' + parameterObj._id)
  //       .end(function (req, res) {
  //         // Set assertion
  //         res.body.should.be.instanceof(Object).and.have.property('name', parameter.name);

  //         // Call the assertion callback
  //         done();
  //       });
  //   });
  // });

  // it('should return proper error for single Parameter with an invalid Id, if not signed in', function (done) {
  //   // test is not a valid mongoose Id
  //   request(app).get('/api/parameters/test')
  //     .end(function (req, res) {
  //       // Set assertion
  //       res.body.should.be.instanceof(Object).and.have.property('message', 'Parameter is invalid');

  //       // Call the assertion callback
  //       done();
  //     });
  // });

  // it('should return proper error for single Parameter which doesnt exist, if not signed in', function (done) {
  //   // This is a valid mongoose Id but a non-existent Parameter
  //   request(app).get('/api/parameters/559e9cd815f80b4c256a8f41')
  //     .end(function (req, res) {
  //       // Set assertion
  //       res.body.should.be.instanceof(Object).and.have.property('message', 'No Parameter with that identifier has been found');

  //       // Call the assertion callback
  //       done();
  //     });
  // });

  it('should be able to delete an Parameter if signed in', function (done) {
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

        // Save a new Parameter
        agent.post('/api/parameters')
          .send(parameter)
          .expect(200)
          .end(function (parameterSaveErr, parameterSaveRes) {
            // Handle Parameter save error
            if (parameterSaveErr) {
              return done(parameterSaveErr);
            }

            // Delete an existing Parameter
            agent.delete('/api/parameters/' + parameterSaveRes.body._id)
              .send(parameter)
              .expect(200)
              .end(function (parameterDeleteErr, parameterDeleteRes) {
                // Handle parameter error error
                if (parameterDeleteErr) {
                  return done(parameterDeleteErr);
                }

                // Set assertions
                (parameterDeleteRes.body._id).should.equal(parameterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Parameter if not signed in', function (done) {
    // Set Parameter user

    parameter.user = user;
    //parameter._id = 'Femenino';

    // Create new Parameter model instance
    var parameterObj = new Parameter(parameter);

    // Save the Parameter
    parameterObj.save(function () {
      // Try deleting Parameter
      request(app).delete('/api/parameters/' + parameterObj._id)
        .expect(403)
        .end(function (parameterDeleteErr, parameterDeleteRes) {
          // Set message assertion
          (parameterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Parameter error error
          done(parameterDeleteErr);
        });

    });
  });

  it('should be able to get a single Parameter that has an orphaned user reference', function (done) {
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

          // Save a new Parameter
          agent.post('/api/parameters')
            .send(parameter)
            .expect(200)
            .end(function (parameterSaveErr, parameterSaveRes) {
              // Handle Parameter save error
              if (parameterSaveErr) {
                return done(parameterSaveErr);
              }

              // Set assertions on new Parameter
              (parameterSaveRes.body.name).should.equal(parameter.name);
              should.exist(parameterSaveRes.body.user);
              should.equal(parameterSaveRes.body.user._id, orphanId);

              // force the Parameter to have an orphaned user reference
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

                    // Get the Parameter
                    agent.get('/api/parameters/' + parameterSaveRes.body._id)
                      .expect(200)
                      .end(function (parameterInfoErr, parameterInfoRes) {
                        // Handle Parameter error
                        if (parameterInfoErr) {
                          return done(parameterInfoErr);
                        }

                        // Set assertions
                        (parameterInfoRes.body._id).should.equal(parameterSaveRes.body._id);
                        (parameterInfoRes.body.name).should.equal(parameter.name);
                        should.equal(parameterInfoRes.body.user, undefined);

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
      Parameter.remove().exec(done);
    });
  });
});
