(function (module) {
    mifosX.controllers = _.extend(module, {
        NewLineFacilityContractController: function (scope, routeParams, resourceFactory, location, dateFilter, uiConfigService, WizardHandler) {
            scope.previewRepayment = false;
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.loandetails = {};
            scope.chargeFormData = {}; //For charges
            scope.collateralFormData = {}; //For collaterals
            scope.inparams = {resourceType: 'template', activeOnly: 'true'};
            scope.date = {};
            scope.formDat = {};
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.loanApp = "LoanApp";
            scope.customSteps = [];
            scope.tempDataTables = [];
            scope.disabled = true;

            scope.date.first = new Date();
            scope.date.second = new Date();

            resourceFactory.clientResource.get({clientId: routeParams.clientId}, function (data) {
                scope.client = data;
                scope.displayName= data.displayName;

                if (data.displayName){
                    var arrSplit = data.displayName.split(' ');
                    scope.clientFName = arrSplit[0];
                    scope.clientMName = '';
                    scope.clientLName = arrSplit[1];
                }else{
                    scope.clientFName = scope.client.firstname;
                    scope.clientMName = scope.client.middlename;
                    scope.clientLName = scope.client.lastname;
                }
            });

            resourceFactory.lineFacilityAccountsTempResource.getAccounts({clientId: routeParams.clientId},function (data) {
                console.log(data);
                scope.clientAccounts = data;
            });

            resourceFactory.getLineFacilityProductsResource.getLineFacilityProducts(function (data) {
                scope.lineproducts = data;
                console.log(scope.lineproducts);
            });

            scope.loanProductChange = function (loanProductId) {
                resourceFactory.searchLineFacilityProductResource.searchLineFacilityProduct({id: loanProductId}, function (data) {
                    scope.product = data;
                    console.log(scope.product);
                    scope.charges = scope.product.charges || [];
                    scope.productType =scope.product.facilityType;

                    scope.minDate = scope.product.productStartDate;
                    scope.maxDate = scope.product.productCloseDate;
                    scope.disabled = false;

                    scope.formData = {
                       /* shortName: scope.product.shortName,
                        description: scope.product.description,
                        fundId: scope.product.fundId,

                        digitsAfterDecimal: scope.product.currency.decimalPlaces,
                        inMultiplesOf: scope.product.currency.inMultiplesOf, */
                        currencyCode: scope.product.currency.code,
                        productId:scope.product.id,
                        transactionProcessingStrategyId: scope.product.transactionProcessingStrategyId,
                        minFacilityAmount: scope.product.minFacilityAmount,
                        defaultFacilityAmount:scope.product.defaultFacilityAmount,
                        maxFacilityAmount:scope.product.maxFacilityAmount,
                        minDailyUtilisation:scope.product.minDailyUtilisation,
                        defaultDailyUtilisation:scope.product.defaultDailyUtilisation,
                        maxDailyUtilisation:scope.product.maxDailyUtilisation,
                        maxInterestRate:scope.product.maxInterestRate,
                        annualInterestRate:scope.product.annualInterestRate,
                        minInterestRate:scope.product.minInterestRate,
                        interestCapitalisationFrequency:scope.product.interestCapitalisationFrequency,
                        daysInMonthType:scope.product.daysInMonthType,
                        daysInYearType:scope.product.daysInYearType,
                        overdueDaysForNPA: scope.product.overdueDaysForNPA,
                        daysBeforeOverdueStatus: scope.product.cycleDueForOverdue,
                        inArrearsTolerance:scope.product.arrearsToleranceCycle,
                        moratoriumPrincipal:scope.product.principalMoratoriumCycle,
                        moratoriumInterest:scope.product.interestMoratoriumCycle,
                        gracePeriod:scope.product.gracePeriodOnRepayment,
                        billingCycleInDays:scope.product.billingCycleInDays,
                        tenorMinimum:scope.product.minFacilityTenor,
                        tenorMaximum:scope.product.maxFacilityTenor,
                        tenorDefault:scope.product.defaultFacilityTenor,
                        repaymentCycle:scope.product.billingCycle.value,
                        limitAvailability:scope.product.limitFacilityAvailability.value,
                    };
                });
            };

            resourceFactory.loanProductResource.get({resourceType: 'template'}, function (data) {
                console.log(data);
                scope.productTemp = data;
                scope.assetAccountOptions = scope.productTemp.accountingMappingOptions.assetAccountOptions || [];
                scope.incomeAccountOptions = scope.productTemp.accountingMappingOptions.incomeAccountOptions || [];
                scope.expenseAccountOptions = scope.productTemp.accountingMappingOptions.expenseAccountOptions || [];
                scope.liabilityAccountOptions = scope.productTemp.accountingMappingOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);
                scope.penaltyOptions = scope.productTemp.penaltyOptions || [];
                scope.chargeOptions = scope.productTemp.chargeOptions || [];
                scope.overduecharges = [];
                for (var i in scope.penaltyOptions) {
                    if (scope.penaltyOptions[i].chargeTimeType.code == 'chargeTimeType.overdueInstallment') {
                        scope.overduecharges.push(scope.penaltyOptions[i]);
                    }
                }
                //scope.formData.currencyCode = scope.productTemp.currencyOptions[0].code;
            });

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
            }


            scope.chargeSelected = function (chargeId) {
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        //to charge select box empty

                        if (data.penalty) {
                            scope.penalityFlag = true;
                            scope.penalityId = '';
                        } else {
                            scope.chargeFlag = true;
                            scope.chargeId = '';
                        }
                    });
                }
            };

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            };

            //scope.expDate = dateFilter(scope.date.second, scope.df);
            scope.submit = function () {
                delete scope.formData.charges;
                delete scope.formData.collateral;
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                var reqThirdDate = dateFilter(scope.date.third, scope.df);
                var reqFourthDate = dateFilter(scope.date.fourth, scope.df);

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
                    clientId: routeParams.clientId,
                    productId:scope.product.id,
                    annualNominalInterestRate:this.formData.annualInterestRate,
                    facilityAvailableDate: firstDate,
                    facilityExpiryDate: secondDate,
                    maxDailyUtilisation: this.formData.maxDailyUtilisation,
                    accountLinkedTo:this.formData.accountId,
                }

                console.log(scope.contractData);
                resourceFactory.lineFacilityContractResource.saveContract(scope.contractData, function (data) {
                    console.log(data);
                    location.path('/viewclient/' + scope.clientId);
                });
            };

            scope.cancelContract = function () {
                location.path('/viewclient/' + scope.clientId);
            };
        }
    });
    mifosX.ng.application.controller('NewLineFacilityContractController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', 'UIConfigService', 'WizardHandler', mifosX.controllers.NewLineFacilityContractController]).run(function ($log) {
        $log.info("NewLineFacilityContractController initialized");
    });
}(mifosX.controllers || {}));
