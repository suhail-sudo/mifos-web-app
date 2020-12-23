(function (module){
	mifosX.controllers = _.extend(module, {
		ViewCurrencyController: function( scope, $routeParams, resourceFactory, location, route) {
			
			
			scope.formData = {};
			scope.formData.denominations = [];
			scope.currency = [];
			scope.hideview = false;
			scope.denomValue = "";
			resourceFactory.currencyConfigResource.getOne({code: $routeParams.code}, function (data){
				scope.currency = data;
				scope.formData.denominations = data.denominations;
				scope.selectedCurrencyOptions = data.selectedCurrencyOptions;
			} );
			
			scope.addDenomination = function(){
				scope.customErrors = [];                     // prints error if we try to add denomValue which is already present
				if(!isNaN(scope.denomValue) && scope.denomValue != ""){
					scope.denomValue *=1;                    // converting type of denomValue from string to number to compare for duplicate values using its index
					if(scope.denomValue != null && scope.formData.denominations.indexOf(scope.denomValue) == -1){
						scope.formData.denominations.push(scope.denomValue);
						scope.denomValue = null;
					}
					else{
						scope.customErrors.push({
							"msg" : "Denomination already exist!"
						})	
					}
				}
			}
			scope.deleteDenomination = function(index){
				scope.formData.denominations.splice(index, 1);  
			}
			scope.submit = function(){
				var requestBody = {};
				requestBody.denominations = scope.formData.denominations.join();
				resourceFactory.currencyConfigResource.update({code: $routeParams.code},requestBody, function(data){
					route.reload();
				} );
			}
			
			scope.cancel = function(){
				route.reload();
			}
		}
	});
	mifosX.ng.application.controller('ViewCurrencyController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', mifosX.controllers.ViewCurrencyController]).
	run(function($log) { $log.info("ViewCurrencyController initialized");
	}); 
}(mifosX.controllers || {}));