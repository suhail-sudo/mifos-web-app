(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPaymentTypeController: function (scope, routeParams, resourceFactory, location, $uibModal, route) {
            /*scope.formData = {};*/
            resourceFactory.paymentTypeResource.get({paymentTypeId: routeParams.id}, function (data) {
                scope.formData = {
                    name: data.name,
                    description: data.description,
                    isCashPayment: data.isCashPayment,
                    position : data.position,
                    label: data.label,
                    isActive: data.isActive,
                    showClient: data.showClient,
                    needsSrn: data.needsSrn,
                    needsBillingMonth: data.needsBillingMonth,
                    isCategory: data.isCategory,
                    isServiceProvider: data.isServiceProvider,
                    isService: data.isService,
                    parentId: data.parentId ,
                    tranTypeId : data.tranType ? data.tranType.id : null,
                    isTranAuthEnabled : data.isTranAuthEnabled
                };
                scope.paymentTypes = data.allowedParents;
                scope.paymentTypeTranTypeOptions = data.paymentTypeTranTypeOptions;
            });

            scope.submit = function () {
                this.formData.isCashPayment = this.formData.isCashPayment || false;
                this.formData.locale =  scope.optlang.code;
                if(!this.formData.tranTypeId) delete this.formData.tranTypeId;  
                resourceFactory.paymentTypeResource.update({paymentTypeId: routeParams.id},this.formData, function (data) {
                    location.path('/viewpaymenttype/');
                });
            };

        }
    });
    mifosX.ng.application.controller('EditPaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', mifosX.controllers.EditPaymentTypeController]).run(function ($log) {
        $log.info("EditPaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
