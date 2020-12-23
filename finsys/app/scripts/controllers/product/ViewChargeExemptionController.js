(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewChargeExemptionController: function (scope, routeParams, resourceFactory, location, route) {
            scope.chargeId =  routeParams.chargeId;
            scope.formData = {};
            scope.template = {};
            scope.chargeExemption={};
            scope.viewMode = false;
            resourceFactory.chargeExemptionResource.get({chargeId: scope.chargeId, chargeExemptionId: "template"}, function (template) {
                scope.template = template;
            });
            resourceFactory.chargeExemptionResource.get({chargeId: scope.chargeId}, function (data) {
                console.log(data);
                scope.chargeExemption = data;
                scope.formData = JSON.clone(scope.chargeExemption);
                scope.formData.status = scope.formData.status.id;
                if(scope.chargeExemption.id){
                    scope.viewMode = true;
                }
            });

            scope.edit = function(){
                scope.isEditMode = true;
                scope.viewMode =false;
            }
            scope.reload = function(){
                if(scope.isEditMode)
                    route.reload();
                else
                    location.path('/viewcharge/' + scope.chargeId);
            }

            scope.submit = function(){
                scope.formData.locale = scope.optlang.code;

                if(scope.isEditMode){
                    delete scope.formData.id;
                    delete scope.formData.chargeId;
                    resourceFactory.chargeExemptionResource.put({chargeId: scope.chargeId, chargeExemptionId :scope.chargeExemption.id}, scope.formData, function (data) {
                        route.reload();
                    }); 
                }else{
                    resourceFactory.chargeExemptionResource.save({chargeId: scope.chargeId}, scope.formData, function (data) {
                        route.reload();
                    });
                }
            }

        }
    });
    mifosX.ng.application.controller('ViewChargeExemptionController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', mifosX.controllers.ViewChargeExemptionController]).run(function ($log) {
        $log.info("ViewChargeExemptionController initialized");
    });
}(mifosX.controllers || {}));
