(function (module) {
    mifosX.controllers = _.extend(module, {
        RuleMakerController: function (scope, resourceFactory, route, notificationService) {
            scope.params = [];
            scope.params.push({key:"default", name:"default" , values : [{id:0, name:"default",position: 0, active: true, mandatory: false}]})
            scope.category = "";
            scope.categoryId = "";
            scope.entity = "";
            scope.entityId = "";
            scope.entities = ["Office", "Client"];
            scope.allSavedRules = [];
            scope.operands = [];
            scope.categoryValues = {};
            scope.constructedJson = "{}";
            scope.rules = "[]";

            scope.constructedJsonLoader = function(_editor){
                _editor.setSize(500, 250);
            }

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

            resourceFactory.ruleConfigResource.getAll({"entityName" : "operands"}, function (data) {
                scope.operands = data;
            });

            resourceFactory.ruleConfigResource.getAll({"entityName" : "limitRules"}, function (data) {
                if(data.length >0)
                    scope.rules = JSON.stringify(data, null, "\t");
            });
            scope.construct = function(){
                try{
                    var json = JSON.parse(scope.constructedJson);
                    json.name = json.name ? json.name :"";
                    json.errorMsg = json.errorMsg ? json.errorMsg : "";
                    json.enabled = json.enabled == undefined ? true : json.enabled ;
                    json.entity = scope.entity ? scope.entity :"";
                    json.category = scope.category&&scope.category.name  ? scope.category.name : "";
                    json.categoryId =  scope.categoryId&&(scope.categoryId.id || scope.categoryId.id ==0) ? scope.categoryId.id : "";
                    json.condition = json.condition ? json.condition :"";
                    var operand = scope.operand ? " " + scope.operand + " "  : "";
                    scope.operand = undefined;
                    json.condition += operand;
                    json.condition = json.condition.trim();
                    scope.constructedJson = JSON.stringify(json, null, "\t");
                    return json;
                }catch (e){
                    console.log(e);
                    notificationService.showError("Check the Json syntax.");
                }
            }
            scope.construct();

            scope.resetRule = function(){
                scope.entity = undefined;
                scope.category = undefined;
                scope.categoryId = undefined;
                scope.operand = undefined;
                var json = scope.construct();
                json.name = "";
                json.errorMsg = "";
                json.enabled = true;
                json.condition = "";
                scope.constructedJson = JSON.stringify(json, null, "\t");
            }

            scope.addRule = function(){
                try{
                    var jsonArray = JSON.parse(scope.rules);
                    var json = JSON.parse(scope.constructedJson);
                    if( json.name && json.errorMsg && json.entity && json.category && (json.categoryId || json.categoryId  == 0) && json.condition){
                        jsonArray.push(json);
                        scope.resetRule();
                    } else
                        notificationService.showError("Rule is has empty values");
                    scope.rules =  JSON.stringify(jsonArray, null, "\t");
                }catch (e){
                    console.log(e);
                    notificationService.showError("Check the Json syntax.");
                }
            }

            scope.reloadRules = function(){
                resourceFactory.ruleConfigResource.save({"entityName" : "reloadrules"}, function (data) {
                    notificationService.showSuccess("Rules reloaded successfully!");
                });
            }
            scope.pushRules = function(){
                var jsonArray = [];
                try{
                    jsonArray = JSON.parse(scope.rules);
                }catch (e){
                    console.log(e);
                    notificationService.showError("Check the Json syntax.");
                }
                if(jsonArray.length >= 0){
                    resourceFactory.ruleConfigResource.save({"entityName" : "limitRules"}, {"rulesJson" : scope.rules}, function (data) {
                        scope.reloadRules();
                        route.reload();
                    });
                }else{
                    notificationService.showError("Rule is has empty values");
                }
            }
        }
    }
);
mifosX.ng.application.controller('RuleMakerController', ['$scope', 'ResourceFactory', '$route', 'NotificationService', mifosX.controllers.RuleMakerController]).run(function ($log) {
    $log.info("RuleMakerController initialized");
});
}(mifosX.controllers || {}));
