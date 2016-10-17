'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Creditpay = mongoose.model('Creditpay');

/**
 * Globals
 */
var user, creditpay;

/**
 * Unit tests
 */
describe('Creditpay Model Unit Tests:', function() {
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
      creditpay = new Creditpay({
        name: 'Creditpay Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return creditpay.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      creditpay.name = '';

      return creditpay.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Creditpay.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
