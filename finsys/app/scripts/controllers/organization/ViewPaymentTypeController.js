(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewPaymentTypeController: function (scope, routeParams, resourceFactory, location, $uibModal, route) {
            scope.paymentTypes = [];
            scope.formData = [];
            scope.isTreeView = false;
            var idToNodeMap = {};
            
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
            resourceFactory.configurationResourceByName.get({configName: 'enable-tran-auth-for-payment-type-empty'}, function (data){
                scope.config = data;
            });
            scope.enable = function (id, name) {
                var temp = {'enabled': 'true'};
                resourceFactory.configurationResource.update({'id': id}, temp, function (data) {
                    route.reload();
                });
            };
            scope.disable = function (id, name) {
                var temp = {'enabled': 'false'};
                resourceFactory.configurationResource.update({'id': id}, temp, function (data) {
                    route.reload();
                });
            };
            
            resourceFactory.paymentTypeResource.getAll( function (data) {
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
                console.log(root);
                scope.treedata = root; 
            });

            scope.showEdit = function(id){
                location.path('/editPaymentType/' + id);
            }

           var PaymentTypeDeleteCtrl = function ($scope, $uibModalInstance,paymentTypeId) {
               $scope.delete = function () {
                   resourceFactory.paymentTypeResource.delete({paymentTypeId: paymentTypeId}, {}, function (data) {
                       $uibModalInstance.close('delete');
                       route.reload();
                   });
               };
               $scope.cancel = function () {
                   $uibModalInstance.dismiss('cancel');
               };
           }
                scope.deletePaymentType = function (id) {
                    $uibModal.open({
                        templateUrl: 'deletePaymentType.html',
                        controller: PaymentTypeDeleteCtrl,
                        resolve: {
                            paymentTypeId: function () {
                                return id;
                            }
                        }
                    });
                };

                }
    });
    mifosX.ng.application.controller('ViewPaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', mifosX.controllers.ViewPaymentTypeController]).run(function ($log) {
        $log.info("ViewPaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
