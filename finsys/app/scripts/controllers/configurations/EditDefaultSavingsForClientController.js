(function (module) {
    mifosX.controllers = _.extend(module, {
        EditDefaultSavingsForClientController: function (scope, resourceFactory, routeParams, location) {
            scope.savingproducts =[];
            scope.configId = routeParams.configId;
            scope.formData = {};
            scope.configName = "";
            resourceFactory.configurationResource.get({id: scope.configId}, function (data) {
                scope.formData.value = data.value*1;
                scope.configName = data.name;
            });

            resourceFactory.savingProductResource.getAllSavingProducts(function (data) {
                scope.savingproducts = _.reject(data, function(product){
                    return product.isPrimary == true;
                }); 
            });

            scope.cancel = function () {
                location.path('/global');
            };


            scope.submit = function () {
                console.log(this.formData);
                resourceFactory.configurationResource.update({resourceType: 'configurations', id: scope.configId}, this.formData, function (data) {
                    location.path('/global');
                });
            };

        }
    });
    mifosX.ng.application.controller('EditDefaultSavingsForClientController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.EditDefaultSavingsForClientController]).run(function ($log) {
        $log.info("EditDefaultSavingsForClientController initialized");
    });
}(mifosX.controllers || {}));


