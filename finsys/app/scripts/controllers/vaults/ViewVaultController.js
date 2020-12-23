(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewVaultController: function (scope, routeParams, route, location, resourceFactory) {
            resourceFactory.vaultsResource.get({vaultId: routeParams.id}, function (data) {
                scope.vault = data;
                scope.loggedInUserOfficeId = data.officeId;
            })
        }

    });
    mifosX.ng.application.controller('ViewVaultController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewVaultController]).run(function ($log) {
        $log.info("ViewVaultController initialized");
    });
}(mifosX.controllers || {}));