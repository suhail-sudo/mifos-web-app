(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewChargeSlabsController: function (scope, routeParams, resourceFactory, location, route) {
            scope.chargeId =  routeParams.chargeId;
            scope.chargeSlabs = [];
            scope.formDate ={};
            scope.isCreate = true;
            scope.newChargeSlabs = [];
            scope.basedOn = "";
            scope.chargeTypeOptions = [{id : "percentage", code : "label.heading.percentage"}, {id: "flat", code : "label.heading.flat"}]
            scope.basedOnOptions = [{id:"amount", code :"label.input.charge.slab.based.on.amount"}, {id:"count_d", code :"label.input.charge.slab.based.on.count_d"},
                        {id:"count_m", code :"label.input.charge.slab.based.on.count_m"}, {id:"count_q", code :"label.input.charge.slab.based.on.count_q"},
                        {id:"count_y", code :"label.input.charge.slab.based.on.count_y"}];
            resourceFactory.chargeSlabResource.getAllChargeSlabs({chargeId: scope.chargeId}, function (data) {
                console.log(data);
                scope.chargeSlabs = data;
                if(scope.chargeSlabs.length > 0){
                    scope.basedOn = scope.chargeSlabs[0].basedOn;
                }
            });
            scope.addNewChargeSlabs = function(){
                scope.newChargeSlabs.push({"basedOn" : scope.basedOn});
            }
            scope.removeThisSlab =  function(index){
                scope.newChargeSlabs.splice(index, 1);
            }
            scope.editChargeSlab =  function(slab){
                scope.slabForEdit ={};
                scope.slabForEdit.id = slab.id;
                scope.slabForEdit.from = slab.from;
                scope.slabForEdit.to = slab.to;
                scope.slabForEdit.consumelimits = slab.consumeLimits;
                scope.slabForEdit.basedOn = slab.basedOn;
                if(slab.percentage){
                    scope.slabForEdit.chargeType = "percentage";
                    scope.slabForEdit.amount = slab.percentage;
                }else{
                    scope.slabForEdit.chargeType = "flat";
                    scope.slabForEdit.amount = slab.flat;
                }
                
                slab.isEdit = true;
            }
            scope.cancelEdit = function(slab){
                delete scope.slabForEdit;
                slab.isEdit = false;
            }
            scope.submitForUpdate = function(){
                if(scope.slabForEdit){
                    var slabId = scope.slabForEdit.id;
                    var dataIn = JSON.clone(scope.slabForEdit);
                    dataIn.locale = scope.optlang.code;
                    if(dataIn.chargeType == "percentage")
                        dataIn.percentage = dataIn.amount;
                    else
                        dataIn.flat = dataIn.amount;
                    delete dataIn.chargeType;
                    delete dataIn.amount;
                    delete dataIn.id;

                    resourceFactory.chargeSlabResource.put({chargeId: scope.chargeId, chargeSlabId:slabId}, dataIn, function (data) {
                        route.reload();
                    });
                }
            }

            scope.deleteChargeSlab =  function(slabId){
                resourceFactory.chargeSlabResource.delete({chargeId: scope.chargeId, chargeSlabId:slabId}, function (data) {
                    scope.chargeSlabs = _.reject(scope.chargeSlabs, function(slab){ return slab.id === slabId; });
                });
            }

            scope.submitForCreate = function(){
                var dataIn = JSON.clone(scope.newChargeSlabs);
                _.each(dataIn, function(eachSlab){
                    if(eachSlab.chargeType == "percentage")
                        eachSlab.percentage = eachSlab.amount;
                    else
                        eachSlab.flat = eachSlab.amount;
                    eachSlab.locale = scope.optlang.code;
                    delete eachSlab.chargeType;
                    delete eachSlab.amount;
                });
                resourceFactory.chargeSlabResource.save({chargeId: scope.chargeId}, dataIn, function (data) {
                    route.reload();
                });
            }
        }
    });
    mifosX.ng.application.controller('ViewChargeSlabsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', mifosX.controllers.ViewChargeSlabsController]).run(function ($log) {
        $log.info("ViewChargeSlabsController initialized");
    });
}(mifosX.controllers || {}));
