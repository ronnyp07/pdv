//Turnocajas service used to communicate Turnocajas REST endpoints
(function () {
  'use strict';

  angular
    .module('turnocajas')
    .factory('TurnocajasService', TurnocajasService);

  TurnocajasService.$inject = ['$resource'];

  function TurnocajasService($resource) {
    return $resource('api/turnocajas/:turnocajaId', {
      turnocajaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
