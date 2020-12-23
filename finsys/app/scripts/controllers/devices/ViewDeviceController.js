(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewDeviceController: function (scope, routeParams, route, location, resourceFactory) {
              resourceFactory.userDeviceResource.get({deviceId: routeParams.id}, function (data) {
                  scope.device = data;  
              });


          }
    });
    mifosX.ng.application.controller('ViewDeviceController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewDeviceController]).run(function ($log) {
        $log.info("ViewDeviceController initialized");
    });
}(mifosX.controllers || {}));