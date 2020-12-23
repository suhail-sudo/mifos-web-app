(function (module) {
     mifosX.controllers = _.extend(module, {
         ViewCourierTransactionsController: function (scope, routeParams, paginatorService, route, location, resourceFactory) 
         {
        	 scope.transactionhistory = [];
        	 var fetchFunction = function (offset, limit, callback) {
                 resourceFactory.courierTransactionsResource.getTransactionHistory({courierId: routeParams.courierId, offset: offset, limit: limit}, callback);
             };
             scope.transactionhistory = paginatorService.paginate(fetchFunction, 5);

        	 
        	 scope.transactions = [];
        	 scope.courierId = routeParams.courierId;
        	 scope.routeTo = function (id) {
                 location.path('couriers/' + scope.courierId + '/viewsinglecouriertransaction/' + id);
             };
         	/* resourceFactory.courierTransactionsResource.getAll({courierId: routeParams.courierId}, function (data) {
             	  scope.transactions = data.pageItems;
             	  scope.linkedOffices = data.linkedOffices;
             });*/
         }
     });
     mifosX.ng.application.controller('ViewCourierTransactionsController', ['$scope', '$routeParams', 'PaginatorService', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewCourierTransactionsController]).run(function ($log) {
         $log.info("ViewCourierTransactionsController initialized");
     });
 }(mifosX.controllers || {}));