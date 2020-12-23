(function (module) {
    mifosX.controllers = _.extend(module, {
        OfficeTypesController: function (scope, resourceFactory, location) {
            scope.officeTypes = [];
            scope.paymentTypes = [];
            scope.formData = {};

            scope.routeTo = function (id) {
                location.path('/viewofficetype/' + id);
            };


            resourceFactory.officeTypeResource.getAllOfficeTypes({}, function (data) {
                scope.officeTypes = data;
            });


        }
    });
    mifosX.ng.application.controller('OfficeTypesController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.OfficeTypesController]).run(function ($log) {
        $log.info("OfficeTypesController initialized");
    });
}(mifosX.controllers || {}));