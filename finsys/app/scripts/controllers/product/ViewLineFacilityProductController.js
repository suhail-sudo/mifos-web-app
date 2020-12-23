(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLineFacilityProductController: function (scope, routeParams, location, anchorScroll, resourceFactory) {
            scope.loanproduct = [];
            scope.isAccountingEnabled = false;
            scope.isAccrualAccountingEnabled = false;

            resourceFactory.searchLineFacilityProductResource.searchLineFacilityProduct({id: routeParams.id}, function (data) {
                scope.loanproduct = data;
                console.log(scope.loanproduct);
                /*if (data.accountingRule.id == 2 || data.accountingRule.id == 3 || data.accountingRule.id == 4) {
                    scope.isAccountingEnabled = true;
                }

                if (data.accountingRule.id == 3 || data.accountingRule.id == 4) {
                    scope.isAccrualAccountingEnabled = true;
                }
                if(scope.loanproduct.allowAttributeOverrides != null){
                    scope.amortization = scope.loanproduct.allowAttributeOverrides.amortizationType;
                    scope.arrearsTolerance = scope.loanproduct.allowAttributeOverrides.inArrearsTolerance;
                    scope.graceOnArrearsAging = scope.loanproduct.allowAttributeOverrides.graceOnArrearsAgeing;
                    scope.interestCalcPeriod = scope.loanproduct.allowAttributeOverrides.interestCalculationPeriodType;
                    scope.interestMethod = scope.loanproduct.allowAttributeOverrides.interestType;
                    scope.graceOnPrincipalAndInterest = scope.loanproduct.allowAttributeOverrides.graceOnPrincipalAndInterestPayment;
                    scope.repaymentFrequency = scope.loanproduct.allowAttributeOverrides.repaymentEvery;
                    scope.transactionProcessingStrategy = scope.loanproduct.allowAttributeOverrides.transactionProcessingStrategyId;
                }
                if(scope.amortization || scope.arrearsTolerance || scope.graceOnArrearsAging ||
                    scope.interestCalcPeriod || scope.interestMethod || scope.graceOnPrincipalAndInterest ||
                    scope.repaymentFrequency || scope.transactionProcessingStrategy == true){
                    scope.allowAttributeConfiguration = true;
                }
                else{
                    scope.allowAttributeConfiguration = false;
                } */
            });

            scope.scrollto = function (link) {
                location.hash(link);
                anchorScroll();
            };
        }
    });
    mifosX.ng.application.controller('ViewLineFacilityProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', mifosX.controllers.ViewLineFacilityProductController]).run(function ($log) {
        $log.info("ViewLineFacilityProductController initialized");
    });
}(mifosX.controllers || {}));