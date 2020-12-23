(function (module) {
    mifosX.controllers = _.extend(module, {
        CardSettlementController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope, Upload,localStorageService) {
            scope.userData = localStorageService.getFromLocalStorage('userData');
        }
    });
    mifosX.ng.application.controller('CardSettlementController', ['$scope','$routeParams', 'ResourceFactory', '$location',
        'API_VERSION', '$rootScope', 'Upload','localStorageService', mifosX.controllers.CardSettlementController]).run(function ($log) {
        $log.info("CardSettlementController initialized");
    });
}(mifosX.controllers || {}));