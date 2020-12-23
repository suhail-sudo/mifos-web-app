(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSavingProductController: function (scope, $rootScope, resourceFactory, location , WizardHandler) {
            scope.formData = {};
            scope.savingproduct = {};
            scope.charges = [];
            scope.showOrHideValue = "show";
            scope.configureFundOptions = [];
            scope.specificIncomeaccounts = [];
            scope.penaltySpecificIncomeaccounts = [];
            scope.configureFundOption = {};
            scope.filteredChargeOptions = [];
            scope.isClicked = false;
            scope.commissions = [];
            scope.commissionExpenseOptions = [];
            scope.commissionExpenseOption = {};
            scope.filteredCommissionOptions = [];

            resourceFactory.savingProductResource.get({resourceType: 'template'}, function (data) {
                scope.product = data;
                scope.product.chargeOptions = scope.product.chargeOptions || [];
                scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [];
                scope.liabilityAccountOptions = scope.product.accountingMappingOptions.liabilityAccountOptions || [];
                scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];
                scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions || [];
				
				scope.mergeAllGLs();

                scope.formData.currencyCode = data.currencyOptions[0].code;
                scope.formData.digitsAfterDecimal = data.currencyOptions[0].decimalPlaces;
                scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
                scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
                scope.formData.interestCalculationType = data.interestCalculationType.id;
                scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
                scope.formData.accountingRule = '1';
                scope.savingproduct = angular.copy(scope.formData);
                 scope.filterCharges();

            });
            
            scope.mergeAllGLs = function () {
                scope.allGls = [];
                 _.each(scope.assetAccountOptions, function(gl){
                    scope.allGls.push(gl);
                });
                 _.each(scope.liabilityAccountOptions, function(gl){
                    scope.allGls.push(gl);
                });
                 _.each(scope.incomeAccountOptions, function(gl){
                    scope.allGls.push(gl);
                });
                 _.each(scope.expenseAccountOptions, function(gl){
                    scope.allGls.push(gl);
                });
            }

			scope.filterCharges = function () {
                _.each(scope.product.chargeOptions, function (v, k) {
                   if (!v.applicableToAllProducts) {
                        scope.filteredChargeOptions.push(v);
                   }
                });
            };
            
            scope.$watch('formData',function(newVal){
                scope.savingproduct = angular.extend(scope.savingproduct,newVal);
            },true);

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
                scope.isClicked = true;
            }

            scope.formValue = function(array,model,findattr,retAttr){
                findattr = findattr ? findattr : 'id';
                retAttr = retAttr ? retAttr : 'value';
                console.log(findattr,retAttr,model);
                return _.find(array, function (obj) {
                    return obj[findattr] === model;
                })[retAttr];
            };
            //$rootScope.formValue is used which is defined in CreateLoanProductController.js

            //advanced accounting rule
            scope.showOrHide = function (showOrHideValue) {

                if (showOrHideValue == "show") {
                    scope.showOrHideValue = 'hide';
                }

                if (showOrHideValue == "hide") {
                    scope.showOrHideValue = 'show';
                }
            }

            scope.chargeSelected = function (chargeId) {
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        //to charge select box empty
                        scope.chargeId = '';
                    });
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

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
                ;
            }

            scope.mapFees = function () {
                if (scope.product.chargeOptions && scope.product.chargeOptions.length > 0 
                && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.specificIncomeaccounts.push({
                        chargeId: scope.product.chargeOptions[0].id,
                        incomeAccountId: scope.incomeAccountOptions[0].id,
                        chargeOptions: scope.filteredChargeOptions,
                        incomeAccountOptions: scope.product.accountingMappingOptions.incomeAccountOptions
                    });
                }
            }

            scope.mapPenalty = function () {
                if (scope.product.penaltyOptions && scope.product.penaltyOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.penaltySpecificIncomeaccounts.push({
                        chargeId: scope.product.penaltyOptions[0].id,
                        incomeAccountId: scope.incomeAccountOptions[0].id,
                        penaltyOptions: scope.product.penaltyOptions,
                        incomeAccountOptions: scope.incomeAccountOptions
                    });
                }
            }

            scope.deleteFund = function (index) {
                scope.configureFundOptions.splice(index, 1);
            }

            scope.deleteFee = function (index) {
                scope.specificIncomeaccounts.splice(index, 1);
            }

            scope.deletePenalty = function (index) {
                scope.penaltySpecificIncomeaccounts.splice(index, 1);
            }

            scope.cancel = function () {
                location.path('/savingproducts');
            };
            
             scope.commissionSelected = function (commissionId) {
                if (commissionId) {
                    resourceFactory.commissionResource.get({commissionId: commissionId, template: 'true'}, this.formData, function (data) {
                        data.commissionId = data.id;
                        scope.commissions.push(data);
                        //to charge select box empty
                        scope.commissionId = '';
                    });
                }
            }
            
            scope.deleteCommission = function (index) {
                scope.commissions.splice(index, 1);
            }
            
            scope.deleteCommissionExpenseAccount = function (index) {
                scope.commissionExpenseOptions.splice(index, 1);
            }
            
            scope.addConfigureCommissionExpense = function () {
                if (scope.product.commissionOptions && scope.product.commissionOptions.length > 0 &&
                    scope.expenseAccountOptions && scope.expenseAccountOptions.length > 0) {
                    scope.commissionExpenseOptions.push({
                        commissionId: scope.product.commissionOptions[0].id,
                        commissionExpenseAccountId: scope.expenseAccountOptions[0].id,
                        commissionOptions: scope.product.commissionOptions,
                        expenseAccountOptions: scope.expenseAccountOptions
                    });
                }
                ;
            }

            scope.submit = function () {
                scope.paymentChannelToFundSourceMappings = [];
                scope.feeToIncomeAccountMappings = [];
                scope.penaltyToIncomeAccountMappings = [];
                scope.chargesSelected = [];

                var temp = '';
                
                scope.commissionToExpenseAccountMappings = [];
                scope.commissionsSelected = [];
                

                //configure fund sources for payment channels
                for (var i in scope.configureFundOptions) {
                    temp = {
                        paymentTypeId: scope.configureFundOptions[i].paymentTypeId,
                        fundSourceAccountId: scope.configureFundOptions[i].fundSourceAccountId
                    }
                    scope.paymentChannelToFundSourceMappings.push(temp);
                }

                //map fees to specific income accounts
                for (var i in scope.specificIncomeaccounts) {
                    temp = {
                        chargeId: scope.specificIncomeaccounts[i].chargeId,
                        incomeAccountId: scope.specificIncomeaccounts[i].incomeAccountId,
                    }
                    scope.feeToIncomeAccountMappings.push(temp);
                }

                //map penalties to specific income accounts
                for (var i in scope.penaltySpecificIncomeaccounts) {
                    temp = {
                        chargeId: scope.penaltySpecificIncomeaccounts[i].chargeId,
                        incomeAccountId: scope.penaltySpecificIncomeaccounts[i].incomeAccountId,
                    }
                    scope.penaltyToIncomeAccountMappings.push(temp);
                }
                
                //configure commission to expense account mapping
                for (var i in scope.commissionExpenseOptions) {
                    temp = {
                        commissionId: scope.commissionExpenseOptions[i].commissionId,
                        commissionExpenseAccountId: scope.commissionExpenseOptions[i].commissionExpenseAccountId
                    }
                    scope.commissionToExpenseAccountMappings.push(temp);
                }

                for (var i in scope.charges) {
                    temp = {
                        id: scope.charges[i].id
                    }
                    scope.chargesSelected.push(temp);
                }
                

                this.formData.paymentChannelToFundSourceMappings = scope.paymentChannelToFundSourceMappings;
                this.formData.feeToIncomeAccountMappings = scope.feeToIncomeAccountMappings;
                this.formData.penaltyToIncomeAccountMappings = scope.penaltyToIncomeAccountMappings;
                this.formData.commissionToExpenseAccountMappings = scope.commissionToExpenseAccountMappings;
                this.formData.charges = scope.chargesSelected;
                this.formData.locale = scope.optlang.code;

                delete this.formData.commissionExpenseAccountId;
                delete this.formData.commissionToExpenseAccountMappings;

                resourceFactory.savingProductResource.save(this.formData, function (data) {
                    location.path('/viewsavingproduct/' + data.resourceId);
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateSavingProductController', ['$scope', '$rootScope', 'ResourceFactory', '$location', 'WizardHandler', mifosX.controllers.CreateSavingProductController]).run(function ($log) {
        $log.info("CreateSavingProductController initialized");
    });
}(mifosX.controllers || {}));
