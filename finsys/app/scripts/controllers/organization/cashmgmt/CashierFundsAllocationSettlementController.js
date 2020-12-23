(function (module) {
    mifosX.controllers = _.extend(module, {
        CashierFundsAllocationSettlementController: function (scope, routeParams, route, location, dateFilter, resourceFactory) {
            scope.formData = {};
            scope.formData.txnDate = new Date();
            scope.settle = routeParams.settle;
            scope.totalAmount = 0;
            scope.cashTally = {};
            resourceFactory.cashierTxnTemplateResource.get({tellerId: routeParams.tellerId, cashierId: routeParams.cashierId}, function (data) {
                scope.cashierTxnTemplate = data;
                scope.differenceReasonOptions = data.differenceReasonOptions;
                scope.formData.currencyCode = data.currencyOptions[0].code;
                if(scope.formData.currencyCode)
                    scope.loadCurrencyDenomination();
            });
            scope.tellersId=routeParams.tellerId;
            scope.ifAllocate = function(){
                if ( routeParams.action == 'allocate') {
                    return true;
                }
            };

            scope.ifSettle = function(){
                if ( routeParams.action == 'settle') {
                    return true;
                }
            };
            scope.sumCash = function(cashTallyDenomination){
                
                scope.totalAmount -= cashTallyDenomination.cash;
                scope.cashTally.suspectCash -= cashTallyDenomination.suspectCash;

                cashTallyDenomination.cash = cashTallyDenomination.denomination * ((cashTallyDenomination.numberOfLegitimateNotes?cashTallyDenomination.numberOfLegitimateNotes :0) 
                + (cashTallyDenomination.numberOfSuspectNotes?cashTallyDenomination.numberOfSuspectNotes:0));

                cashTallyDenomination.suspectCash = cashTallyDenomination.denomination * (cashTallyDenomination.numberOfSuspectNotes?cashTallyDenomination.numberOfSuspectNotes:0);
                if(isNaN(cashTallyDenomination.suspectCash))
                    cashTallyDenomination.suspectCash =0
                if(isNaN(cashTallyDenomination.cash))
                    cashTallyDenomination.cash =0;

                scope.totalAmount += cashTallyDenomination.cash;
                
                scope.formData.txnAmount = scope.totalAmount;
                scope.cashTally.actualCash = scope.totalAmount;
                scope.cashTally.diffCash = scope.cashTally.netCash - scope.cashTally.actualCash;
                scope.cashTally.suspectCash += cashTallyDenomination.suspectCash;
                
            }

            scope.loadCurrencyDenomination = function(){
                scope.cashTallyDenominations = [];
                if(scope.ifSettle()){
                    resourceFactory.currencyConfigResource.get({code: scope.formData.currencyCode}, function (data) {
                        for( var i = 0; i < data.denominations.length ; i++){
                            var cashTallyDenomination = {};
                            cashTallyDenomination.denomination = data.denominations[i];
                            cashTallyDenomination.cash = 0;
                            cashTallyDenomination.suspectCash = 0;
                            cashTallyDenomination.numberOfLegitimateNotes = 0;
                            cashTallyDenomination.numberOfSuspectNotes = 0;
                            cashTallyDenomination.locale = scope.optlang.code;
                            scope.cashTallyDenominations.push(cashTallyDenomination);
                        }
                        scope.cashTally.locale = scope.optlang.code;
                        scope.cashTally.actualCash = 0;
                        scope.cashTally.diffCash = 0;
                        scope.cashTally.suspectCash = 0;
                        resourceFactory.tellerCashierSummaryAndTxnsResource.getCashierSummaryAndTransactions({
                            tellerId: routeParams.tellerId,
                            cashierId: routeParams.cashierId,
                            currencyCode: scope.formData.currencyCode,
                            offset:0,
                            limit:1
                        }, function (data) {
                            scope.cashTally.netCash = data.netCash;
                        });

                    });
                    scope.isSettle = true;
                }
            }

           /* scope.cancel="#tellers";*/
            scope.allocate = function () {
                this.formData.locale = scope.optlang.code;
                var tDate = dateFilter(scope.formData.txnDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.txnDate = tDate;
                resourceFactory.tellerCashierTxnsAllocateResource.allocate(
                    {'tellerId': routeParams.tellerId, 'cashierId': routeParams.cashierId}, 
                    this.formData, function (data) {
                        location.path('tellers/' + routeParams.tellerId + '/cashiers/' + routeParams.cashierId + '/txns/' + scope.formData.currencyCode);
                });
            }; 

            scope.settle = function () {
                this.formData.locale = scope.optlang.code;
                var tDate = dateFilter(scope.formData.txnDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.txnDate = tDate;
                if(scope.cashTally && scope.ifSettle()){
                    this.formData.cashTally = scope.cashTally;
                    scope.cashTally.cashTallyDenominations = [];
                    for( var i = 0; i < scope.cashTallyDenominations.length ; i++){
                        if(scope.cashTallyDenominations[i].cash){
                            var cashTallyDenomination = JSON.clone(scope.cashTallyDenominations[i]);
                            delete cashTallyDenomination.suspectCash;
                            scope.cashTally.cashTallyDenominations.push(cashTallyDenomination);
                        }
                    }
                }
                resourceFactory.tellerCashierTxnsSettleResource.settle(
                    {'tellerId': routeParams.tellerId, 'cashierId': routeParams.cashierId}, 
                    this.formData, function (data) {
                        location.path('tellers/' + routeParams.tellerId + '/cashiers/' + routeParams.cashierId + '/txns/' + scope.formData.currencyCode);
                });
            }; 
        }
    });
    mifosX.ng.application.controller('CashierFundsAllocationSettlementController', ['$scope', '$routeParams', '$route', '$location', 'dateFilter', 'ResourceFactory', mifosX.controllers.CashierFundsAllocationSettlementController]).run(function ($log) {
        $log.info("CashierFundsAllocationSettlementController initialized");
    });
}(mifosX.controllers || {}));
