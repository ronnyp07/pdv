(function () {
  'use strict';

  angular
    .module('sales')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Sales',
      state: 'sales',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sales', {
      title: 'List Sales',
      state: 'sales.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sales', {
      title: 'Create Sale',
      state: 'sales.create',
      roles: ['user']
    });
  }
})();
