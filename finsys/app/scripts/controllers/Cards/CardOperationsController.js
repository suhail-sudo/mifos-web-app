(function (module) {
    mifosX.controllers = _.extend(module, {
        CardOperationsController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope, Upload,localStorageService) {
            scope.userData = localStorageService.getFromLocalStorage('userData');
            scope.clients = [];
            scope.actualClients = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.showClosed = false;
            scope.routeTo = function (id) {
                //location.path('/viewclient/' + id);
                location.path('/cardOperations/' + id);
            };

            console.log('Client Card Ctrl');
            scope.clientsPerPage = 15;

            scope.getResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.clientsPerPage;
                    scope.clients = scope.actualClients.slice(startPosition, startPosition + scope.clientsPerPage);
                    return;
                }
                var items = resourceFactory.clientResource.getAllClients({
                    offset: ((pageNumber - 1) * scope.clientsPerPage),
                    limit: scope.clientsPerPage
                }, function (data) {
                    scope.clients = data.pageItems;
                });
                //console.log(scope.clients);
            }
            scope.initPage = function () {

                var items = resourceFactory.clientResource.getAllClients({
                    offset: 0,
                    limit: scope.clientsPerPage
                }, function (data) {
                    scope.totalClients = data.totalFilteredRecords;
                    scope.clients = data.pageItems;
                });
                //console.log(scope.clients);
            }
            scope.initPage();

            scope.search = function () {
                scope.actualClients = [];
                scope.searchResults = [];
                scope.filterText = "";
                var searchString = scope.searchText;
                searchString = searchString.replace(/(^"|"$)/g, '');
                var exactMatch=false;
                var n = searchString.localeCompare(scope.searchText);
                if(n!=0)
                {
                    exactMatch=true;
                }

                if(!scope.searchText){
                    scope.initPage();
                } else {
                    resourceFactory.globalSearch.search({query: searchString , resource: "clients,clientIdentifiers",exactMatch: exactMatch, getClientsOnly:true}, function (data) {
                        var arrayLength = data.length;
                        //console.log(data);
                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var client = {};
                            client.status = {};
                            client.subStatus = {};
                            client.status.value = result.entityStatus.value;
                            client.status.code  = result.entityStatus.code;
                            client.linkStatus = result.linkStatus;
                            if(result.entityType  == 'CLIENT'){
                                client.displayName = result.entityName;
                                client.accountNo = result.entityAccountNo;
                                client.id = result.entityId;
                                client.externalId = result.entityExternalId;
                                client.officeName = result.parentName;

                            }else if (result.entityType  == 'CLIENTIDENTIFIER'){
                                numberOfClients = numberOfClients + 1;
                                client.displayName = result.parentName;
                                client.id = result.parentId;
                                client.externalId = result.parentExternalId;

                            }
                            scope.actualClients.push(client);
                        }
                        var numberOfClients = scope.actualClients.length;
                        scope.totalClients = numberOfClients;
                        scope.clients = scope.actualClients.slice(0, scope.clientsPerPage);
                    });
                }
            }
        }
    });
    mifosX.ng.application.controller('CardOperationsController', ['$scope','$routeParams', 'ResourceFactory', '$location',
        'API_VERSION', '$rootScope', 'Upload','localStorageService', mifosX.controllers.CardOperationsController]).run(function ($log) {
        $log.info("CardOperationsController initialized");
    });
}(mifosX.controllers || {}));