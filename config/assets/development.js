'use strict';

module.exports = {
  // Development assets
   client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap-additions/dist/bootstrap-additions.min.css',
        'public/css/font-awesome.min.css',
        'public/css/animate.css',
        'public/modules/core/css/site.css',
        'public/modules/products/css/product.css',
        'public/modules/sales/css/sales.css',
        'public/modules/inventarios/css/inventario.css',
        'public/lib/bootstrap-additions/dist/bootstrap-additions.min.css',
        'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
        // 'public/modules/parameters/css/parameter.css',
        'public/lib/ng-table/dist/ng-table.min.css',
        'public/dist/css/AdminLTE.min.css',
        'public/dist/css/skins/_all-skins.min.css',
        'public/plugins/iCheck/flat/blue.css',
        'public/plugins/morris/morris.css',
        'public/plugins/jvectormap/jquery-jvectormap-1.2.2.css',
        'public/plugins/datepicker/datepicker3.css',
        'public/plugins/daterangepicker/daterangepicker-bs3.css',
        'public/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min',
        'public/lib/angular-material/angular-material.css',
        'public/lib/mdi/css/materialdesignicons.min.css',
        'public/lib/select2/select2.css',
        'public/lib/oi.select/dist/select.min.css',
        'public/lib/ladda/dist/ladda-themeless.min.css',
        'public/lib/oi.select/dist/select.min.css',
        'public/lib/angular-motion/dist/angular-motion.css',
        'public/lib/alertify-js/build/css/alertify.min.css',
        'publiclib/alertifyjs/css/themes/default.css',
        'public/lib/angular-ui-select/dist/select.css',     // ,
        'public/lib/angular-on-screen-keyboard/dist/angular-on-screen-keyboard.min.css',
         'public/lib/angular-virtual-keyboard/release/angular-virtual-keyboard.css'
        // 'modules/customers/client/css/customers.css'
      ],
      js: [
        'public/plugins/jQuery/jQuery-2.1.4.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/dist/js/angular-locale_es-es.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/ng-table/dist/ng-table.js',
        'public/lib/alertify-js/build/alertify.min.js',
        'public/plugins/morris/morris.min.js',
        'public/plugins/sparkline/jquery.sparkline.min.js',
        'public/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
        'public/plugins/jvectormap/jquery-jvectormap-world-mill-en.js',
        'public/lib/angular-ui-mask/dist/mask.js',
        'public/plugins/knob/jquery.knob.js',
        'public/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js',
        'public/plugins/slimScroll/jquery.slimscroll.min.js',
        'public/plugins/fastclick/fastclick.min.js',
        'public/plugins/input-mask/jquery.inputmask.js',
        'public/plugins/input-mask/jquery.inputmask.extensions.js',
        'public/plugins/input-mask/jquery.inputmask.numeric.extensions.js',
        'public/plugins/input-mask/jquery.inputmask.date.extensions.js',
        'public/plugins/input-mask/jquery.inputmask.phone.extensions.js',
        'public/dist/js/app.min.js',
        'public/lib/angular-strap/dist/angular-strap.min.js',
        'public/lib/angular-strap/dist/angular-strap.tpl.min.js',
        'public/lib/bootbox/bootbox.js',
        'public/lib/ngBootbox/dist/ngBootbox.min.js',
        'public/lib/angular-ui-select/dist/select.js',
        'public/lib/oi.select/dist/select-tpls.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/angular-input-masks/angular-input-masks-standalone.min.js',
        'public/lib/angular-cache/dist/angular-cache.min.js',
        'public/lib/spin.js/spin.js',
        'public/lib/ladda/dist/ladda.min.js',
        'public/lib/angular-ladda/dist/angular-ladda.min.js',
        'public/lib/angularUtils-pagination/dirPagination.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/moment/min/moment-with-locales.min.js',
        'public/lib/angular-spinner/angular-spinner.min.js',
        'socket.io/socket.io.js',
        'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
        'public/lib/angular-scroll-glue/src/scrollglue.js',
        'public/lib/angular-on-screen-keyboard/dist/angular-on-screen-keyboard.min.js',
        'public/lib/angular-virtual-keyboard/release/angular-virtual-keyboard.min.js'
        // 'public/dist/js/pages/dashboard.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
       'modules/*/client/css/*.css'
    ],
    less: [
       'modules/*/client/less/*.less'
    ],
    sass: [
       'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js',
      'modules/*/client/filter/*.js'
    ],
    views: ['modules/*/client/views/**/*.html']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
