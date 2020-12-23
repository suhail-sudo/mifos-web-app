(function (module) {
    mifosX.controllers = _.extend(module, {
        EditConfigurationController: function (scope, resourceFactory, routeParams, location) {
            scope.configName = "";
            scope.configId = routeParams.configId;
            resourceFactory.configurationResource.get({id: scope.configId}, function (data) {
                scope.formData = {value: data.value};
                scope.configName = data.name;
                scope.type = data.type;
                scope.comboValues = data.comboJson ? JSON.parse(data.comboJson) :  {};
            });
            scope.cancel = function () {
                location.path('/global');
            };


            scope.submit = function () {
                resourceFactory.configurationResource.update({resourceType: 'configurations', id: scope.configId}, this.formData, function (data) {
                    location.path('/global');
                });
            };

        }
    });
    mifosX.ng.application.controller('EditConfigurationController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.EditConfigurationController]).run(function ($log) {
        $log.info("EditConfigurationController initialized");
    });
}(mifosX.controllers || {}));
