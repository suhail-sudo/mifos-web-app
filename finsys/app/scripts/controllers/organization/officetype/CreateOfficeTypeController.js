(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOfficeTypeController: function (scope, resourceFactory, location, dateFilter) {
            scope.paymentTypes = [];
            scope.formData = {};
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


            resourceFactory.officeTypeTemplateResource.template(function (data) {
                scope.paymentTypes = scope.deepCopy(data);
                 
                for (var i in data) {
                    data[i].children = [];
                    idToNodeMap[data[i].id] = data[i];
                }
                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                data.sort(sortByParentId);

                var root = [];
                for (var i = 0; i < data.length; i++) {
                    var currentObj = data[i];
                    if (currentObj.children) {
                        currentObj.collapsed = "true";
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

            scope.submit = function () {
                
                    scope.formData.paymentTypes = [];
                    scope.formData.allowedPaymentTypes = 0;
                    for (var i in officeTypePaymentTypeIdArray) {
                        scope.formData.paymentTypes.push(officeTypePaymentTypeIdArray[i]);
                        scope.formData.allowedPaymentTypes = 2;
                    }
                    if(scope.formData.paymentTypes.length == scope.paymentTypes.length)
                    	scope.formData.allowedPaymentTypes = 1;
                    resourceFactory.officeTypeResource.save(scope.formData, function (data) {
                        location.path('/officetypes');
                    });
                } 
        }
    });
    mifosX.ng.application.controller('CreateOfficeTypeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateOfficeTypeController]).run(function ($log) {
        $log.info("CreateOfficeTypeController initialized");
    });
}(mifosX.controllers || {}));

