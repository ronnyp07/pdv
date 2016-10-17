'use strict';

/**
 * Module dependencies
 */
var salesPolicy = require('../policies/sales.server.policy'),
  sales = require('../controllers/sales.server.controller');

module.exports = function(app) {
  // Sales Routes
  app.route('/api/sales').all(salesPolicy.isAllowed)
    .get(sales.list)
    .post(sales.create);

  app.route('/api/sales/:saleId').all(salesPolicy.isAllowed)
    .get(sales.read)
    .put(sales.update)
    .delete(sales.delete);

  app.route('/api/salesList')
  .post(sales.salesList);

  // Finish by binding the Sale middleware
  app.param('saleId', sales.saleByID);
};
