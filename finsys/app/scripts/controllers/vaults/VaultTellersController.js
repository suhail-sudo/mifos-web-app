(function (module) {
    mifosX.controllers = _.extend(module, {
        VaultTellersController: function (scope, routeParams, resourceFactory, location) {

            scope.tellers = [];
            scope.tellersList = [];
            scope.findTellers = [];
            var idToNodeMap = {};
            scope.officeId = routeParams.officeId;
            scope.TellersPerPage = 15;
            resourceFactory.tellerResource.getAllTellers(function (data) {
                scope.tellers = _.filter(data, function(office){ return office.officeId == scope.officeId; });
            });
            
            scope.routeTo = function (id) {
                location.path('/viewtellers/' + id);
            };
            
            scope.routeToEdit = function (id) {
                location.path('/viewtellers/' + id);
            };

            scope.routeToCashiers = function (id) {
                location.path('/tellers/' + id + '/cashiers/');
            };

            scope.routeToDelete = function(id){
                    resourceFactory.tellerResource.delete({
                        tellerId: id},function(data){
                        resourceFactory.tellerResource.getAllTellers(function (data) {
                            scope.tellers = data;
                        });
                        location.path('/tellers');
                    });
            };

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }



        }
    });
    mifosX.ng.application.controller('VaultTellersController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.VaultTellersController]).run(function ($log) {
        $log.info("VaultTellersController initialized");
    });
}(mifosX.controllers || {}));
