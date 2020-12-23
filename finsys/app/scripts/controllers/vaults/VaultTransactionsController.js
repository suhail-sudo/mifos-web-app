(function (module) {
     mifosX.controllers = _.extend(module, {
         VaultTransactionsController: function (scope, routeParams, paginatorService, route, location, resourceFactory) 
         {
        	 scope.transactionhistory = [];
        	 var fetchFunction = function (offset, limit, callback) {
                 resourceFactory.vaultTransactionsResource.getAll({vaultId: routeParams.id, vaultTxnId: routeParams.vaultTxnId, offset: offset, limit: limit}, callback);
             };
             scope.transactionhistory = paginatorService.paginate(fetchFunction, 5);

        	 scope.transactions = [];
        	 scope.vaultId = routeParams.id;
        	 scope.routeTo = function (id) {
                 location.path('vaults/' + scope.vaultId + '/viewsinglevaulttransaction/' + id);
             };
         	/*resourceFactory.vaultTransactionsResource.getAll({vaultId: routeParams.id}, function (data) {
             	  scope.transactions = data.pageItems;
             });*/
         }
     });
     mifosX.ng.application.controller('VaultTransactionsController', ['$scope', '$routeParams', 'PaginatorService', '$route', '$location', 'ResourceFactory', mifosX.controllers.VaultTransactionsController]).run(function ($log) {
         $log.info("VaultTransactionsController initialized");
     });
 }(mifosX.controllers || {}));