(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSingleCourierTransactionController: function (scope, routeParams, route, location, resourceFactory) {
        	resourceFactory.courierTransactionsResource.get({courierId: routeParams.courierId}, {id: routeParams.id}, function (data) {
           	  scope.transaction = data;
           	  scope.courierId = routeParams.courierId;
           	  scope.formData = {};
           	  scope.linkedOffices = data.linkedOffices;
           	  scope.hideview = false;
           	  if(scope.transaction.isInsuranceCoverProvided){
           		  scope.insurance = 'Yes';
           	  }
           	  else if(!scope.transaction.isInsuranceCoverProvided){
           		  scope.insurance = 'No';
           	  }
           	});
        	resourceFactory.couriersTransactionsTemplateResource.get({courierId: routeParams.courierId, courierTransactionId:routeParams.id}, function (data) {
           	  scope.statusOptions = data.statusOptions
           	});
        	scope.submit = function () {
        		this.formData.locale = scope.optlang.code;
                resourceFactory.courierTransactionsResource.put({id:routeParams.id, courierId:routeParams.courierId}, this.formData, function (data) {
                    route.reload();
                });

            };
            

            scope.cancel = function () {
                route.reload();
            }
          }
    });
    mifosX.ng.application.controller('ViewSingleCourierTransactionController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewSingleCourierTransactionController]).run(function ($log) {
        $log.info("ViewSingleCourierTransactionController initialized");
    });
}(mifosX.controllers || {}));