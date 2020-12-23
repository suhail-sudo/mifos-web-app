(function (module) {
    mifosX.controllers = _.extend(module, {
        EditChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.template = [];
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first = {};
            scope.flag = false;
	        scope.showPenalty = true ;
	        scope.showCommission = true ;
	        scope.accountingRule = {};
            scope.accountingRules = [];
	        
	        scope.showOrHideValue = "hide";
            scope.paymentTypeCharges = [];
            scope.paymentTypes = [];
            scope.paymentTypeOptions = [];
            scope.chargeCalculationTypeOptions = [];
            scope.showApplicableToAllProducts = false;
            resourceFactory.accountingRulesResource.get(function (data) {
                scope.accountingRules = data;
            });

            resourceFactory.chargeResource.getCharge({chargeId: routeParams.id, template: true}, function (data) {
                scope.template = data;
                
                scope.paymentTypeCharges = data.paymentTypeCharges;
                scope.paymentTypeOptions = data.paymentTypeOptions;
                
                scope.incomeAccountOptions = data.incomeOrLiabilityAccountOptions.incomeAccountOptions || [];
                scope.liabilityAccountOptions = data.incomeOrLiabilityAccountOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);

                if (data.chargeAppliesTo.value === "Loan") {
                    scope.chargeTimeTypeOptions = data.loanChargeTimeTypeOptions;
                    scope.template.chargeCalculationTypeOptions = scope.template.loanChargeCalculationTypeOptions;
                    scope.flag = false;
                    scope.showFrequencyOptions = true;
                     scope.chargeCalculationTypeOptions = scope.template.loanChargeCalculationTypeOptions;
                } else if (data.chargeAppliesTo.value === "Savings") {
                    scope.chargeTimeTypeOptions = data.savingsChargeTimeTypeOptions;
                    scope.template.chargeCalculationTypeOptions = scope.template.savingsChargeCalculationTypeOptions;
                    scope.flag = true;
                    scope.showFrequencyOptions = false;
                    scope.chargeCalculationTypeOptions = data.savingsChargeCalculationTypeOptions;
                }else if(data.chargeAppliesTo.value === 'Shares') {
                    scope.showChargePaymentByField = false;
                    scope.chargeCalculationTypeOptions = scope.template.shareChargeCalculationTypeOptions;
                    scope.chargeTimeTypeOptions = scope.template.shareChargeTimeTypeOptions;
                    scope.addfeefrequency = false;
                    scope.showPenalty = false ;
                    scope.showCommission = false;
                    scope.flag = true;
                }else {
                    scope.flag = true;
                    scope.template.chargeCalculationTypeOptions = data.clientChargeCalculationTypeOptions;
                    scope.chargeTimeTypeOptions = scope.template.clientChargeTimeTypeOptions;
                    scope.showFrequencyOptions = false;
                }

				
                scope.formData = {
                    name: data.name,
                    active: data.active,
                    penalty: data.penalty,
                    commission: data.commission,
                    currencyCode: data.currency.code,
                    chargeAppliesTo: data.chargeAppliesTo.id,
                    chargeTimeType: data.chargeTimeType.id,
                    chargeCalculationType: data.chargeCalculationType.id,
                    amount: data.amount,
                    applicableToAllProducts:data.applicableToAllProducts
                };

                if(data.incomeOrLiabilityAccount){
                    scope.formData.incomeAccountId = data.incomeOrLiabilityAccount.id;
                }

                if(data.taxGroup){
                    scope.formData.taxGroupId = data.taxGroup.id;
                }

                if(data.feeFrequency){
                    scope.addfeefrequency = 'true';
                    scope.formData.feeFrequency = data.feeFrequency.id;
                    scope.formData.feeInterval = data.feeInterval;
                }
                
                if(data.accountingRule) {
                    scope.formData.accountingRuleId = data.accountingRule.id;
                }

                //when chargeAppliesTo is savings, below logic is
                //to display 'Due date' field, if chargeTimeType is
                // 'annual fee' or 'monthly fee'
                if (scope.formData.chargeAppliesTo === 2) {
                    if (data.chargeTimeType.value === "Annual Fee" || data.chargeTimeType.value === "Monthly Fee") {
                        scope.showdatefield = true;
                        if (data.feeOnMonthDay) {
                            data.feeOnMonthDay.push(2013);
                            var actDate = dateFilter(data.feeOnMonthDay, 'dd MMMM');
                            scope.first.date = new Date(actDate);
                            //to display "Repeats Every" field ,if chargeTimeType is
                            // 'monthly fee'
                            if (data.chargeTimeType.value === "Monthly Fee") {
                                scope.repeatEvery = true;
                                scope.formData.feeInterval = data.feeInterval;
                            } else {
                                scope.repeatEvery = false;
                            }
                        }
                    } else {
                        scope.showdatefield = false;
                    }
                } else {
                    scope.formData.chargePaymentMode = data.chargePaymentMode.id;
                }
                if (data.chargeTimeType.value == "Withdrawal Fee" || data.chargeTimeType.value == "Deposit Fee") {
                    scope.showPaymentType = true;
                    scope.repeatEvery = false;
                    scope.showAccountingRule = true;
                }
                else {
                    scope.showPaymentType = false;
                    scope.showAccountingRule = false;
                }
                scope.populatePaymentTypes();
                scope.showOrHideApplicableToAllSavings();
            });
            
            
            scope.populatePaymentTypes = function () {
                 _.each(scope.paymentTypeCharges, function (paymentTypeCharge) {
                    scope.paymentType =  paymentTypeCharge.paymentType.id;
                });
             }
             
             
        //when chargeAppliesTo is savings, below logic is
        //to display 'Due date' field, if chargeTimeType is
        // 'annual fee' or 'monthly fee'
        scope.chargeTimeChange = function (chargeTimeType) {
		if ((chargeTimeType === 12) && (scope.template.chargeAppliesTo.value === "Loan"))
		{
			scope.showFrequencyOptions = false;
		}
		else
		{
			scope.showFrequencyOptions = true;
		}
                if (scope.formData.chargeAppliesTo === 2) {
                    for (var i in scope.template.chargeTimeTypeOptions) {
                        if (chargeTimeType === scope.template.chargeTimeTypeOptions[i].id) {
                            if (scope.template.chargeTimeTypeOptions[i].value == "Annual Fee" 
                            || scope.template.chargeTimeTypeOptions[i].value == "Monthly Fee") {
                                scope.showdatefield = true;
                                //to show 'repeats every' field for monthly fee
                                if (scope.template.chargeTimeTypeOptions[i].value == "Monthly Fee") {
                                    scope.repeatEvery = true;
                                } else {
                                    scope.repeatEvery = false;
                                }
                            } else {
                                scope.showdatefield = false;
                            }
                            if (scope.template.chargeTimeTypeOptions[i].value == "Withdrawal Fee" || scope.template.chargeTimeTypeOptions[i].value == "Deposit Fee") {
                                scope.showPaymentType = true;
                                scope.repeatEvery = false;
                            }
                            else {
                                scope.showPaymentType = false;
                            }
                        }
                    }
                }
                
            }
            
             scope.showOrHideApplicableToAllSavings = function() {
                if (scope.formData.chargeAppliesTo === 2 && !(scope.paymentType === '' || _.isNull(scope.paymentType) || _.isUndefined(scope.paymentType))) {
                    scope.showApplicableToAllProducts = true;
                }
                else {
                    scope.showApplicableToAllProducts = false;
                    scope.formData.applicableToAllProducts = false;
                }
            };

            scope.filterChargeCalculations = function(chargeTimeType) {
                return function (item) {
                    if (chargeTimeType == 12 && ((item.id == 3) || (item.id == 4)))
                    {
                        return false;
                    }
                    if (chargeTimeType != 12 && item.id == 5)
                    {
                        return false;
                    }
                    return true;
                };
            };

            scope.submit = function () {
                if (scope.formData.chargeAppliesTo.value === 'Savings') {
                    if (scope.showdatefield === true) {
                        var reqDate = dateFilter(scope.first.date, 'dd MMMM');
                        this.formData.monthDayFormat = 'dd MMM';
                        this.formData.feeOnMonthDay = reqDate;
                    }
                    this.formData.paymentTypes = scope.paymentType;
                }else if(scope.addfeefrequency == 'false'){
                    scope.formData.feeFrequency = null;
                    scope.formData.feeInterval = null;
                }
                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.penalty = this.formData.penalty || false;
                this.formData.commission = this.formData.commission || false;
                
                if(this.formData.accountingRuleId == '' || _.isNull(this.formData.accountingRuleId) || _.isUndefined(this.formData.accountingRuleId)){
                    this.formData.accountingRuleId = "";
                }
                this.formData.applicableToAllProducts = this.formData.applicableToAllProducts || false;
                if (scope.formData.chargeAppliesTo === 2) {
                    if (!(scope.paymentType === '' || _.isNull(scope.paymentType) || _.isUndefined(scope.paymentType))) {
                        scope.paymentTypes = [];
                        scope.formData.paymentTypes = [];
                        scope.paymentTypes.push({
                            id: scope.paymentType,
                            chargeCalculationType: scope.formData.chargeCalculationType,
                            amount: scope.formData.amount,
                            locale: scope.formData.locale
                        });
                        this.formData.paymentTypes = scope.paymentTypes;
                    }
                }
                resourceFactory.chargeResource.update({chargeId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewcharge/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditChargeController]).run(function ($log) {
        $log.info("EditChargeController initialized");
    });
}(mifosX.controllers || {}));
