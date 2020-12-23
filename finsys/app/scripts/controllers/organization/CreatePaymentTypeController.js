(function (module) {
    mifosX.controllers = _.extend(module, {
        CreatePaymentTypeController: function (scope, routeParams, resourceFactory, location, $uibModal, route) {

            scope.formData = {};
            scope.isCashPayment =true;


			resourceFactory.paymentTypeTemplateResource.template(function (data) {
                scope.paymentTypes = data.allowedParents;
                scope.paymentTypeTranTypeOptions = data.paymentTypeTranTypeOptions;
            });
			
            scope.submit = function () {
                this.formData.isCashPayment = this.formData.isCashPayment || false;
                this.formData.locale =  scope.optlang.code;
                resourceFactory.paymentTypeResource.save(this.formData, function (data) {
                    location.path('/viewpaymenttype/');
                });
            };

        }
    });
    mifosX.ng.application.controller('CreatePaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', mifosX.controllers.CreatePaymentTypeController]).run(function ($log) {
        $log.info("CreatePaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
