(function (module) {
    mifosX.controllers = _.extend(module, {
        UpdateSavingsProductController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.loanOfficers = [];
            scope.formData = {};
            scope.staffData = {};
            scope.accountNo = routeParams.id;

            resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
            });
            

            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.accountNo);
            };

            scope.submit = function () {
                scope.staffData.staffId = scope.formData.fieldOfficerId;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.savingsResource.update({accountId: routeParams.id, command:'updatesavingsproduct'}, this.formData, function (data) {
                    location.path('/viewsavingaccount/' + scope.accountNo);
                });

            };

        }
    });
    mifosX.ng.application.controller('UpdateSavingsProductController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.UpdateSavingsProductController]).run(function ($log) {
        $log.info("UpdateSavingsProductController initialized");
    });
}(mifosX.controllers || {}));

