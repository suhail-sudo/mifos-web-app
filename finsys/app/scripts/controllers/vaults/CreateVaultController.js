(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateVaultController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            resourceFactory.vaultsTemplateResource.get(function (data) {
                scope.assetGLMappingOptions = data.assetGLMappingOptions;
                scope.offices = data.officeOptions;
            });

            scope.submit = function () {
                resourceFactory.vaultsResource.save(this.formData, function (data) {
                    location.path('/viewvault/' + data.resourceId);

                });
            };
        }
    });
    mifosX.ng.application.controller('CreateVaultController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateVaultController]).run(function ($log) {
        $log.info("CreateVaultController initialized");
    });
}(mifosX.controllers || {}));
