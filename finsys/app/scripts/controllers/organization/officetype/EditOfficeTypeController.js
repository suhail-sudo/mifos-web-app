(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOfficeTypeController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            var idToNodeMap = {};
            scope.officeTypePaymentTypeIdArray = [];
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
                scope.formData.name = data.name;
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
                    	if(scope.configuredPaymentTypes[j].id == currentObj.id) {
                    		currentObj.selectedCheckBox = true;
                    		scope.officeTypePaymentTypeIdArray.push(currentObj.id);
                		}
                    }
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                    }
                }
                scope.treedata = root; 
                console.log(scope.treedata);
            });
            
            
            
            scope.officeTypeApplyToPaymentType = function (node) {
                if (node.selectedCheckBox) {
                    recurOfficeTypeApplyToPaymentType(node);
                    scope.officeTypePaymentTypeIdArray = _.uniq(scope.officeTypePaymentTypeIdArray);
                } else {
                    node.selectedCheckBox = false;
                    recurRemoveOfficeTypeAppliedPaymentType(node);

                }
            };

            function recurOfficeTypeApplyToPaymentType(node) {
                node.selectedCheckBox = true;
                scope.officeTypePaymentTypeIdArray.push(node.id);
                if (node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        node.children[i].selectedCheckBox = true;
                        scope.officeTypePaymentTypeIdArray.push(node.children[i].id);
                        if (node.children[i].children.length > 0) {
                            recurOfficeTypeApplyToPaymentType(node.children[i]);
                        }
                    }
                }
            }

            function recurRemoveOfficeTypeAppliedPaymentType(node) {
                scope.officeTypePaymentTypeIdArray = _.without(scope.officeTypePaymentTypeIdArray, node.id);
                if (node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        node.children[i].selectedCheckBox = false;
                        scope.officeTypePaymentTypeIdArray = _.without(scope.officeTypePaymentTypeIdArray, node.children[i].id);
                        if (node.children[i].children.length > 0) {
                            recurRemoveOfficeTypeAppliedPaymentType(node.children[i]);
                        }
                    }
                }
            } 

            scope.submit = function () {
               	scope.formData.paymentTypes = [];
                    scope.formData.allowedPaymentTypes = 0;
                    for (var i in scope.officeTypePaymentTypeIdArray) {
                        scope.formData.paymentTypes.push(scope.officeTypePaymentTypeIdArray[i]);
                        scope.formData.allowedPaymentTypes = 2;
                    }
                    if(scope.formData.paymentTypes.length == scope.paymentTypes.length)
                    	scope.formData.allowedPaymentTypes = 1;
                        scope.formData.locale = scope.optlang.code; 	
                resourceFactory.officeTypeResource.update({officeTypeId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewofficetype/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditOfficeTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditOfficeTypeController]).run(function ($log) {
        $log.info("EditOfficeTypeController initialized");
    });
}(mifosX.controllers || {}));
