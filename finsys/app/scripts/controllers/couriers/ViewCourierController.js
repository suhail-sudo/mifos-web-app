(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCourierController: function (scope, routeParams, route, location, resourceFactory) {
        	resourceFactory.couriersResource.get({courierId: routeParams.courierId}, function (data) {
            	  scope.courier = data;
            	  scope.linkedOffices = data.linkedOffices;
            	});
        	scope.routeToDelete = function(courierId){
                resourceFactory.couriersResource.delete({courierId: courierId},function(data){
                    resourceFactory.couriersResource.getAll(function (data) {
                        scope.couriers = data;
                    });
                    location.path('/couriers');
                });
        	};
          }
    });
    mifosX.ng.application.controller('ViewCourierController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewCourierController]).run(function ($log) {
        $log.info("ViewCourierController initialized");
    });
}(mifosX.controllers || {}));

