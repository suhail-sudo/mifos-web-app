(function (module) {
    mifosX.controllers = _.extend(module, {
       SendCashController: function (scope, localStorageService, resourceFactory, $uibModal, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams) {
    	   scope.formData = {};
    	   scope.vaultId = routeParams.vaultId;
    	   scope.officeId = routeParams.officeId;
    	   scope.formData.transactionDate = new Date();
    	   scope.formData.sendCash = true;
    	   resourceFactory.vaultsTransactionsTemplateResource.template({vaultId: routeParams.vaultId}, function (data) {
         	  scope.statusOptions = data.statusOptions	
         	  scope.currencyOptions = data.currencyOptions;
         	  scope.officeOptions = data.officeOptions;
         	});
           scope.submit = function () {
        	   var reqDate = dateFilter(scope.formData.transactionDate, scope.df);
               this.formData.dateFormat = scope.df;
               this.formData.transactionDate = reqDate;
               scope.formData.locale = scope.optlang.code;
               resourceFactory.vaultTransactionsResource.save({vaultId: routeParams.vaultId}, this.formData, function (data) {
                   location.path('/vaults/' + data.resourceId + '/vaulttransactions/');
        	   });

           };
       }
    });
    mifosX.ng.application.controller('SendCashController', ['$scope', 'localStorageService', 'ResourceFactory', '$uibModal', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', mifosX.controllers.SendCashController]).run(function ($log) {
        $log.info("SendCashController initialized");
    });
}(mifosX.controllers || {}))