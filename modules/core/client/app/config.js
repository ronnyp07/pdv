'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
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

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
