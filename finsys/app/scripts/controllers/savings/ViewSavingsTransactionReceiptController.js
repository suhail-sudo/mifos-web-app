(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingsTransactionReceiptController: function (scope, resourceFactory, routeParams, location) {
            scope.savingsId = routeParams.savingsId;
            scope.txnId = routeParams.txnId;

            resourceFactory.savingsTrxnReceiptResource.get({  savingsId: scope.savingsId, transactionId: scope.txnId}, function (data) {
                scope.txnReceipt = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewSavingsTransactionReceiptController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.ViewSavingsTransactionReceiptController]).run(function ($log) {
        $log.info("ViewSavingsTransactionReceiptController initialized");
    });
}(mifosX.controllers || {}));
    