(function (module) {
    mifosX.controllers = _.extend(module, {
        CourierController: function (scope, resourceFactory, aginatorService, location) {
                scope.routeTo = function (courierId) {
                    location.path('/viewcourier/' + courierId);
                };
                if (!scope.searchCriteria.Couriers) {
                    scope.searchCriteria.Couriers = null;
                    scope.saveSC();
                }
                scope.filterText = scope.searchCriteria.Couriers || '';

                scope.onFilter = function () {
                    scope.searchCriteria.Couriers = scope.filterText;
                    scope.saveSC();
                };

                scope.couriersPerPage =15;
                scope.getResultsPage = function (pageNumber) {
                    var items = resourceFactory.couriersResource.get({
                        o: ((pageNumber - 1) * scope.couriersPerPage),
                        l: scope.couriersPerPage
                    }, function (data) {
                        scope.couriers = data.pageItems;
                    });
                };
                scope.initPage = function () {

                    var items = resourceFactory.couriersResource.get({
                        o: 0,
                        l: scope.couriersPerPage
                    }, function (data) {
                        scope.totalCouriers = data.totalFilteredRecords;
                        scope.couriers = data.pageItems;
                    });
                }
                scope.initPage();
            }
    });



    mifosX.ng.application.controller('CourierController', ['$scope', 'ResourceFactory', 'PaginatorService', '$location', mifosX.controllers.CourierController]).run(function ($log) {
        $log.info("CourierController initialized");
    });
}(mifosX.controllers || {}));