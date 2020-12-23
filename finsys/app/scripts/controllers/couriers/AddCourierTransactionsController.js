(function (module) {
    mifosX.controllers = _.extend(module, {
       AddCourierTransactionsController: function (scope, localStorageService, resourceFactory, $uibModal, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams) {
    	   scope.formData = {};
    	   scope.formData.isInsuranceCoverProvided = false;
    	   scope.formData.transactionDate = new Date();
    	   resourceFactory.couriersTransactionsTemplateResource.get({courierId: routeParams.courierId}, function (data) {
         	  scope.linkedOffices = data.linkedOffices;
         	  scope.courierId = routeParams.courierId;
         	  scope.statusOptions = data.statusOptions
         	  scope.currencyOptions = data.currencyOptions;
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
    mifosX.ng.application.controller('AddCourierTransactionsController', ['$scope', 'localStorageService', 'ResourceFactory', '$uibModal', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', mifosX.controllers.AddCourierTransactionsController]).run(function ($log) {
        $log.info("AddCourierTransactionsController initialized");
    });
}(mifosX.controllers || {}))