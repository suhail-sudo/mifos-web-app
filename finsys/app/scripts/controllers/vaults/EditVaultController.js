(function (module) {
    mifosX.controllers = _.extend(module, {
       EditVaultController: function (scope, localStorageService, resourceFactory, location, http, API_VERSION, Upload, $rootScope, routeParams) {
           scope.formData = {};
           resourceFactory.vaultsTemplateResource.get(function (data) {
            scope.assetGLMappingOptions = data.assetGLMappingOptions;
            scope.offices = data.officeOptions;
            });

           resourceFactory.vaultsResource.get({vaultId: routeParams.id}, function (data) {
                scope.vault = data;
                scope.officeName = data.officeName;
                scope.formData.officeId = data.officeId;
                scope.formData.assetGLMappingId = scope.vault.assetGlMappingId;
                scope.formData.maximumCashLimit = data.maximumCashLimit;
            });
        
            
           scope.submit = function () {
               resourceFactory.vaultsResource.update({vaultId: routeParams.id}, this.formData, function (data) {
                   location.path('/viewvault/' + data.resourceId);
               });
           };
           

       }
    });
    mifosX.ng.application.controller('EditVaultController', ['$scope', 'localStorageService', 'ResourceFactory', '$location', '$http', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', mifosX.controllers.EditVaultController]).run(function ($log) {
        $log.info("EditVaultController initialized");
    });
}(mifosX.controllers || {}));