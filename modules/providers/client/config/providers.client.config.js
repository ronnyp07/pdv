(function () {
  'use strict';

  angular
    .module('providers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Providers',
      state: 'providers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'providers', {
      title: 'List Providers',
      state: 'providers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'providers', {
      title: 'Create Provider',
      state: 'providers.create',
      roles: ['user']
    });
  }
})();
