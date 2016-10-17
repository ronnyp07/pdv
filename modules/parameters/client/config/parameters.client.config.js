(function () {
  'use strict';

  angular
    .module('parameters')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Parameters',
      state: 'parameters',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'parameters', {
      title: 'List Parameters',
      state: 'parameters.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'parameters', {
      title: 'Create Parameter',
      state: 'parameters.create',
      roles: ['user']
    });
  }
})();
