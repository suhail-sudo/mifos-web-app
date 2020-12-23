(function (module) {
    mifosX.controllers = _.extend(module, {
        EditKycCategoryController: function (scope, resourceFactory, location, $routeParams, dateFilter) {
        
        resourceFactory.kycCategoryResource.get({categoryId: $routeParams.id, template: 'true'}, function (data) {
        	scope.availableKycEvidences = data.availableKycEvidences;
        	scope.availableLoanProducts = data.availableLoanProducts;
        	scope.availableSavingsProducts = data.availableSavingsProducts;
        	for(var i in scope.availableLoanProducts) {
        		for(var j in data.loanProducts) {
        			if(scope.availableLoanProducts[i].id == data.loanProducts[j].id)
        				scope.availableLoanProducts[i].ticked = true;
        		}
        	}
        	for(var i in scope.availableSavingsProducts) {
        		for(var j in data.savingsProducts) {
        			if(scope.availableSavingsProducts[i].id == data.savingsProducts[j].id)
        				scope.availableSavingsProducts[i].ticked = true;
        		}
        	}
        	for(var i in scope.availableKycEvidences) {
        		for(var j in data.kycEvidences) {
        			if(scope.availableKycEvidences[i].id == data.kycEvidences[j].id)
        				scope.availableKycEvidences[i].ticked = true;
        		}
        	}
        	scope.formData = {
                    name: data.name,
                    isActive: data.isActive,
                    description: data.description,
                    maxAccountBalance: data.maxBalance
            };
            
            
        });
        
        scope.submit = function () {
        		scope.formData.requiredKycEvidences = [];
        		angular.forEach( scope.requiredKycEvidences, function( value, key ) {  
            		scope.formData.requiredKycEvidences.push(value.id);  
				});
				
				scope.formData.allowedLendingProducts = [];
				angular.forEach( scope.allowedLendingProducts, function( value, key ) {    
				    scope.formData.allowedLendingProducts.push(value.id);    
				});
				
				scope.formData.allowedSavingsProducts = [];
				angular.forEach( scope.allowedSavingsProducts, function( value, key ) {    
				    scope.formData.allowedSavingsProducts.push(value.id);     
				});
        	
                resourceFactory.kycCategoryResource.update({categoryId: $routeParams.id}, this.formData, function (data) {
                    location.path('/viewkyccategory/' + data.resourceId);
                });
        };
        
        }
    });
    mifosX.ng.application.controller('EditKycCategoryController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditKycCategoryController]).run(function ($log) {
        $log.info("EditKycCategoryController initialized");
    });
}(mifosX.controllers || {}));