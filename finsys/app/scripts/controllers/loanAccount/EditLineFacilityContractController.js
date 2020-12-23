(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLineFacilityContractController: function (scope, routeParams, resourceFactory,localStorageService, location, dateFilter, uiConfigService, WizardHandler) {
            scope.theclientId = localStorageService.getFromLocalStorage('clientId');
            scope.date = {};
            scope.charges = [];
            scope.facilityId = routeParams.id;
            resourceFactory.getLineFacilityProductsResource.getLineFacilityProducts(function (data) {
                scope.lineproducts = data;
                console.log(scope.lineproducts);
            });
            resourceFactory.lineFacilityContractResource.getLineContract({clientId:scope.theclientId,facilityId:routeParams.id},function (data) {
                console.log(data);
                scope.lineContract = data;

                resourceFactory.searchLineFacilityProductResource.searchLineFacilityProduct({id: data.lineFacilityProduct.id}, function (data) {
                    scope.product = data;

                    scope.minDate = scope.product.productStartDate;
                    scope.maxDate = scope.product.productCloseDate;

                    scope.repaymentCycle = scope.product.billingCycle.code;
                    scope.limitAvailability = scope.product.limitFacilityAvailability.value;
                    scope.shortName = scope.product.shortName;
                });
                scope.formData ={
                    productId:scope.lineContract.lineFacilityProduct.id,
                    currencyCode:scope.lineContract.currencyCode,
                    maxFacilityAmount:scope.lineContract.approvedFacilityAmount,
                    maxDailyUtilisation:scope.lineContract.maxDailyUtilization,
                    tenorMinimum:scope.lineContract.facilityTenor,
                    repaymentCycle:scope.lineContract.interestMoratoriumCycle,
                    moratoriumPrincipal:scope.lineContract.principalMoratoriumCycle,
                    annualInterestRate:scope.lineContract.interestMoratoriumCycle,
                    accountId:scope.lineContract.accountNumber,
                };
                scope.charges = scope.lineContract.charges;
                scope.charges = scope.lineContract.charges;
                scope.transDetails =scope.lineContract.facilityTransactions;

                scope.productType = scope.lineContract.facilityType;
                scope.date.first = new Date(scope.lineContract.facilityAvailDate);
                scope.date.second = new Date(scope.lineContract.facilityExpiryDate);
            });


            resourceFactory.lineFacilityAccountsTempResource.getAccounts({clientId: scope.theclientId},function (data) {
                console.log(data);
                scope.clientAccounts = data;
            });

            scope.chargeSelected = function (chargeId) {
                if(chargeId){
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        //to charge select box empty
                        scope.chargeId = '';
                        scope.penalityId = '';
                    });
                }
            };

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            };
            resourceFactory.clientResource.get({clientId:  scope.theclientId}, function (data) {
                scope.client = data;
                scope.isClosedClient = scope.client.status.value === 'Closed';

                console.log(scope.client);
                scope.clientFName = scope.client.firstname;
                scope.clientLName = scope.client.lastname;
            });
            scope.transactionSort = {
                column: 'id',
                descending: true
            };

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
            }
            scope.submit = function () {
                delete scope.formData.charges;
                delete scope.formData.collateral;

                if (scope.charges.length > 0) {
                    scope.formData.charges = [];
                    for (var i in scope.charges) {
                        scope.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount, dueDate: dateFilter(scope.charges[i].dueDate, scope.df) });
                    }
                }


                var firstDate = dateFilter(scope.date.first, scope.df);
                var secondDate = dateFilter(scope.date.second, scope.df);

                scope.contractData = {
                    locale : scope.optlang.code,
                    dateFormat : scope.df,
                    approvedFacilityAmount:this.formData.maxFacilityAmount,
                    facilityTenor: this.formData.tenorMinimum,
                    clientId: scope.theclientId,
                    productId:scope.product.id,
                    annualNominalInterestRate:this.formData.annualInterestRate,
                    facilityAvailableDate: firstDate,
                    facilityExpiryDate: secondDate,
                    maxDailyUtilisation: this.formData.maxDailyUtilisation,
                    accountLinkedTo:this.formData.accountId,
                }

                console.log(scope.contractData);
                resourceFactory.updateLineFacilityContractResource.update({id:routeParams.id},scope.contractData, function (data) {
                    console.log(data);
                    location.path('/viewLineFacilityContract/'+ routeParams.id);
                });
            };

        }
    });
    mifosX.ng.application.controller('EditLineFacilityContractController', ['$scope', '$routeParams', 'ResourceFactory','localStorageService', '$location', 'dateFilter', 'UIConfigService', 'WizardHandler', mifosX.controllers.EditLineFacilityContractController]).run(function ($log) {
        $log.info("EditLineFacilityContractController initialized");
    });
}(mifosX.controllers || {}));
