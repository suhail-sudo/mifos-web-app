(function (module) {
    mifosX.controllers = _.extend(module, {
       AddVaultTransactionController: function (scope, localStorageService, resourceFactory, $uibModal, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams) {
    	   scope.formData = {};
    	   scope.vaultId = routeParams.vaultId;
      	   console.log(scope.vaultId);
    	   resourceFactory.vaultsTransactionsTemplateResource.template({vaultId: routeParams.vaultId}, function (data) {
         	  scope.statusOptions = data.statusOptions	
         	  scope.currencyOptions = data.currencyOptions;
         	  scope.officeOptions = data.officeOptions;
         	});
           scope.submit = function () {
        	   var reqDate = dateFilter(scope.formData.transactionDate, scope.df);
               this.formData.dateFormat = scope.df;
               this.formData.transactionDate = reqDate;
               if(scope.formData.transferFromId == scope.formData.transferToId){
            	   scope.errorMsg = "Office From and Office To cannot be same";
            	   
               }
               scope.formData.locale = scope.optlang.code;
               resourceFactory.courierTransactionsResource.save({courierId: routeParams.courierId}, this.formData, function (data) {
                   location.path('/couriers/' + data.resourceId + '/viewcouriertransactions/');
        	   });

           };
       }
    });
    mifosX.ng.application.controller('AddVaultTransactionController', ['$scope', 'localStorageService', 'ResourceFactory', '$uibModal', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', mifosX.controllers.AddVaultTransactionController]).run(function ($log) {
        $log.info("AddVaultTransactionController initialized");
    });
}(mifosX.controllers || {}))