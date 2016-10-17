(function (window) {
  'use strict';

  var applicationModuleName = 'mean';
<<<<<<< HEAD

  var service = {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'angularFileUpload'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;
=======
  var applicationModuleVendorDependencies = [
  'ngResource',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'ui.utils',
  'angularFileUpload',
  'ngTable',
  'mgcrea.ngStrap',
  'ngMaterial',
  'ngBootbox',
  'ui.select',
  'ui.mask',
  'ui.utils.masks',
  'angular-cache',
  'oi.select',
  'angular-ladda',
  'angularSpinner',
  'angularUtils.directives.dirPagination',
  'infinite-scroll',
  'luegg.directives',
  'onScreenKeyboard',
  'angular-virtual-keyboard'];
>>>>>>> lost_changes

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }
}(window));
