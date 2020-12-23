(function (module) {
    mifosX.controllers = _.extend(module, {
        ConsumeLimitsController: function (scope, routeParams, resourceFactory, location, $rootScope) {
            scope.params = {};
            scope.consumeLimits = [];
            scope.entityName = routeParams.entityName;
            resourceFactory.consumeLimitsResource.getAll({"entityName" :  scope.entityName,"entityId": $rootScope.officeId },function(limits){
                resourceFactory.ruleMasterResource.getAll({"category" : "master"}, function (data) {
                    _.find(data, function(ruleParam){ 
                        if(ruleParam.elementType = "combo"){
                            var combo =  JSON.parse(ruleParam.paramComboJson);
                            if(combo.values){
                                scope.params[ruleParam.paramName]  = JSON.parse(combo.values);
                            }
                        }
                    });
                    var i = 0;
                    _.each(limits, function(limit){
                        if(limit.category){
                            var entityJson = _.find(scope.params[limit.category], function(param){
                                return param.id == limit.categoryId;
                            });
                            limit.categoryName = entityJson.name;
                            //limit.entityName = "label.heading.consume.limits." + entityName;
                        }
                        scope.consumeLimits.push(limit);
                    });

                    
                });
            });

            scope.loadConfig = function(){
                location.path("/ruleconfig/"+ scope.entity.key + "/" + scope.entityId.id);
            }
        }
    }
);
mifosX.ng.application.controller('ConsumeLimitsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$rootScope', mifosX.controllers.ConsumeLimitsController]).run(function ($log) {
    $log.info("ConsumeLimitsController initialized");
});
}(mifosX.controllers || {}));
