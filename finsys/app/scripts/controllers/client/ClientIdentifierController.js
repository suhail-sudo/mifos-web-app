(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientIdentifierController: function (scope, routeParams, location, resourceFactory) {
            scope.clientId = routeParams.clientId;
            scope.formData = {};
            scope.documenttypes = [];
            scope.kycTypes = ["Proof of Identity", "Proof of Address", "Proof of Fund"];
            scope.statusTypes = [{
                id: 1,
                label: 'Active'
            }, {
                id: 2,
                label: 'Inactive',
            }];
            
            scope.setKycType = function() {
            	if(scope.kycType == undefined)
            		return;
            	if(scope.kycType == "Proof of Identity")
            		scope.documenttypes = scope.poi;
            	else if(scope.kycType == "Proof of Address")
            		scope.documenttypes = scope.poa;
        		else if(scope.kycType == "Proof of Fund")
        			scope.documenttypes = scope.pof;
            };
            resourceFactory.clientIdenfierTemplateResource.get({clientId: routeParams.clientId}, function (data) {
                scope.poi = data.poi;
                scope.poa = data.poa;
                scope.pof = data.pof;
            });

            scope.submit = function () {
                resourceFactory.clientIdenfierResource.save({clientId: scope.clientId}, this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                });
            };

        }
    });
    mifosX.ng.application.controller('ClientIdentifierController', ['$scope', '$routeParams', '$location', 'ResourceFactory', mifosX.controllers.ClientIdentifierController]).run(function ($log) {
        $log.info("ClientIdentifierController initialized");
    });
}(mifosX.controllers || {}));

