'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sale = mongoose.model('Sale'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, sale;

/**
 * Sale routes tests
 */
describe('Sale CRUD tests', function () {

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

    // Save a user to the test db and create new Sale
    user.save(function () {
      sale = {
        name: 'Sale name'
      };

      done();
    });
  });

  it('should be able to save a Sale if logged in', function (done) {
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

        // Save a new Sale
        agent.post('/api/sales')
          .send(sale)
          .expect(200)
          .end(function (saleSaveErr, saleSaveRes) {
            // Handle Sale save error
            if (saleSaveErr) {
              return done(saleSaveErr);
            }

            // Get a list of Sales
            agent.get('/api/sales')
              .end(function (salesGetErr, salesGetRes) {
                // Handle Sale save error
                if (salesGetErr) {
                  return done(salesGetErr);
                }

                // Get Sales list
                var sales = salesGetRes.body;

                // Set assertions
                (sales[0].user._id).should.equal(userId);
                (sales[0].name).should.match('Sale name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sale if not logged in', function (done) {
    agent.post('/api/sales')
      .send(sale)
      .expect(403)
      .end(function (saleSaveErr, saleSaveRes) {
        // Call the assertion callback
        done(saleSaveErr);
      });
  });

  it('should not be able to save an Sale if no name is provided', function (done) {
    // Invalidate name field
    sale.name = '';

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

        // Save a new Sale
        agent.post('/api/sales')
          .send(sale)
          .expect(400)
          .end(function (saleSaveErr, saleSaveRes) {
            // Set message assertion
            (saleSaveRes.body.message).should.match('Please fill Sale name');

            // Handle Sale save error
            done(saleSaveErr);
          });
      });
  });

  it('should be able to update an Sale if signed in', function (done) {
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

        // Save a new Sale
        agent.post('/api/sales')
          .send(sale)
          .expect(200)
          .end(function (saleSaveErr, saleSaveRes) {
            // Handle Sale save error
            if (saleSaveErr) {
              return done(saleSaveErr);
            }

            // Update Sale name
            sale.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sale
            agent.put('/api/sales/' + saleSaveRes.body._id)
              .send(sale)
              .expect(200)
              .end(function (saleUpdateErr, saleUpdateRes) {
                // Handle Sale update error
                if (saleUpdateErr) {
                  return done(saleUpdateErr);
                }

                // Set assertions
                (saleUpdateRes.body._id).should.equal(saleSaveRes.body._id);
                (saleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sales if not signed in', function (done) {
    // Create new Sale model instance
    var saleObj = new Sale(sale);

    // Save the sale
    saleObj.save(function () {
      // Request Sales
      request(app).get('/api/sales')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sale if not signed in', function (done) {
    // Create new Sale model instance
    var saleObj = new Sale(sale);

    // Save the Sale
    saleObj.save(function () {
      request(app).get('/api/sales/' + saleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sale.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sale with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sales/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sale is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sale which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sale
    request(app).get('/api/sales/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sale with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sale if signed in', function (done) {
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

        // Save a new Sale
        agent.post('/api/sales')
          .send(sale)
          .expect(200)
          .end(function (saleSaveErr, saleSaveRes) {
            // Handle Sale save error
            if (saleSaveErr) {
              return done(saleSaveErr);
            }

            // Delete an existing Sale
            agent.delete('/api/sales/' + saleSaveRes.body._id)
              .send(sale)
              .expect(200)
              .end(function (saleDeleteErr, saleDeleteRes) {
                // Handle sale error error
                if (saleDeleteErr) {
                  return done(saleDeleteErr);
                }

                // Set assertions
                (saleDeleteRes.body._id).should.equal(saleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sale if not signed in', function (done) {
    // Set Sale user
    sale.user = user;

    // Create new Sale model instance
    var saleObj = new Sale(sale);

    // Save the Sale
    saleObj.save(function () {
      // Try deleting Sale
      request(app).delete('/api/sales/' + saleObj._id)
        .expect(403)
        .end(function (saleDeleteErr, saleDeleteRes) {
          // Set message assertion
          (saleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sale error error
          done(saleDeleteErr);
        });

    });
  });

  it('should be able to get a single Sale that has an orphaned user reference', function (done) {
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

          // Save a new Sale
          agent.post('/api/sales')
            .send(sale)
            .expect(200)
            .end(function (saleSaveErr, saleSaveRes) {
              // Handle Sale save error
              if (saleSaveErr) {
                return done(saleSaveErr);
              }

              // Set assertions on new Sale
              (saleSaveRes.body.name).should.equal(sale.name);
              should.exist(saleSaveRes.body.user);
              should.equal(saleSaveRes.body.user._id, orphanId);

              // force the Sale to have an orphaned user reference
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

                    // Get the Sale
                    agent.get('/api/sales/' + saleSaveRes.body._id)
                      .expect(200)
                      .end(function (saleInfoErr, saleInfoRes) {
                        // Handle Sale error
                        if (saleInfoErr) {
                          return done(saleInfoErr);
                        }

                        // Set assertions
                        (saleInfoRes.body._id).should.equal(saleSaveRes.body._id);
                        (saleInfoRes.body.name).should.equal(sale.name);
                        should.equal(saleInfoRes.body.user, undefined);

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
      Sale.remove().exec(done);
    });
  });
});
