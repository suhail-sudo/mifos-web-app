(function (module) {
    mifosX.controllers = _.extend(module, {
        RuleConfigController: function (scope, routeParams, resourceFactory, location, notificationService) {
            scope.category = routeParams.category? routeParams.category : "default";
            scope.categoryId = routeParams.categoryId ? routeParams.categoryId  : 0;
            scope.entity = routeParams.entity ? routeParams.entity  : "default";
            scope.ruleMasterList = [];
            resourceFactory.ruleMasterResource.getAll({}, function (data) {
                scope.ruleMasterList = _.reject(data, function(rule){ return rule.category == "master"; });
                resourceFactory.ruleConfigResource.getAll({"entityName" : scope.entity, "entityId" : null,
                "category":scope.category, "categoryId": scope.categoryId}, function (rules) {
                    _.each(scope.ruleMasterList, function(masterRule){
                        masterRule.masterId = masterRule.id;
                        _.each(rules, function(rule){
                            if(masterRule.paramName == rule.paramName) {
                                masterRule.value = rule.value;
                                masterRule.id = rule.id;
                            }
                        });
                        if(masterRule.value == undefined) {
                            masterRule.value = masterRule.defaultValue;
                            delete masterRule.id;
                        }
                    });
                   
                });
            });
            scope.saveRules = function(){
                scope.customError = [];
                var ruleList = [];
                _.each(scope.ruleMasterList, function(ruleParam){
                    var rule = {};
                    if(ruleParam.id != undefined) 
                        rule.id = ruleParam.id;
                    rule.paramName = ruleParam.paramName;
                    rule.value = ruleParam.value;
                    rule.entityId = null;
                    rule.entityName = scope.entity;
                    rule.category = scope.category;
                    rule.categoryId = scope.categoryId;
                    rule.masterParamId =  ruleParam.masterId;
                    if(ruleParam.value == "" || ruleParam.value == undefined){
                        scope.customError.push({"msg":"Invalid value for rule: "+ ruleParam.paramDesc})
                    }else{
                        ruleList.push(rule);
                    }
                });
                if(ruleList.length != scope.ruleMasterList.length)  throw "Invalid value";
                
                resourceFactory.ruleConfigResource.save({}, ruleList, function (resp) {
                    notificationService.showSuccess();
                    location.path("/ruleconfig/");
                });
            }
        }
    });
    mifosX.ng.application.controller('RuleConfigController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'NotificationService', mifosX.controllers.RuleConfigController]).run(function ($log) {
        $log.info("RuleConfigController initialized");
    });
}(mifosX.controllers || {}));
