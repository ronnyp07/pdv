'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Abono = mongoose.model('Abono');

/**
 * Globals
 */
<<<<<<< HEAD:modules/articles/tests/server/article.server.model.tests.js
var user,
  article;
=======
var user, abono;
>>>>>>> lost_changes:modules/abonos/tests/server/abono.server.model.tests.js

/**
 * Unit tests
 */
<<<<<<< HEAD:modules/articles/tests/server/article.server.model.tests.js
describe('Article Model Unit Tests:', function () {

  beforeEach(function (done) {
=======
describe('Abono Model Unit Tests:', function() {
  beforeEach(function(done) {
>>>>>>> lost_changes:modules/abonos/tests/server/abono.server.model.tests.js
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function() { 
      abono = new Abono({
        name: 'Abono Name',
        user: user
      });

      done();
    });
  });

<<<<<<< HEAD:modules/articles/tests/server/article.server.model.tests.js
  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return article.save(function (err) {
=======
  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return abono.save(function(err) {
>>>>>>> lost_changes:modules/abonos/tests/server/abono.server.model.tests.js
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      abono.name = '';

      return abono.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Abono.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
