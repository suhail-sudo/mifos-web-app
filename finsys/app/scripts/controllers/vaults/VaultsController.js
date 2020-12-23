
(function (module) {
    mifosX.controllers = _.extend(module, {
        VaultsController: function (scope, resourceFactory, location) {

            scope.vaults = [];
            resourceFactory.vaultsResource.getAll(function (data) {
                scope.vaults = data;
            });
            scope.routeTo = function (id) {
                location.path('/viewvault/' + id);
            };

            scope.routeToEdit = function (id) {
                location.path('/viewvault/' + id);
            };

        }
    });
    mifosX.ng.application.controller('VaultsController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.VaultsController]).run(function ($log) {
        $log.info("VaultsController initialized");
    });
}(mifosX.controllers || {}));
