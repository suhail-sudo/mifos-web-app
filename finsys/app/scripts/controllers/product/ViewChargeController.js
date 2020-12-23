(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewChargeController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            scope.charge = [];
            scope.choice = 0;
            scope.paymentTypeCharges = [];
            scope.paymentTypes = [];
            scope.paymentTypeOptions = [];
            scope.chargeCalculationTypeOptions = [];
            scope.paymentType = '';
            
            resourceFactory.chargeResource.getCharge({chargeId: routeParams.id, template: true}, function (data) {
                scope.charge = data;
                scope.paymentTypeCharges = data.paymentTypeCharges;
                scope.paymentTypeOptions = data.paymentTypeOptions;
                scope.accountingRule = data.accountingRule;
                scope.chargeCalculationType = data.chargeCalculationType;
                scope.chargeCalculationTypeOptions = data.savingsChargeCalculationTypeOptions;
                scope.populatePaymentTypes = function () {
                    _.each(scope.paymentTypeCharges, function (paymentTypeCharge) {
                        scope.paymentType = {
                            name: paymentTypeCharge.paymentType.name
                        };
                    });
                }
                scope.populatePaymentTypes();
            });

            scope.deleteCharge = function () {
                $uibModal.open({
                    templateUrl: 'deletech.html',
                    controller: ChDeleteCtrl
                });
            };
            var ChDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.chargeResource.delete({chargeId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/charges');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewChargeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewChargeController]).run(function ($log) {
        $log.info("ViewChargeController initialized");
    });
}(mifosX.controllers || {}));
