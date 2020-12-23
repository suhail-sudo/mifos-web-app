(function (module) {
    mifosX.controllers = _.extend(module, {
        KycCategoryController: function (scope, resourceFactory, location) {

            scope.routeTo = function (id) {
                location.path('/viewkyccategory/' + id);
            };


            resourceFactory.kycCategoryResource.getAllCategories({}, function (data) {
                scope.kycCategories = data;
            });


        }
    });
    mifosX.ng.application.controller('KycCategoryController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.KycCategoryController]).run(function ($log) {
        $log.info("KycCategoryController initialized");
    });
}(mifosX.controllers || {}));