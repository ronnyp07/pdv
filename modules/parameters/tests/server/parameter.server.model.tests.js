'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Parameter = mongoose.model('Parameters');

/**
 * Globals
 */
var user, parameter;

/**
 * Unit tests
 */
describe('Parameter Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      parameter = new Parameter({
        name: 'Parameter Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      parameter._id = "test";
      return parameter.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      parameter.name = '';

      return parameter.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Parameter.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
