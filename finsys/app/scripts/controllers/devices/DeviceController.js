(function (module) {
    mifosX.controllers = _.extend(module, {
        DeviceController: function (scope, resourceFactory, route, location, dateFilter) {
                scope.devices = [];
                scope.routeTo = function (id) {
                    location.path('/viewdevice/' + id);
                };

                if (!scope.searchCriteria.devices) {
                    scope.searchCriteria.devices = null;
                    scope.saveSC();
                }
                scope.filterText = scope.searchCriteria.devices || '';

                scope.onFilter = function () {
                    scope.searchCriteria.devices = scope.filterText;
                    scope.saveSC();
                };


                scope.devicesPerPage =15;
                scope.getResultsPage = function (pageNumber) {
                    var items = resourceFactory.userDeviceResource.get({
                        o: ((pageNumber - 1) * scope.devicesPerPage),
                        l: scope.devicesPerPage
                    }, function (data) {
                        scope.devices = data.pageItems;
                    });
                };
                scope.initPage = function () {

                    var items = resourceFactory.userDeviceResource.get({
                        o: 0,
                        l: scope.devicesPerPage
                    }, function (data) {
                        scope.totalDevices = data.totalFilteredRecords;
                        scope.devices = data.pageItems;
                    });
                }
                scope.initPage();

                
            }
    });



    mifosX.ng.application.controller('DeviceController', ['$scope', 'ResourceFactory', '$route', '$location', 'dateFilter', mifosX.controllers.DeviceController]).run(function ($log) {
        $log.info("DeviceController initialized");
    });
}(mifosX.controllers || {}));