(function (module) {
    mifosX.controllers = _.extend(module, {
        RuleConfigMasterController: function (scope, resourceFactory, location, notificationService, $route) {
            scope.params = [];
            scope.category = "";
            scope.categoryId = "";
            scope.entity = "";
            scope.entityId = "";
            scope.entities = ["Office", "Client"];
            scope.allSavedRules = [];
            scope.categoryValues = {};
            resourceFactory.ruleMasterResource.getAll({"category" : "master"}, function (data) {
                _.each(data, function(ruleParam){
                    var rule = {};
                    rule.key = ruleParam.paramDesc;
                    rule.name = ruleParam.paramName;
                    rule.values = [];
                    scope.params.push(rule);
                    if(ruleParam.elementType = "combo"){
                        var combo =  JSON.parse(ruleParam.paramComboJson);
                        if(combo.values){
                            rule.values = JSON.parse(combo.values);
                            if(rule.name == 'PaymentType'){
                                rule.values =  _.sortBy(rule.values, 'hierarchyString');
                                _.each(rule.values, function(v){
                                    v.name = v.hierarchyString;
                                    scope.categoryValues[rule.name+"#"+v.id] = v.name;
                                })
                            }else{
                                _.each(rule.values, function(v){
                                    scope.categoryValues[rule.name+"#"+v.id] = v.name;
                                })
                            }
                        }
                    }
                })
            });

            resourceFactory.ruleConfigResource.getAll({"entityName" : "all"}, function (data) {
                scope.allSavedRules = data;
            });

            scope.loadSavedConfig = function(entity, category, categoryId){
                console.log(scope.categoryValues);
                location.path("/ruleconfig/" +entity + "/" + category + "/" + categoryId);
            }

            scope.loadConfig = function(){
                location.path("/ruleconfig/" +scope.entity + "/" + scope.category.name + "/" + scope.categoryId.id);
            }
            scope.loadDeafultConfig = function(){
                location.path("/ruleconfig/" +scope.entity + "/default/0" );
            }

            scope.reloadRules = function(){
                resourceFactory.ruleConfigResource.save({"entityName" : "reloadrules"}, function (data) {
                    notificationService.showSuccess("Rules reloaded successfully!");
                });
            }

            scope.deleteConfig = function(entity, category, categoryId){
                var rulesIn = [];
                resourceFactory.ruleMasterResource.getAll({}, function (data) {
                    scope.ruleMasterList = _.reject(data, function(rule){ return rule.category == "master"; });

                    resourceFactory.ruleConfigResource.getAll({"entityName" : entity, "entityId" : null,
                    "category":category, "categoryId": categoryId}, function (rules) {
                        _.each(rules, function(rule){
                            var ruleIn = {
                                category: rule.category,
                                categoryId: rule.categoryId,
                                entityName: rule.entityName,
                                id: rule.id,
                                paramName: rule.paramName,
                                value: -1
                               
                            }
                            _.each(scope.ruleMasterList, function(masterRule){
                                if(masterRule.paramName == rule.paramName) {
                                    ruleIn. masterParamId = masterRule.id;
                                    return false;
                                }
                            });
                            rulesIn.push(ruleIn);
                        });
                        resourceFactory.ruleConfigResource.save({}, rulesIn, function (resp) {
                            notificationService.showSuccess();
                            $route.reload();
                        });
                    });
                });
            }
        }
    }
);
mifosX.ng.application.controller('RuleConfigMasterController', ['$scope', 'ResourceFactory', '$location', 'NotificationService', '$route', mifosX.controllers.RuleConfigMasterController]).run(function ($log) {
    $log.info("RuleConfigMasterController initialized");
});
}(mifosX.controllers || {}));
