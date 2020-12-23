(function (module) {
    mifosX.controllers = _.extend(module, {
        withdrawFromFacilityAccountController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope,dateFilter, Upload,localStorageService) {
            scope.theclientId = localStorageService.getFromLocalStorage('clientId');
            scope.first = {};
            scope.first.date = new Date();
            scope.first.transactionDate = new Date ();

            resourceFactory.lineFacilityContractResource.getLineContract({clientId:scope.theclientId,facilityId:routeParams.id},function (data) {
                console.log(data);
                scope.lineContract = data;
            });
            resourceFactory.clientResource.get({clientId:  scope.theclientId}, function (data) {
                scope.client = data;
                scope.isClosedClient = scope.client.status.value === 'Closed';

                console.log(scope.client);
            });
            scope.chargeTypes = [
                {"id":"1","name":"SMS Balance Enquiry"},
                {"id":"2","name":"ATM Balance Enquiry"},
                {"id":"3","name":"ATM Balance Enquiry - Agent Bank"},
                {"id":"4","name":"ATM Cash Withdrawal"},
                {"id":"5","name":"ATM Cash Withdrawal - Agent Bank"},
                {"id":"6","name":"POS Purchase"},
                {"id":"7","name":"POS Purchase with Cashback"},
                {"id":"8","name":"SMS Transaction Notification"},
                {"id":"9","name":"Emergency Cash Advance"},
                {"id":"10","name":"Emergency Card Replacement/Cash Advance"},
                {"id":"11","name":"Cashout"},
                {"id":"12","name":"Card Order"},
                {"id":"13","name":"Card Delivery"},
                {"id":"14","name":"Card Load"},
                {"id":"15","name":"Monthly Active Card"},
                {"id":"16","name":"Monthly Inactive Card"},
                {"id":"17","name":"Non-participating Merchant Fee"},
                {"id":"18","name":"Deposit"},
                {"id":"19","name":"Card Initiation"},
                {"id":"20","name":"Card Reinitiation"},
                {"id":"21","name":"Replacement Card"},
                {"id":"22","name":"Reissue Fee"},
                {"id":"23","name":"SMS PIN Change Fee"},
                {"id":"24","name":"Card To Profile Transfer Fee"},
                {"id":"25","name":"Transfer Fee"}
            ];
            
            scope.cancelWithdrawal = function () {
                location.path('/viewLineFacilityContract/'+ routeParams.id);
            }
        }
    });
    mifosX.ng.application.controller('withdrawFromFacilityAccountController', ['$scope','$routeParams', 'ResourceFactory', '$location',
        'API_VERSION', '$rootScope','dateFilter', 'Upload','localStorageService', mifosX.controllers.withdrawFromFacilityAccountController]).run(function ($log) {
        $log.info("withdrawFromFacilityAccountController initialized");
    });
}(mifosX.controllers || {}));