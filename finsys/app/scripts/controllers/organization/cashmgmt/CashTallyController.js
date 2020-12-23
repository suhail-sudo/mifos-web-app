(function (module) {
    mifosX.controllers = _.extend(module, {
        CashTallyController: function (scope, resourceFactory, routeParams, location) {
            scope.formData = {};
            scope.cashTallyEntries = [];
            resourceFactory.currencyConfigResource.get({code: "INR"}, function (data) {
                 for( var i = 0; i < data.denominations.length ; i++){
                     var cashTally = {};
                     cashTally.denomination = data.denominations[i];
                     scope.cashTallyEntries.push(cashTally);
                 }
            });
        }
    });
    mifosX.ng.application.controller('CashTallyController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.CashTallyController]).run(function ($log) {
        $log.info("CashTallyController initialized");
    });
}(mifosX.controllers || {}));
