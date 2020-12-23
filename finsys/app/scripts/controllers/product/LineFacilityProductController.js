(function (module) {
    mifosX.controllers = _.extend(module, {
        LineFacilityProductController: function (scope, resourceFactory, location) {
            scope.products = [];

            scope.routeTo = function (id) {
                location.path('/viewlineFacilityproduct/' + id);
            };

            if (!scope.searchCriteria.loanP) {
                scope.searchCriteria.loanP = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.loanP || '';

            scope.onFilter = function () {
                scope.searchCriteria.loanP = scope.filterText;
                scope.saveSC();
            };

            scope.LoanProductsPerPage = 15;
            resourceFactory.getLineFacilityProductsResource.getLineFacilityProducts(function (data) {
                console.log('before log and initialise');
                console.log(data);
                scope.loanproducts = data;
                console.log('After log and initialise');
                console.log(scope.loanproducts);
            });
        }
    });
    mifosX.ng.application.controller('LineFacilityProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.LineFacilityProductController]).run(function ($log) {
        $log.info("LineFacilityProductController initialized");
    });
}(mifosX.controllers || {}));