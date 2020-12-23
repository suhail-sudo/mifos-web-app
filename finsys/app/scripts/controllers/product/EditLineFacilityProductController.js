(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLineFacilityProductController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.charges = [];
            scope.loanProductConfigurableAttributes = [];
            scope.showOrHideValue = "show";
            scope.configureFundOptions = [];
            scope.specificIncomeAccountMapping = [];
            scope.penaltySpecificIncomeaccounts = [];
            scope.configureFundOption = {};
            scope.date = {};
            scope.irFlag = false;
            scope.pvFlag = false;
            scope.rvFlag = false;
            scope.formData.accountingRule = 3;
            scope.interestRecalculationOnDayTypeOptions = [];
            for (var i = 1; i <= 28; i++) {
                scope.interestRecalculationOnDayTypeOptions.push(i);
            }

            resourceFactory.linFacilityTemplateResource.lineFacilityTemplate( function (data) {
                console.log(data);
                scope.lineTemplate = data;
            });
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

            resourceFactory.chargeResource.getAllCharges(function (data) {
                scope.chargesPulled = data;
            });
            resourceFactory.searchLineFacilityProductResource.searchLineFacilityProduct({id: routeParams.id}, function (data) {
                scope.product = data;
                console.log(scope.product);
                scope.charges = scope.product.charges || [];
                if (data.productStartDate) {
                    scope.date.first = new Date(data.productStartDate);
                }
                if (data.productCloseDate) {
                    scope.date.second = new Date(data.productCloseDate);
                }
                scope.overduecharges = [];
                scope.accounting = scope.product.accountingMappings;
                console.log(scope.accounting);
                scope.formData = {
                    name: scope.product.name,
                    shortName: scope.product.shortName,
                    description: scope.product.description,
                    fundId: scope.product.fundId,
                    currencyCode: scope.product.currency.code,
                    digitsAfterDecimal: scope.product.currency.decimalPlaces,
                    inMultiplesOf: scope.product.currency.inMultiplesOf,
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
                };

                scope.pIFPerc =0;
                scope.minAmnt =0;
                scope.minimumPay = 'pIF';
                    scope.formData.interestCapitalisationType = scope.product.interestCapitalisationFrequency.id;
                    scope.formData.interestCalculationMethod = scope.product.interestCalMethod.id;
                    scope.formData.transactionProcessingStrategyId = scope.product.transactionProcessingStrategy.id;
                    scope.formData.repaymentNotification = scope.product.repaymentNotification.id;
                    scope.formData.limitAvailability = scope.product.limitFacilityAvailability.id;
                    scope.formData.repaymentCycle = scope.product.billingCycle.id;
                    scope.formData.productType = scope.product.facilityType;

                    scope.formData.fundSourceAccountId = scope.product.accountingMappings.facilityPortfolioAccount.id;
                    //scope.formData.fundSourceAccountId = scope.product.accountingMappings.fundSourceAccount.id;
                    scope.formData.facilityPortfolioAccountId = scope.product.accountingMappings.facilityPortfolioAccount.id;
                    scope.formData.receivableInterestAccountId = scope.product.accountingMappings.receivableInterestAccount.id;
                    scope.formData.receivableFeeAccountId = scope.product.accountingMappings.receivableFeeAccount.id;
                    scope.formData.receivablePenaltyAccountId = scope.product.accountingMappings.receivablePenaltyAccount.id;

                    scope.formData.transfersInSuspenseAccountId = scope.product.accountingMappings.transfersInSuspenseAccount.id;
                    scope.formData.interestOnFacilityAccountId = scope.product.accountingMappings.interestOnFacilityAccount.id;
                    scope.formData.incomeFromFeeAccountId = scope.product.accountingMappings.incomeFromFeeAccount.id;
                    scope.formData.incomeFromPenaltyAccountId = scope.product.accountingMappings.incomeFromPenaltyAccount.id;
                    scope.formData.incomeFromRecoveryAccountId = scope.product.accountingMappings.incomeFromRecoveryAccount.id;
                    scope.formData.writeOffAccountId = scope.product.accountingMappings.writeOffAccount.id;
                    scope.formData.overpaymentLiabilityAccountId = scope.product.accountingMappings.overpaymentLiabilityAccount.id;


                setTimeout(function () {
                    angular.element('#facilityPortfolioAccountId option:contains('+scope.product.accountingMappings.facilityPortfolioAccount.name+')').prop('selected',true);
                    angular.element('#receivableInterestAccountId option:contains('+scope.product.accountingMappings.receivableInterestAccount.name+')').prop('selected',true);
                },500);

            });



            scope.isAccountingEnabled = function () {
                if (scope.formData.accountingRule == 2 || scope.formData.accountingRule == 3 || scope.formData.accountingRule == 4) {
                    return true;
                }
                return false;
            }

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

            //advanced accounting rule
            scope.showOrHide = function (showOrHideValue) {
                if (showOrHideValue == "show") {
                    scope.showOrHideValue = 'hide';
                }

                if (showOrHideValue == "hide") {
                    scope.showOrHideValue = 'show';
                }
            };

            scope.addConfigureFundSource = function () {
                if (scope.product.paymentTypeOptions && scope.product.paymentTypeOptions.length > 0 &&
                    scope.assetAccountOptions && scope.assetAccountOptions.length > 0) {
                    scope.configureFundOptions.push({
                        paymentTypeId: scope.product.paymentTypeOptions[0].id,
                        fundSourceAccountId: scope.assetAccountOptions[0].id,
                        paymentTypeOptions: scope.product.paymentTypeOptions,
                        assetAccountOptions: scope.assetAccountOptions
                    });
                }
            };

            scope.mapFees = function () {
                if (scope.product.chargeOptions && scope.product.chargeOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.specificIncomeAccountMapping.push({
                        chargeId: scope.chargeOptions.length > 0 ? scope.chargeOptions[0].id : '',
                        incomeAccountId: scope.incomeAndLiabilityAccountOptions.length > 0 ? scope.incomeAndLiabilityAccountOptions[0].id : ''
                    });
                }
            };

            scope.mapPenalty = function () {
                if (scope.product.penaltyOptions && scope.product.penaltyOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.penaltySpecificIncomeaccounts.push({
                        chargeId: scope.penaltyOptions.length > 0 ? scope.penaltyOptions[0].id : '',
                        incomeAccountId: scope.incomeAccountOptions.length > 0 ? scope.incomeAccountOptions[0].id : ''
                    });
                }
            };

           /* scope.addPrincipalVariation = function () {
                scope.pvFlag = true;
                scope.formData.principalVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                })
            };
            scope.addInterestRateVariation = function () {
                scope.irFlag = true;
                scope.formData.interestRateVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                })
            };
            scope.addNumberOfRepaymentVariation = function () {
                scope.rvFlag = true;
                scope.formData.numberOfRepaymentVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                })
            }; */


            scope.deleteFund = function (index) {
                scope.configureFundOptions.splice(index, 1);
            };

            scope.deleteFee = function (index) {
                scope.specificIncomeAccountMapping.splice(index, 1);
            };

            scope.deletePenalty = function (index) {
                scope.penaltySpecificIncomeaccounts.splice(index, 1);
            };

            scope.deletePrincipalVariation = function (index) {
                scope.formData.principalVariationsForBorrowerCycle.splice(index, 1);
            };

            scope.deleteInterestRateVariation = function (index) {
                scope.formData.interestRateVariationsForBorrowerCycle.splice(index, 1);
            };

            scope.deleterepaymentVariation = function (index) {
                scope.formData.numberOfRepaymentVariationsForBorrowerCycle.splice(index, 1);
            };

            scope.isAccountingEnabled = function () {
                if (scope.formData.accountingRule == 2 || scope.formData.accountingRule == 3 || scope.formData.accountingRule == 4) {
                    return true;
                }
                return false;
            }

            scope.isAccrualAccountingEnabled = function () {
                if (scope.formData.accountingRule == 3 || scope.formData.accountingRule == 4) {
                    return true;
                }
                return false;
            }

            scope.setFlag = function () {
                if (scope.formData.principalVariationsForBorrowerCycle) {
                    scope.pvFlag = true;
                }
                if (scope.formData.numberOfRepaymentVariationsForBorrowerCycle) {
                    scope.rvFlag = true;
                }
                if (scope.formData.interestRateVariationsForBorrowerCycle) {
                    scope.irFlag = true;
                }
            };
            scope.setFlag();

            scope.setAttributeValues = function(){
                if(scope.allowAttributeConfiguration == false){
                    scope.amortization = false;
                    scope.arrearsTolerance = false;
                    scope.graceOnArrearsAging = false;
                    scope.interestCalcPeriod = false;
                    scope.interestMethod = false;
                    scope.graceOnPrincipalAndInterest = false;
                    scope.repaymentFrequency = false;
                    scope.transactionProcessingStrategy = false;
                }
            }

            scope.submit = function () {
                scope.paymentChannelToFundSourceMappings = [];
                scope.feeToIncomeAccountMappings = [];
                scope.penaltyToIncomeAccountMappings = [];
                scope.chargesSelected = [];
                scope.selectedConfigurableAttributes = [];
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                var temp = '';
                //configure fund sources for payment channels
                for (var i in scope.configureFundOptions) {
                    temp = {
                        paymentTypeId: scope.configureFundOptions[i].paymentTypeId,
                        fundSourceAccountId: scope.configureFundOptions[i].fundSourceAccountId
                    }
                    scope.paymentChannelToFundSourceMappings.push(temp);
                }

                //map fees to specific income accounts
                for (var i in scope.specificIncomeAccountMapping) {
                    temp = {
                        chargeId: scope.specificIncomeAccountMapping[i].chargeId,
                        incomeAccountId: scope.specificIncomeAccountMapping[i].incomeAccountId
                    }
                    scope.feeToIncomeAccountMappings.push(temp);
                }

                //map penalties to specific income accounts
                for (var i in scope.penaltySpecificIncomeaccounts) {
                    temp = {
                        chargeId: scope.penaltySpecificIncomeaccounts[i].chargeId,
                        incomeAccountId: scope.penaltySpecificIncomeaccounts[i].incomeAccountId
                    }
                    scope.penaltyToIncomeAccountMappings.push(temp);
                }

                for (var i in scope.charges) {
                    temp = {
                        id: scope.charges[i].id
                    }
                    scope.chargesSelected.push(temp);
                }

                if(scope.allowAttributeConfiguration == false){
                    scope.amortization = false;
                    scope.arrearsTolerance = false;
                    scope.graceOnArrearsAging = false;
                    scope.interestCalcPeriod = false;
                    scope.interestMethod = false;
                    scope.graceOnPrincipalAndInterest = false;
                    scope.repaymentFrequency = false;
                    scope.transactionProcessingStrategy = false;
                }

                scope.selectedConfigurableAttributes =
                    {amortizationType:scope.amortization,
                        interestType:scope.interestMethod,
                        interestCalculationPeriodType:scope.interestCalcPeriod,
                        inArrearsTolerance:scope.arrearsTolerance,
                        repaymentEvery:scope.repaymentFrequency,
                        graceOnPrincipalAndInterestPayment:scope.graceOnPrincipalAndInterest,
                        graceOnArrearsAgeing:scope.graceOnArrearsAging};

                this.formData.paymentChannelToFundSourceMappings = scope.paymentChannelToFundSourceMappings;
                this.formData.feeToIncomeAccountMappings = scope.feeToIncomeAccountMappings;
                this.formData.penaltyToIncomeAccountMappings = scope.penaltyToIncomeAccountMappings;
                this.formData.charges = scope.chargesSelected;
                this.formData.allowAttributeOverrides = scope.selectedConfigurableAttributes;
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                this.formData.startDate = reqFirstDate;
                this.formData.closeDate = reqSecondDate;

                //Interest recalculation data
                if (this.formData.isInterestRecalculationEnabled) {
                    var restFrequencyDate = dateFilter(scope.date.recalculationRestFrequencyDate, scope.df);
                    scope.formData.recalculationRestFrequencyDate = restFrequencyDate;
                    var compoundingFrequencyDate = dateFilter(scope.date.recalculationCompoundingFrequencyDate, scope.df);
                    scope.formData.recalculationCompoundingFrequencyDate = compoundingFrequencyDate;
                }else{
                    delete scope.formData.interestRecalculationCompoundingMethod;
                    delete scope.formData.rescheduleStrategyMethod;
                    delete scope.formData.recalculationRestFrequencyType;
                    delete scope.formData.recalculationRestFrequencyInterval;
                }

                if(this.formData.isLinkedToFloatingInterestRates) {
                    delete scope.formData.interestRatePerPeriod ;
                    delete scope.formData.minInterestRatePerPeriod ;
                    delete scope.formData.maxInterestRatePerPeriod ;
                    delete scope.formData.interestRateFrequencyType ;
                }else {
                    delete scope.formData.floatingRatesId ;
                    delete scope.formData.interestRateDifferential ;
                    delete scope.formData.isFloatingInterestRateCalculationAllowed ;
                    delete scope.formData.minDifferentialLendingRate ;
                    delete scope.formData.defaultDifferentialLendingRate ;
                    delete scope.formData.maxDifferentialLendingRate ;

                }

                //If Variable Installments is not allowed for this product, remove the corresponding formData
                if(!this.formData.allowVariableInstallments) {
                    delete scope.formData.minimumGap ;
                    delete scope.formData.maximumGap ;
                }

                if(this.formData.interestCalculationPeriodType == 0){
                    this.formData.allowPartialPeriodInterestCalcualtion = false;
                }

                if (this.formData.recalculationCompoundingFrequencyType == 4) {
                    if(this.formData.recalculationCompoundingFrequencyNthDayType == -2) {
                        delete this.formData.recalculationCompoundingFrequencyNthDayType;
                        delete this.formData.recalculationCompoundingFrequencyDayOfWeekType;
                    } else {
                        delete this.formData.recalculationCompoundingFrequencyOnDayType;
                    }
                } else if (this.formData.recalculationCompoundingFrequencyType == 3){
                    delete this.formData.recalculationCompoundingFrequencyOnDayType;
                    delete this.formData.recalculationCompoundingFrequencyNthDayType;
                }

                if (this.formData.recalculationRestFrequencyType == 4) {
                    if(this.formData.recalculationRestFrequencyNthDayType == -2) {
                        delete this.formData.recalculationRestFrequencyNthDayType;
                        delete this.formData.recalculationRestFrequencyDayOfWeekType;
                    } else {
                        delete this.formData.recalculationRestFrequencyOnDayType;
                    }
                } else if (this.formData.recalculationRestFrequencyType == 3){
                    delete this.formData.recalculationRestFrequencyOnDayType;
                    delete this.formData.recalculationRestFrequencyNthDayType;
                }

                delete this.formData.multiDisburseLoan;
                if (scope.formData.accountingRule){delete scope.formData.accountingRule;}

                if (this.formData.accountingRule){delete this.formData.accountingRule;}

                delete this.formData.inMultiplesOf;
                delete this.formData.allowAttributeOverrides;
                delete this.formData.interestCapitalisationFrequency;
                console.log(this.formData);
                resourceFactory.searchLineFacilityProductResource.updateLineProduct({id: routeParams.id}, this.formData, function (data) {
                    location.path('/viewlineFacilityproduct/' + data.resourceId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditLineFacilityProductController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditLineFacilityProductController]).run(function ($log) {
        $log.info("EditLineFacilityProductController initialized");
    });
}(mifosX.controllers || {}));
