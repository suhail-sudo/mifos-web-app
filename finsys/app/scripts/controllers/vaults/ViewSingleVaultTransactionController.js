(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSingleVaultTransactionController: function (scope, routeParams, route, location, resourceFactory) {
        	resourceFactory.vaultTransactionsResource.get({vaultId: routeParams.vaultId}, {id: routeParams.id}, function (data) {
           	  scope.transaction = data;
	          if(scope.transaction.status.value == "Received"){
	        	  scope.hideChangeStatusButton = true;
	          }
	          else{
	        	  scope.hideChangeStatusButton = false;
	          }
	          if(scope.transaction.status.value == "Sent"){
	    			scope.statusLabel = "Received";
	    		}
	    		else if(scope.transaction.status.value == "Requested"){
	    			scope.statusLabel = "Sent";
	    		}
           	  scope.vaultId = routeParams.vaultId;
           	  scope.formData = {};
           	});
        	

        	
        	/*scope.routeToDelete = function(id){
                resourceFactory.vaultTransactionsResource.delete({id: routeParams.id},function(data){
                    resourceFactory.vaultTransactionsResource.getAll(function (data) {
                        scope.transactions = data;
                    });
                    location.path('/vaults/' + vaultId + '/viewvaulttransactions/');
                });
        	};
        	*/
        	
        	resourceFactory.vaultsTransactionsTemplateResource.get({vaultId: routeParams.vaultId}, function (data) {
           	  scope.statusOptions = data.statusOptions;
           	  for(var i=0; i<scope.statusOptions.length; i++){
	       		  if(scope.statusOptions[i].value == "Sent"){
	       			  scope.sentId = scope.statusOptions[i].id;
	       		  }
				  if(scope.statusOptions[i].value == "Received"){
						scope.receiveId = scope.statusOptions[i].id;
				  }
	          }
           	});
        	scope.submit = function () {
        		this.formData.locale = scope.optlang.code;
        		if(scope.transaction.status.value == "Sent"){
        			this.formData.status = scope.receiveId;
        		}
        		else if(scope.transaction.status.value == "Requested"){
        			this.formData.status = scope.sentId;
        		}
    			resourceFactory.vaultTransactionsResource.put({id:routeParams.id, vaultId:routeParams.vaultId}, this.formData, function (data) {
                    route.reload();
                });
            };
            

            scope.cancel = function () {
                route.reload();
            }
          }
    });
    mifosX.ng.application.controller('ViewSingleVaultTransactionController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewSingleVaultTransactionController]).run(function ($log) {
        $log.info("ViewSingleVaultTransactionController initialized");
    });
}(mifosX.controllers || {}));