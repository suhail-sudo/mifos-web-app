(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateKycCategoryController: function (scope, resourceFactory, location, dateFilter) {
            scope.formData = {};


            resourceFactory.kycCategoryTemplateResource.template(function (data) {
                scope.availableLoanProducts = data.availableLoanProducts;
                scope.availableKycEvidences = data.availableKycEvidences;
                scope.availableSavingsProducts = data.availableSavingsProducts;
            });
            
            scope.onReset = function() { 
            	scope.inputModel.forEach(item => item.ticked = false); 
            }

            scope.requiredKycEvidences = [];
            scope.allowedLendingProducts = [];
            scope.allowedSavingsProducts = [];
            scope.formData.requiredKycEvidences = [];
            scope.formData.allowedLendingProducts = [];
            scope.formData.allowedSavingsProducts = [];
            
            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
            
            	angular.forEach( scope.requiredKycEvidences, function( value, key ) {  
            		scope.formData.requiredKycEvidences.push(value.id);  
				});
				
				angular.forEach( scope.allowedLendingProducts, function( value, key ) {    
				    scope.formData.allowedLendingProducts.push(value.id);    
				});
				
				angular.forEach( scope.allowedSavingsProducts, function( value, key ) {    
				    scope.formData.allowedSavingsProducts.push(value.id);     
				});
                
                    resourceFactory.kycCategoryResource.save(scope.formData, function (data) {
                        location.path('/kyccategory');
                    });
                } 
        }
    });
    mifosX.ng.application.controller('CreateKycCategoryController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateKycCategoryController]).run(function ($log) {
        $log.info("CreateKycCategoryController initialized");
    });
}(mifosX.controllers || {}));

