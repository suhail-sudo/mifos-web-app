define(['Q', 'underscore', 'mifosX'], function (Q) {
    var components = {
        models: [
            'clientStatus',
            'LoggedInUser',
            'roleMap',
            'Langs'
        ],
        services: [
            'ResourceFactoryProvider',
            'HttpServiceProvider',
            'AuthenticationService',
            'SessionManager',
            'Paginator',
            'UIConfigService',
            'NotificationResponseHeaderProvider',
            'NotificationService'
        ],

        controllers: [
            'main/MainController',
            'main/LoginFormController',
            'main/TaskController',
            'main/SearchController',
            'main/NavigationController',
            'collection/ProductiveCollectionSheetController',
            'collection/CollectionSheetController',
            'collection/IndividualCollectionSheetController',
            'loanAccount/ViewLoanDetailsController',
            'loanAccount/AdjustRepaymentSchedule',
            'loanAccount/NewLoanAccAppController',
            'loanAccount/NewLineFacilityContractController',
            'loanAccount/ViewLineFacilityContractController',
            'loanAccount/withdrawFromFacilityAccountController',
            'loanAccount/EditLineFacilityContractController',
            'loanAccount/LoanAccountActionsController',
            'loanAccount/AddLoanChargeController',
            'loanAccount/AddLoanCollateralController',
            'loanAccount/AssignLoanOfficerController',
            'loanAccount/EditLoanAccAppController',
            'loanAccount/ViewLoanCollateralController',
            'loanAccount/EditLoanCollateralController',
            'loanAccount/ViewLoanChargeController',
            'loanAccount/EditLoanChargeController',
            'loanAccount/NewJLGLoanAccAppController',
            'loanAccount/LoanDocumentController',
            'loanAccount/ViewLoanTransactionController',
            'loanAccount/LoanScreenReportController',
            'loanAccount/RescheduleLoansRequestController',
            'loanAccount/ViewRescheduleRequestController',
            'loanAccount/ApproveLoanRescheduleRequestController',
            'loanAccount/RejectLoanRescheduleRequestController',
            'loanAccount/PreviewLoanRepaymentScheduleController',
            'loanAccount/LoanForeclosureController',
            'groups/AssignStaffController',
            'client/ClientController',
            'client/EditClientController',
            'client/EditAgentController',
            'client/ViewClientController',
            'client/CreateClientController',
            'client/TransactionClientController',
            'client/ClientActionsController',
            'client/ClientDocumentController',
            'client/ClientIdentifierController',
            'client/UploadClientIdentifierDocumentController',
            'client/ClientScreenReportController',
            'client/AddNewClientChargeController',
            'client/PayClientChargeController',
            'client/ViewClientChargeController',
            'client/ClientChargesOverviewController',
            'client/SurveyController',
            'client/ViewClientSurveyController',
            'product/LoanProductController',
            'product/CreateLoanProductController',
            'product/CreateSavingProductController',
            'product/EditSavingProductController',
            'product/EditLoanProductController',
            'product/ChargeController',
            'product/ViewChargeController',
            'product/floatingrates/FloatingRatesController',
            'product/floatingrates/CreateFloatingRateController',
            'product/floatingrates/ViewFloatingRateController',
            'product/floatingrates/EditFloatingRateController',
            'product/SavingProductController',
            'product/ViewSavingProductController',
            'product/ShareProductController',
            'product/ViewShareProductController',
            'product/CreateShareProductController',
            'product/EditShareProductController',
            'product/ShareProductDividendController',
            'product/ViewShareProductDividendController',
            'product/ShareProductActionsController',
            'product/ViewLoanProductController',
            'product/FixedDepositProductController',
            'product/ViewFixedDepositProductController',
            'product/CreateFixedDepositProductController',
            'product/EditFixedDepositProductController',
            'product/RecurringDepositProductController',
            'product/ViewRecurringDepositProductController',
            'product/CreateRecurringDepositProductController',
            'product/EditRecurringDepositProductController',
            'product/InterestRateChartController',
            'product/CreateInterestRateChartController',
            'product/EditInterestRateChartController',
            'product/ViewChargeSlabsController',
            'product/ViewChargeExemptionController',
            'product/LineFacilityProductController',
            'product/CreateLineFacilityProductController',
            'product/ViewLineFacilityProductController',
            'product/EditLineFacilityProductController',
            'user/UserController',
            'user/UserFormController',
            'user/UserSettingController',
            'user/UserListController',
            'user/ViewUserController',
            'organization/RoleController',
            'organization/ViewRoleController',
            'organization/CreateRoleController',
            'organization/MakerCheckerController',
            'organization/officetype/OfficeTypesController',
            'organization/officetype/ViewOfficeTypeController',
            'organization/officetype/EditOfficeTypeController',
            'organization/officetype/CreateOfficeTypeController',
            'organization/OfficesController',
            'organization/ViewOfficeController',
            'organization/CreateOfficeController',
            'organization/EditOfficeController',
            'organization/CurrencyConfigController',
            'organization/ViewCurrencyController',
            'organization/CreateUserController',
            'organization/EditUserController',
            'organization/ViewEmployeeController',
            'organization/EditEmployeeController',
            'organization/EmployeeController',
            'organization/CreateEmployeeController',
            'organization/ManageFundsController',
            'organization/ViewPaymentTypeController',
            'organization/CreatePaymentTypeController',
            'organization/EditPaymentTypeController',
            'accounting/provisioning/CreateProvisoningEntriesController',
            'accounting/provisioning/ViewProvisioningEntryController',
            'accounting/provisioning/ViewAllProvisoningEntriesController',
            'accounting/provisioning/ViewProvisioningJournalEntriesController',
            'accounting/AccFreqPostingController',
            'accounting/AccCoaController',
            'accounting/AccCreateGLAccountController',
            'accounting/AccViewGLAccountContoller',
            'accounting/AccEditGLAccountController',
            'accounting/ViewTransactionController',
            'accounting/JournalEntryController',
            'accounting/SearchTransactionController',
            'accounting/AccountingClosureController',
            'accounting/ViewAccountingClosureController',
            'accounting/AccountingRuleController',
            'accounting/AccCreateRuleController',
            'accounting/AccEditRuleController',
            'accounting/ViewAccRuleController',
            'accounting/FinancialActivityMappingsController',
            'accounting/AddFinancialMappingController',
            'accounting/ViewFinancialActivityController',
            'accounting/EditFinancialActivityMappingController',
            'accounting/PeriodicAccrualAccountingController',
            'system/CodeController',
            'system/EditCodeController',
            'system/ViewCodeController',
            'system/AddCodeController',
            'system/HookController',
            'system/ViewHookController',
            'system/CreateHookController',
            'system/EditHookController',
            'system/ViewDataTableController',
            'system/DataTableController',
            'system/ReportsController',
            'system/ViewReportController',
            'system/CreateReportController',
            'system/EditReportController',
            'system/CreateDataTableController',
            'system/EditDataTableController',
            'system/MakeDataTableEntryController',
            'system/DataTableEntryController',
            'system/SchedulerJobsController',
            'system/ViewSchedulerJobController',
            'system/EditSchedulerJobController',
            'system/EntityToEntityMappingController',
            'system/ViewSchedulerJobHistoryController',
            'system/AccountNumberPreferencesController',
            'system/ViewAccountNumberPreferencesController',
            'system/AddAccountNumberPreferencesController',
            'system/EditAccountNumberPreferencesController',
            'system/ManageSurveysController',
            'system/EditSurveyController',
            'system/ViewSurveyController',
            'organization/HolController',
            'organization/ViewHolController',
            'organization/EditHolidayController',
            'organization/AddHolController',
            'reports/ViewReportsController',
            'organization/EditHolidayController',
            'organization/EditWorkingDaysController',
            'organization/EditPasswordPreferencesController',
            'reports/RunReportsController',
            'reports/XBRLController',
            'reports/XBRLReportController',
            'savings/CreateSavingAccountController',
            'savings/ViewSavingDetailsController',
            'shares/CreateShareAccountController',
            'shares/ViewShareAccountController',
            'shares/EditShareAccountController',
            'shares/ShareAccountActionsController',
            'groups/GroupController',
            'groups/ViewGroupController',
            'groups/AttachMeetingController',
            'groups/EditMeetingController',
            'groups/EditMeetingBasedOnMeetingDatesController',
            'savings/EditSavingAccountController',
            'savings/SavingAccountActionsController',
            'savings/ListOnHoldTransactionController',
            'accounttransfers/ViewAccountTransferDetailsController',
            'accounttransfers/MakeAccountTransferController',
            'accounttransfers/CreateStandingInstructionController',
            'accounttransfers/ListStandingInstructionController',
            'accounttransfers/ListTransactionsController',
            'accounttransfers/EditStandingInstructionController',
            'accounttransfers/ViewStandingInstructionController',
            'accounttransfers/StandingInstructionsHistoryController',
            'savings/ViewSavingsTransactionController',
            'savings/AddNewSavingsChargeController',
            'savings/ViewSavingChargeController',
            'savings/AssignSavingsOfficerController',
            'savings/UnAssignSavingsOfficerController',
            'savings/UpdateSavingsProductController',
            'savings/ViewSavingsTransactionReceiptController',
            'deposits/fixed/FixedDepositAccountActionsController',
            'deposits/fixed/ViewFixedDepositAccountDetailsController',
            'deposits/fixed/CreateFixedDepositAccountController',
            'deposits/fixed/EditDepositAccountController',
            'deposits/fixed/AddNewFixedDepositChargeController',
            'deposits/fixed/ViewFixedDepositTransactionController',
            'deposits/recurring/RecurringDepositAccountActionsController',
            'deposits/recurring/ViewRecurringDepositAccountDetailsController',
            'deposits/recurring/CreateRecurringDepositAccountController',
            'deposits/recurring/EditRecurringDepositAccountController',
            'deposits/recurring/AddNewRecurringDepositChargeController',
            'deposits/recurring/ViewRecurringDepositTransactionController',
            'groups/CreateGroupController',
            'groups/EditGroupController',
            'groups/GroupAttendanceController',
            'groups/CloseGroupController',
            'groups/AddRoleController',
            'groups/MemberManageController',
            'groups/TransferClientsController',
            'centers/CenterController',
            'centers/ViewCenterController',
            'centers/CreateCenterController',
            'centers/EditCenterController',
            'centers/CloseCenterController',
            'centers/CenterAttendanceController',
            'centers/ManageGroupMembersController',
            'product/CreateChargeController',
            'product/EditChargeController',
            'configurations/GlobalConfigurationController',
            'configurations/EditConfigurationController',
            'configurations/EditDefaultSavingsForClientController',
            'product/productmix/ProductMixController',
            'product/productmix/ViewProductMixController',
            'product/productmix/AddProductMixController',
            'organization/BulkLoanReassignmentController',
            'system/AuditController',
            'system/ViewAuditController',
            'template/TemplateController',
            'template/CreateTemplateController',
            'template/ViewTemplateController',
            'template/EditTemplateController',
            'loanAccount/GuarantorController',
            'loanAccount/EditGuarantorController',
            'loanAccount/ListGuarantorController',
            'main/ViewCheckerinboxController',
            'main/ExpertSearchController',
            'main/RichDashboard',
            'main/ProfileController',
            'main/ViewMakerCheckerTaskController',
            'main/TransactionAuthorisationController',
            'main/AdHocQuerySearchController',
            'accounting/AccOGMController',
            'organization/cashmgmt/TellersController',
            'organization/cashmgmt/CreateTellerController',
            'organization/cashmgmt/ViewTellerController',
            'organization/cashmgmt/EditTellerController',
            'organization/cashmgmt/ViewCashiersForTellerController',
            'organization/cashmgmt/CreateCashierForTellerController',
            'organization/cashmgmt/ViewCashierController',
            'organization/cashmgmt/EditCashierController',
            'organization/cashmgmt/CashierTransactionsController',
            'organization/cashmgmt/CashierFundsAllocationSettlementController',
            'organization/provisioning/CreateProvisioningCriteriaController',
            'organization/provisioning/ViewAllProvisoningCriteriaController',
            'organization/provisioning/ViewProvisioningCriteriaController',
            'organization/provisioning/EditProvisioningCriteriaController',
            'accounting/DefineOpeningBalancesController',
            'configurations/ExternalServicesController',
            'configurations/EditExternalServicesConfigurationController',
            'configurations/ViewExternalServicesController',
            'configurations/ViewTwoFactorConfigController',
            'configurations/EditTwoFactorConfigController',
            'product/tax/CreateTaxComponentController',
            'product/tax/ViewTaxComponentController',
            'product/tax/EditTaxComponentController',
            'product/tax/TaxComponentController',
            'product/tax/CreateTaxGroupController',
            'product/tax/ViewTaxGroupController',
            'product/tax/EditTaxGroupController',
            'product/tax/TaxGroupController',
            'configurations/EditAddressController',
            'configurations/EditOfficeAddressController',
            'configurations/AddressFormController',
            'organization/smscampaigns/SmsCampaignsController',
            'organization/smscampaigns/CreateSmsCampaignController',
            'organization/smscampaigns/ViewSmsCampaignController',
            'organization/smscampaigns/EditSmsCampaignController',
            'organization/entitydatatablechecks/EntityDatatableChecksController',
            'notification/NotificationsController',
            'notification/NotificationsController',
            'configurations/AddressFormController',
            'configurations/RuleConfigController',
            'configurations/RuleConfigMasterController',
            'configurations/RuleMakerController',
            'configurations/ConsumeLimitsController',
            'client/EditFamilyMemberController',
            'client/AddFamilyMembersController',
            'organization/BulkImportOfficesController',
            'client/BulkImportClientsController',
			'centers/BulkImportCentersController',
			'organization/BulkImportEmployeeController',
			'loanAccount/BulkImportLoanAccountsController',
            'loanAccount/BulkImportLoanRepaymentController',
            'loanAccount/BulkImportGuarantorController',
			'savings/BulkImportSavingsAccountController',
			'savings/BulkImportSavingsAccountsTransactionsController',
			'groups/BulkImportGroupController',
			'deposits/recurring/BulkImportRecurringDepositController',
            'deposits/recurring/BulkImportRecurringDepositTransactionsController',
			'shares/BulkImportShareAccountController',
			'deposits/fixed/BulkImportFixedDepositAccountsController',
			'deposits/fixed/BulkImportFixedDepositTransactionsController',
			'accounting/BulkImportCOAController',
			'accounting/BulkImportJournalEntriesController',
			'user/BulkImportUsersController',
			'adhocquery/AdHocQueryListController',
            'adhocquery/CreateAdHocQueryController',
            'adhocquery/ViewAdHocQueryController',
            'adhocquery/EditAdHocQueryController',
            'client/AgentsController',
            'client/CreateAgentController',
			'devices/AddDeviceController',
			'devices/DeviceController',
			'devices/EditDeviceController',
			'devices/ViewDeviceController',
			'kyccategory/CreateKycCategoryController',
			'kyccategory/KycCategoryController',
			'kyccategory/ViewKycCategoryController',
			'kyccategory/EditKycCategoryController',
			'couriers/CourierController',
			'couriers/ViewCourierController',
			'couriers/AddCourierController',
			'couriers/EditCourierController',
			'couriers/ViewCourierTransactionsController',
			'couriers/ViewSingleCourierTransactionController',
			'couriers/AddCourierTransactionsController',
			'organization/cashmgmt/CashTallyController',
			'organization/cashmgmt/CashTallyController',
			'vaults/VaultsController',
            'vaults/CreateVaultController',
            'vaults/ViewVaultController',
			'vaults/EditVaultController',
			'vaults/VaultTellersController',
			'vaults/RequestCashController',
			'vaults/SendCashController',
			'vaults/VaultTransactionsController',
			'vaults/ViewSingleVaultTransactionController',
			'vaults/AddVaultTransactionController',
            'Cards/CardController',
            'Cards/CardOperationsController',
            'Cards/CardSettlementController',
            'Cards/ViewClientCardInformationController',
            'Cards/ViewCardDetailedInfoController',
            'Cards/withdrawFunds'
        ],
        filters: [
            'StatusLookup',
            'DateFormat',
            'DayMonthFormat',
            'YesOrNo',
            'UrlToString',
            'sort',
            'DotRemove',
            'FormatNumber',
            'TranslateDataTableColumn',
            'SearchFilter',
            'AddUpTotalFor'
        ],
        directives: [
            'DialogDirective',
            'PanelDirective',
            'BigPanelDirective',
            'OnBlurDirective',
            'LateValidateDirective',
            'TreeviewDirective',
            'CkEditorDirective',
            'AutofocusDirective',
            'SummaryDirective',
            'FormValidateDirective',
            'FormSubmitValidateDirective',
            'ApiValidationDirective',
            'HasPermissionDirective',
            'ActivitiesDisplayPanelDirective',
            'ScrollbarTopDirective',
            'ChosenComboboxDirective',
            'NumberFormatDirective',
            'SuccessfulResponsesDirective',
            'TabsPersistenceDirective',
            'ScrollableDirective'
        ]
    };

    return function() {
      console.log();
        var defer = Q.defer();
        require(_.reduce(_.keys(components), function (list, group) {
            return list.concat(_.map(components[group], function (name) {
                return group + "/" + name;
            }));
        }, [
            'routes',
            'initialTasks',
            'webstorage-configuration'
        ]), function(){
            defer.resolve();
        });
        return defer.promise;
    }
});
