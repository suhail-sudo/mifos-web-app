(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewOfficeTypeController: function (scope, routeParams, resourceFactory, $uibModal, location, route) {

			var idToNodeMap = {};
            var officeTypePaymentTypeIdArray = [];
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
            
            resourceFactory.officeTypeResource.getOne({officeTypeId: routeParams.id, template: 'true'}, function (data) {
                scope.officeType = data;
                scope.configuredPaymentTypes = data.configuredPaymentTypes;
                scope.paymentTypes = scope.deepCopy(scope.officeType.paymentTypes);
                 
                for (var i in scope.paymentTypes) {
                    scope.paymentTypes[i].children = [];
                    idToNodeMap[scope.paymentTypes[i].id] = scope.paymentTypes[i];
                }
                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                scope.paymentTypes.sort(sortByParentId);

                var root = [];
                for (var i = 0; i < scope.paymentTypes.length; i++) {
                    var currentObj = scope.paymentTypes[i];
                    if (currentObj.children) {
                        currentObj.collapsed = "true";
                    }
                    for(var j = 0; j < scope.configuredPaymentTypes.length; j++) {
                    	if(scope.configuredPaymentTypes[j].id == currentObj.id)
                    		currentObj.selectedCheckBox = true;
                    }
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                    }
                }
                scope.treedata = root; 
            });
            
            
            
            scope.officeTypeApplyToPaymentType = function (node) {
                if (node.selectedCheckBox) {
                    recurOfficeTypeApplyToPaymentType(node);
                    officeTypePaymentTypeIdArray = _.uniq(officeTypePaymentTypeIdArray);
                } else {
                    node.selectedCheckBox = false;
                    recurRemoveOfficeTypeAppliedPaymentType(node);

                }
            };

            function recurOfficeTypeApplyToPaymentType(node) {
                node.selectedCheckBox = true;
                officeTypePaymentTypeIdArray.push(node.id);
                if (node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        node.children[i].selectedCheckBox = true;
                        officeTypePaymentTypeIdArray.push(node.children[i].id);
                        if (node.children[i].children.length > 0) {
                            recurOfficeTypeApplyToPaymentType(node.children[i]);
                        }
                    }
                }
            }

            function recurRemoveOfficeTypeAppliedPaymentType(node) {
                officeTypePaymentTypeIdArray = _.without(officeTypePaymentTypeIdArray, node.id);
                if (node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        node.children[i].selectedCheckBox = false;
                        officeTypePaymentTypeIdArray = _.without(officeTypePaymentTypeIdArray, node.children[i].id);
                        if (node.children[i].children.length > 0) {
                            recurRemoveOfficeTypeAppliedPaymentType(node.children[i]);
                        }
                    }
                }
            } 

            scope.deleteOfficeType = function () {
                $uibModal.open({
                    templateUrl: 'deleteOfficeType.html',
                    controller: deleteOfficeTypeCtrl
                });
            };

            var deleteOfficeTypeCtrl = function ($scope, $uibModalInstance) {
                $scope.activate = function () {
                    resourceFactory.officeTypeResource.delete({officeTypeId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('activate');
                        location.path('officetypes');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewOfficeTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$uibModal', '$location', '$route', mifosX.controllers.ViewOfficeTypeController]).run(function ($log) {
        $log.info("ViewOfficeTypeController initialized");
    });
}(mifosX.controllers || {}));

