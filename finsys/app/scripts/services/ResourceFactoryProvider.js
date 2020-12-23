(function (module) {
    mifosX.services = _.extend(module, {
        ResourceFactoryProvider: function () {
            var baseUrl = "" , apiVer = "/fineract-provider/api/v1", tenantIdentifier = "";
            this.setBaseUrl = function (url) {
                baseUrl = url;
                console.log("New BaseURL >>>>> " + baseUrl);
            };
                console.log("New BaseURL >>>>> " + baseUrl);

            this.setTenantIdenetifier = function (tenant) {
                tenantIdentifier = tenant;
            }
            this.$get = ['$resource', '$rootScope', function (resource, $rootScope) {
                var defineResource = function (url, paramDefaults, actions) {
                    var tempUrl = baseUrl;
                    $rootScope.hostUrl = tempUrl;
                    $rootScope.tenantIdentifier = tenantIdentifier;
                    return resource(baseUrl + url, paramDefaults, actions);
                };
                return {
                    userResource: defineResource(apiVer + "/users/:userId", {userId: '@userId'}, {
                        getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true},
                        getUser: {method: 'GET', params: {}}
                    }),
                    roleResource: defineResource(apiVer + "/roles/:roleId", {roleId: '@roleId', command: '@command'}, {
                        getAllRoles: {method: 'GET', params: {}, isArray: true},
                        deleteRoles: {method: 'DELETE'},
                        disableRoles: {method: 'POST'},
                        enableRoles: {method: 'POST'}
                    }),
                    rolePermissionResource: defineResource(apiVer + "/roles/:roleId/permissions", {roleId: '@roleId'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    permissionResource: defineResource(apiVer + "/permissions", {}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT'}
                    }),
                    officeResource: defineResource(apiVer + "/offices/:officeId", {officeId: "@officeId"}, {
                        getAllOffices: {method: 'GET', params: {}, isArray: true},
                        getAllOfficesInAlphabeticalOrder: {method: 'GET', params: {orderBy: 'name', sortOrder: 'ASC'}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    officeTemplateResource: defineResource(apiVer + "/offices/template", {}, {
                    	template: {method: 'GET', params: {}, isArray: false}
                    }),
                    officeTypeResource: defineResource(apiVer + "/officetype/:officeTypeId", {officeTypeId: "@officeTypeId"}, {
                        getAllOfficeTypes: {method: 'GET', params: {}, isArray: true},
                        getOne: {method: 'GET', params: {}, isArray: false},
                        update: { method: 'PUT'},
                        delete: { method: 'DELETE'}
                    }),
                    officeTypeTemplateResource: defineResource(apiVer + "/officetype/template", {}, {
                    	template: {method: 'GET', params: {}, isArray: true}
                    }),
                    kycCategoryResource: defineResource(apiVer + "/kyccategory/:categoryId", {categoryId: "@categoryId"}, {
                        getAllCategories: {method: 'GET', params: {}, isArray: true},
                        getOne: {method: 'GET', params: {}, isArray: false},
                        update: { method: 'PUT'},
                        delete: { method: 'DELETE'}
                    }),
                    kycCategoryTemplateResource: defineResource(apiVer + "/kyccategory/template", {}, {
                    	template: {method: 'GET', params: {}, isArray: false}
                    }),
                    officeImportTemplateResource: defineResource(apiVer + "/offices/bulkimporttemplate", {}, {
                    		get: {method: 'GET', params: {}}
                    }),
                    importResource: defineResource(apiVer + "/imports", {}, {
                			getImports: {method: 'GET', params: {}, isArray: true}
                    }),
                    clientResource: defineResource(apiVer + "/clients/:clientId/:anotherresource", {clientId: '@clientId', anotherresource: '@anotherresource', sqlSearch: '@sqlSearch'}, {
                        getAllClients: {method: 'GET', params: {limit: 1000, sqlSearch: '@sqlSearch'}},
                        getAllClientsWithoutLimit: {method: 'GET', params: {}},
                        getClientClosureReasons: {method: 'GET', params: {}},
                        getAllClientDocuments: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    clientChargesResource: defineResource(apiVer + "/clients/:clientId/charges/:resourceType", {clientId: '@clientId', resourceType: '@resourceType'}, {
                        getCharges: {method: 'GET'},
                        waive:{method:'POST' , params:{command : 'waive'}}
                    }),
                    clientTransactionResource: defineResource(apiVer + "/clients/:clientId/transactions/:transactionId", {clientId: '@clientId', transactionId: '@transactionId'}, {
                        getTransactions: {method: 'GET',isArray: true},
                        undoTransaction :{method:'POST', params:{command:'undo'}}
                    }),
                    clientIdentifierResource: defineResource(apiVer + "/client_identifiers/:clientIdentityId/documents", {clientIdentityId: '@clientIdentityId'}, {
                        get: {method: 'GET', params: {}, isArray: true}
                    }),
                    clientDocumentsResource: defineResource(apiVer + "/clients/:clientId/documents/:documentId", {clientId: '@clientId', documentId: '@documentId'}, {
                        getAllClientDocuments: {method: 'GET', params: {}, isArray: true}
                    }),
                    clientAccountResource: defineResource(apiVer + "/clients/:clientId/accounts", {clientId: '@clientId'}, {
                        getAllClients: {method: 'GET', params: {}}
                    }),
                    clientNotesResource: defineResource(apiVer + "/clients/:clientId/notes/:noteId", {clientId: '@clientId', noteId: '@noteId'}, {
                        getAllNotes: {method: 'GET', params: {}, isArray: true},
                        delete:{method:'DELETE',params:{}},
                        put:{method:'PUT',params:{}}
                    }),
                    clientTemplateResource: defineResource(apiVer + "/clients/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    clientIdenfierTemplateResource: defineResource(apiVer + "/clients/:clientId/identifiers/template", {clientId: '@clientId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    clientIdenfierResource: defineResource(apiVer + "/clients/:clientId/identifiers/:id", {clientId: '@clientId', id: '@id'}, {
                        get: {method: 'GET', params: {}}
                    }),

                    surveyResource: defineResource(apiVer + "/surveys/:surveyId", {surveyId: '@surveyId'}, {
                        getAll: {method: 'GET', params: {}, isArray: true},
                        get: {method: 'GET', params: {surveyId: '@surveyId'}, isArray: false},
                        update: {method: 'PUT', params: {surveyId: '@surveyId'}},
                        activateOrDeactivate: {method: 'POST', params: {surveyId: '@surveyId',command: '@command'}},
                    }),
                    surveyScorecardResource: defineResource(apiVer + "/surveys/scorecards/:surveyId", {surveyId: '@surveyId'}, {
                        post: {method: 'POST', params: {}, isArray: false}
                    }),
                    clientSurveyScorecardResource: defineResource(apiVer + "/surveys/scorecards/clients/:clientId", {clientId: '@clientId'}, {
                        get: {method: 'GET', params: {clientId: '@clientId'}, isArray: true}
                    }),
                    groupResource: defineResource(apiVer + "/groups/:groupId/:anotherresource", {groupId: '@groupId', anotherresource: '@anotherresource'}, {
                        get: {method: 'GET', params: {}},
                        getAllGroups: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    groupSummaryResource: defineResource(apiVer + "/runreports/:reportSource", {reportSource: '@reportSource'}, {
                        getSummary: {method: 'GET', params: {}}
                    }),
                    groupAccountResource: defineResource(apiVer + "/groups/:groupId/accounts", {groupId: '@groupId'}, {
                        getAll: {method: 'GET', params: {}}
                    }),
                    groupNotesResource: defineResource(apiVer + "/groups/:groupId/notes/:noteId", {groupId: '@groupId', noteId: '@noteId'}, {
                        getAllNotes: {method: 'GET', params: {}, isArray: true}
                    }),
                    groupTemplateResource: defineResource(apiVer + "/groups/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    groupMeetingResource: defineResource(apiVer + "/groups/:groupId/meetings/:templateSource", {groupId: '@groupId', templateSource: '@templateSource'}, {
                        getMeetingInfo: {method: 'GET', params: {}}
                    }),
                    attachMeetingResource: defineResource(apiVer + "/:groupOrCenter/:groupOrCenterId/calendars/:templateSource", {groupOrCenter: '@groupOrCenter', groupOrCenterId: '@groupOrCenterId',
                        templateSource: '@templateSource'}, {
                        update: {method: 'PUT'}
                    }),
                    runReportsResource: defineResource(apiVer + "/runreports/:reportSource", {reportSource: '@reportSource'}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getReport: {method: 'GET', params: {}}
                    }),
                    reportsResource: defineResource(apiVer + "/reports/:id/:resourceType", {id: '@id', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {id: '@id'}},
                        getReport: {method: 'GET', params: {id: '@id'}, isArray: true},
                        getReportDetails: {method: 'GET', params: {id: '@id'}},
                        update: {method: 'PUT', params: {}}
                    }),
                    xbrlMixtaxonomyResource: defineResource(apiVer + "/mixtaxonomy", {}, {
                        get: {method: 'GET', params: {}, isArray: true}
                    }),
                    xbrlMixMappingResource: defineResource(apiVer + "/mixmapping", {}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    DataTablesResource: defineResource(apiVer + "/datatables/:datatablename/:entityId/:resourceId", {datatablename: '@datatablename', entityId: '@entityId', resourceId: '@resourceId'}, {
                        getAllDataTables: {method: 'GET', params: {}, isArray: true},
                        getTableDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    loanProductResource: defineResource(apiVer + "/loanproducts/:loanProductId/:resourceType", {resourceType: '@resourceType', loanProductId: '@loanProductId'}, {
                        getAllLoanProducts: {method: 'GET', params: {}, isArray: true},
                        getProductmix: {method: 'GET', params: {}},
                        put: {method: 'PUT', params: {}}
                    }),
                    chargeResource: defineResource(apiVer + "/charges/:chargeId", {chargeId: '@chargeId'}, {
                        getAllCharges: {method: 'GET', params: {}, isArray: true},
                        getCharge: {method: 'GET', params: {associations: 'all'}},
                        update: {method: 'PUT', params: {}}
                    }),
                    chargeTemplateResource: defineResource(apiVer + "/charges/template", {
                        get: {method: 'GET', params: {}, isArray: true},
                        getChargeTemplates: {method: 'GET', params: {}}
                    }),
                    savingProductResource: defineResource(apiVer + "/savingsproducts/:savingProductId/:resourceType", {savingProductId: '@savingProductId', resourceType: '@resourceType'}, {
                        getAllSavingProducts: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    fixedDepositProductResource: defineResource(apiVer + "/fixeddepositproducts/:productId/:resourceType", {productId: '@productId', resourceType: '@resourceType'}, {
                        getAllFixedDepositProducts: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    recurringDepositProductResource: defineResource(apiVer + "/recurringdepositproducts/:productId/:resourceType", {productId: '@productId', resourceType: '@resourceType'}, {
                        getAllRecurringDepositProducts: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),

                    interestRateChartResource: defineResource(apiVer + "/interestratecharts/:chartId/:resourceType", {chartId:'@chartId', resourceType:'@resourceType'}, {
                        getInterestRateChart: {method: 'GET', params: {productId:'@productId', template:'@template', associations:'@chartSlabs'} , isArray:true},
                        update: {method: 'PUT', params: {}},
                        getAllInterestRateCharts: {method: 'GET', params: {productId: '@productId'}, isArray: true}
                    }),
                    batchResource: defineResource(apiVer + "/batches", {}, {
                        post: {method: 'POST', params: {}, isArray: true}
                    }),
                    loanResource: defineResource(apiVer + "/loans/:loanId/:resourceType/:resourceId", {resourceType: '@resourceType', loanId: '@loanId', resourceId: '@resourceId', limit: '@limit', sqlSearch: '@sqlSearch'}, {
                        getAllLoans: {method: 'GET', params: {limit:'@limit', sqlSearch: '@sqlSearch'}},
                        getAllNotes: {method: 'GET', params: {}, isArray: true},
                        put: {method: 'PUT', params: {}}
                    }),
                    loanChargeTemplateResource: defineResource(apiVer + "/loans/:loanId/charges/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanChargesResource: defineResource(apiVer + "/loans/:loanId/charges/:chargeId", {loanId: '@loanId', chargeId: '@chargeId'}, {
                    }),
                    loanCollateralTemplateResource: defineResource(apiVer + "/loans/:loanId/collaterals/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanTrxnsTemplateResource: defineResource(apiVer + "/loans/:loanId/transactions/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanTemplateResource: defineResource(apiVer + "/loans/:loanId/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanTrxnsResource: defineResource(apiVer + "/loans/:loanId/transactions/:transactionId", {loanId: '@loanId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    LoanAccountResource: defineResource(apiVer + "/loans/:loanId/:resourceType/:chargeId", {loanId: '@loanId', resourceType: '@resourceType', chargeId: '@chargeId'}, {
                        getLoanAccountDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    LoanEditDisburseResource: defineResource(apiVer + "/loans/:loanId/disbursements/:disbursementId", {loanId: '@loanId', disbursementId: '@disbursementId'}, {
                        getLoanAccountDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    LoanAddTranchesResource: defineResource(apiVer + "/loans/:loanId/disbursements/editDisbursements", {loanId: '@loanId'}, {
                        update: {method: 'PUT'}
                    }),
                    LoanDocumentResource: defineResource(apiVer + "/loans/:loanId/documents/:documentId", {loanId: '@loanId', documentId: '@documentId'}, {
                        getLoanDocuments: {method: 'GET', params: {}, isArray: true}
                    }),
                    currencyConfigResource: defineResource(apiVer + "/currencies/:code", {code: '@code'}, {
                        get: {method: 'GET', params: {}},
                        getOne: {method: 'GET', params: {}, isArray: false},
                        update: { method: 'PUT'},
                        upd: { method: 'PUT', params: {}}
                    }),
                    userListResource: defineResource(apiVer + "/users/:userId", {userId: '@userId'}, {
                        getAllUsers: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT' }
                    }),
                    userTemplateResource: defineResource(apiVer + "/users/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    employeeResource: defineResource(apiVer + "/staff/:staffId", {staffId: '@staffId',status:"all"}, {
                        getAllEmployees: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT' }
                    }),
                    globalSearch: defineResource(apiVer + "/search", {query: '@query', resource: '@resource'}, {
                        search: { method: 'GET',
                            params: { query: '@query' , resource: '@resource'},
                            isArray: true
                        }
                    }),
                    globalSearchTemplateResource: defineResource(apiVer + "/search/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    globalAdHocSearchResource: defineResource(apiVer + "/search/advance/", {}, {
                        get: {method: 'GET', params: {}},
                        search: { method: 'POST', isArray: true },
                        getClientDetails : {method: 'POST', params: {clientInfo: true},isArray: true}
                    }),
                    fundsResource: defineResource(apiVer + "/funds/:fundId", {fundId: '@fundId'}, {
                        getAllFunds: {method: 'GET', params: {}, isArray: true},
                        getFund: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    accountingRulesResource: defineResource(apiVer + "/accountingrules/:accountingRuleId", {accountingRuleId: '@accountingRuleId'}, {
                        getAllRules: {method: 'GET', params: {associations: 'all'}, isArray: true},
                        getById: {method: 'GET', params: {accountingRuleId: '@accountingRuleId'}},
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT'}
                    }),
                    accountingRulesTemplateResource: defineResource(apiVer + "/accountingrules/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    accountCoaResource: defineResource(apiVer + "/glaccounts/:glAccountId", {glAccountId: '@glAccountId'}, {
                        getAllAccountCoas: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT' }
                    }),
                    accountCoaTemplateResource: defineResource(apiVer + "/glaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    journalEntriesResource: defineResource(apiVer + "/journalentries/:trxid", {trxid: '@transactionId'}, {
                        get: {method: 'GET', params: {transactionId: '@transactionId'}},
                        reverse: {method: 'POST', params: {command: 'reverse'}},
                        search: {method: 'GET', params: {}}
                    }),
                    accountingClosureResource: defineResource(apiVer + "/glclosures/:accId", {accId: "@accId"}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getView: {method: 'GET', params: {}}
                    }),
                    periodicAccrualAccountingResource: defineResource(apiVer + "/runaccruals", {}, {
                        run: {method: 'POST', params: {}}
                    }),
                    officeOpeningResource: defineResource(apiVer + "/journalentries/openingbalance", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    codeResources: defineResource(apiVer + "/codes/:codeId", {codeId: "@codeId"}, {
                        getAllCodes: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT', params: {} }
                    }),
                    codeValueResource: defineResource(apiVer + "/codes/:codeId/codevalues/:codevalueId", {codeId: '@codeId', codevalueId: '@codevalueId'}, {
                        getAllCodeValues: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT', params: {} }
                    }),
					hookResources: defineResource(apiVer + "/hooks/:hookId", {hookId: "@hookId"}, {
                        getAllHooks: {method: 'GET', params: {}, isArray: true},
                        getHook: {method: 'GET', params: {}},
						update: {method: 'PUT', params: {}}
                    }),
					hookTemplateResource: defineResource(apiVer + "/hooks/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    entityToEntityResource: defineResource(apiVer + "/entitytoentitymapping/:mappingId/:fromId/:toId", {mappingId: '@mappingId'}, {
                        getAllEntityMapping: {method: 'GET', params: {}, isArray: true},
                        getEntityMapValues: {method: 'GET', params: {}}
                    }),
                    entityMappingResource: defineResource(apiVer + "/entitytoentitymapping/:mapId", {mappingId: '@mappingId'}, {
                        getAllEntityMapping: {method: 'GET', params: {}, isArray: true},
                        getEntityMapValues: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT', params: {}},
                        delete:{method:'DELETE',params:{}}
                    }),
                    accountNumberResources: defineResource(apiVer + "/accountnumberformats/:accountNumberFormatId",{accountNumberFormatId: '@accountNumberFormatId'}, {
                        get:{method:'GET',params:{accountNumberFormatId:'@accountNumberFormatId'}},
                        getAllPreferences:{method:'GET',params:{},isArray: true},
                        put:{method:'PUT'},
                        getPrefixType:{method:'GET',params:{template:true}},
                        delete:{method:'DELETE',params:{}}
                    }),
                    accountNumberTemplateResource: defineResource(apiVer + "/accountnumberformats/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    holResource: defineResource(apiVer + "/holidays", {}, {
                        getAllHols: {method: 'GET', params: {}, isArray: true}
                    }),
                    holValueResource: defineResource(apiVer + "/holidays/:holId", {holId: '@holId'}, {
                        getholvalues: {method: 'GET', params: {}},
                        update: { method: 'PUT', params: {}}
                    }),
                    holidayTemplateResource: defineResource(apiVer + "/holidays/template", {}, {
                        get: {method: 'GET', params: {}, isArray: true}
                    }),
                    savingsTemplateResource: defineResource(apiVer + "/savingsaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    savingsResource: defineResource(apiVer + "/savingsaccounts/:accountId/:resourceType/:chargeId", {accountId: '@accountId', resourceType: '@resourceType', chargeId: '@chargeId'}, {
                        get: {method: 'GET', params: {}},
                        getAllNotes: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT'}
                    }),
                    savingsChargeResource: defineResource(apiVer + "/savingsaccounts/:accountId/charges/:resourceType", {accountId: '@accountId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    savingsTrxnsTemplateResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/template", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId'}}
                    }),
                    savingsTrxnsResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/:transactionId", {savingsId: '@savingsId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId', transactionId: '@transactionId'}}
                    }),
                    savingsTrxnReceiptResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/:transactionId/receipt", {savingsId: '@savingsId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId', transactionId: '@transactionId'}}
                    }),
                    savingsOnHoldTrxnsResource: defineResource(apiVer + "/savingsaccounts/:savingsId/onholdtransactions", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    fixedDepositAccountResource: defineResource(apiVer + "/fixeddepositaccounts/:accountId/:resourceType", {accountId: '@accountId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    fixedDepositAccountTemplateResource: defineResource(apiVer + "/fixeddepositaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    fixedDepositTrxnsTemplateResource: defineResource(apiVer + "/fixeddepositaccounts/:savingsId/transactions/template", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId'}}
                    }),
                    fixedDepositTrxnsResource: defineResource(apiVer + "/fixeddepositaccounts/:savingsId/transactions/:transactionId", {savingsId: '@savingsId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId', transactionId: '@transactionId'}}
                    }),
                    recurringDepositAccountResource: defineResource(apiVer + "/recurringdepositaccounts/:accountId/:resourceType", {accountId: '@accountId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    recurringDepositAccountTemplateResource: defineResource(apiVer + "/recurringdepositaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    recurringDepositTrxnsTemplateResource: defineResource(apiVer + "/recurringdepositaccounts/:savingsId/transactions/template", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId'}}
                    }),
                    recurringDepositTrxnsResource: defineResource(apiVer + "/recurringdepositaccounts/:savingsId/transactions/:transactionId", {savingsId: '@savingsId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId', transactionId: '@transactionId'}}
                    }),
                    accountTransferResource: defineResource(apiVer + "/accounttransfers/:transferId", {transferId: '@transferId'}, {
                        get: {method: 'GET', params: {transferId: '@transferId'}}
                    }),
                    accountTransfersTemplateResource: defineResource(apiVer + "/accounttransfers/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    standingInstructionResource: defineResource(apiVer + "/standinginstructions/:standingInstructionId", {standingInstructionId: '@standingInstructionId'}, {
                        get: {method: 'GET', params: {standingInstructionId: '@standingInstructionId'}},
                        getTransactions: {method: 'GET', params: {standingInstructionId: '@standingInstructionId', associations: 'transactions'}},
                        withTemplate: {method: 'GET', params: {standingInstructionId: '@standingInstructionId', associations: 'template'}},
                        search: {method: 'GET', params: {}},
                        update: { method: 'PUT', params: {command: 'update'}},
                        cancel: { method: 'PUT', params: {command: 'delete'}}
                    }),
                    standingInstructionTemplateResource: defineResource(apiVer + "/standinginstructions/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    standingInstructionHistoryResource: defineResource(apiVer + "/standinginstructionrunhistory", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    centerAccountResource: defineResource(apiVer + "/centers/:centerId/accounts", {centerId: '@centerId'}, {
                        getAll: {method: 'GET', params: {}, isArray: true}
                    }),
                    centerResource: defineResource(apiVer + "/centers/:centerId/:anotherresource", {centerId: '@centerId', anotherresource: '@anotherresource'}, {
                        get: {method: 'GET', params: {}},
                        getAllCenters: {method: 'GET', params: {}, isArray: true},
                        getAllMeetingFallCenters: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    centerMeetingResource: defineResource(apiVer + "/centers/:centerId/meetings/:templateSource", {centerId: '@centerId', templateSource: '@templateSource'}, {
                        getMeetingInfo: {method: 'GET', params: {}}
                    }),
                    centerTemplateResource: defineResource(apiVer + "/centers/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    jobsResource: defineResource(apiVer + "/jobs/:jobId/:resourceType", {jobId: '@jobId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getJobDetails: {method: 'GET', params: {}},
                        getJobHistory: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    schedulerResource: defineResource(apiVer + "/scheduler", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    assignStaffResource: defineResource(apiVer + "/groups/:groupOrCenterId", {groupOrCenterId: '@groupOrCenterId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    configurationResource: defineResource(apiVer + "/configurations/:id", {id: '@id'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    configurationResourceByName: defineResource(apiVer + "/configurations/", {configName: '@configName'}, {
                        get: {method: 'GET', params: {configName:'configName'}}
                    }),
                    cacheResource: defineResource(apiVer + "/caches", {}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    templateResource: defineResource(apiVer + "/templates/:templateId/:resourceType", {templateId: '@templateId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getTemplateDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    loanProductTemplateResource: defineResource(apiVer + "/loanproducts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanReassignmentResource: defineResource(apiVer + "/loans/loanreassignment/:templateSource", {templateSource: '@templateSource'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanRescheduleResource: defineResource(apiVer + "/rescheduleloans/:scheduleId",{scheduleId:'@scheduleId', command: '@command'},{
                     get: {method: 'GET',params:{}},
                     getAll: {method: 'GET', params: {}, isArray: true},
                     template: {method: 'GET',params:{}},
                     preview:{method:'GET',params:{command:'previewLoanReschedule'}},
                     put: {method: 'POST', params: {command:'reschedule'}},
                     reject:{method:'POST',params:{command:'reject'}},
                     approve:{method:'POST',params:{command:'approve'}}
                     }),
                     auditResource: defineResource(apiVer + "/audits/:templateResource", {templateResource: '@templateResource'}, {
                        get: {method: 'GET', params: {}},
                        search: {method: 'GET', params: {}, isArray: false}
                    }),
                    guarantorResource: defineResource(apiVer + "/loans/:loanId/guarantors/:templateResource", {loanId: '@loanId', templateResource: '@templateResource'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}},
                        delete: { method: 'DELETE', params: {guarantorFundingId: '@guarantorFundingId'}}
                    }),
                    guarantorAccountResource: defineResource(apiVer + "/loans/:loanId/guarantors/accounts/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {clientId: '@clientId'}},
                        update: {method: 'PUT', params: {}}
                    }),
                    checkerInboxResource: defineResource(apiVer + "/makercheckers/:templateResource", {templateResource: '@templateResource'}, {
                        get: {method: 'GET', params: {}},
                        search: {method: 'GET', params: {}, isArray: true}
                    }),
                    officeToGLAccountMappingResource: defineResource(apiVer + "/financialactivityaccounts/:mappingId", {mappingId: '@mappingId'}, {
                        get: {method: 'GET', params: {mappingId: '@mappingId'}},
                        getAll: {method: 'GET', params: {}, isArray: true},
                        withTemplate: {method: 'GET', params: {mappingId: '@mappingId', template: 'true'}},
                        search: {method: 'GET', params: {}},
                        create: {method: 'POST', params: {}},
                        update: { method: 'PUT', params: {mappingId: '@mappingId'}},
                        delete: { method: 'DELETE', params: {mappingId: '@mappingId'}}
                    }),
                    officeToGLAccountMappingTemplateResource: defineResource(apiVer + "/financialactivityaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    tellerResource: defineResource(apiVer + "/tellers/:tellerId", {tellerId: "@tellerId"}, {
                        getAllTellers: {method: 'GET', params: {}, isArray: true},
                        get: {method: 'GET', params: {tellerId: '@tellerId'}},
                        update: { method: 'PUT', params: {tellerId: '@tellerId'}},
                        delete: { method: 'DELETE', params: {tellerId: '@tellerId'}}
                    }),
                    tellersTemplateResource: defineResource(apiVer + "/tellers/template", {}, {
					    template: {method: 'GET', params: {}}
                    }),
                    tellerCashierResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        getAllCashiersForTeller: {method: 'GET', params: {tellerId: "@tellerId"}, isArray: false},
                        getCashier: {method: 'GET', params:{tellerId: "@tellerId", cashierId: "@cashierId"}},
                        update: { method: 'PUT', params: {tellerId: "@tellerId", cashierId: "@cashierId"}},
                        delete: { method: 'DELETE', params: {tellerId: "@tellerId", cashierId: "@cashierId"}}
                    }),
                    tellerCashierTemplateResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/template", {tellerId: "@tellerId"}, {
                        get: {method: 'GET', params: {tellerId: '@tellerId'}, isArray: false}
                    }),
                    tellerCashierTxnsResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/transactions", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        getCashierTransactions: {method: 'GET', params: {tellerId: "@tellerId", cashierId: "@cashierId"}, isArray: true}
                    }),
                    tellerCashierSummaryAndTxnsResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/summaryandtransactions", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        getCashierSummaryAndTransactions: {method: 'GET', params: {tellerId: "@tellerId", cashierId: "@cashierId"}, isArray: false}
                    }),
                    tellerCashierTxnsAllocateResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/allocate", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        allocate: { method: 'POST', params: {tellerId: "@tellerId", cashierId: "@cashierId", command: "allocate"}}
                    }),
                    tellerCashierTxnsSettleResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/settle", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        settle: { method: 'POST', params: {tellerId: "@tellerId", cashierId: "@cashierId", command: "settle"}}
                    }),
                    cashierTxnTemplateResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/transactions/template", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        get: {method: 'GET', params: {tellerId: "@tellerId", cashierId: "@cashierId"}, isArray: false}
                    }),
                    collectionSheetResource: defineResource(apiVer + "/collectionsheet", {}, {
                    }),
                    workingDaysResource: defineResource(apiVer + "/workingdays", {}, {
                        get: {method: 'GET', params: {}},
                        put: {method: 'PUT', params:{}}
                    }),
                    workingDaysResourceTemplate: defineResource(apiVer + "/workingdays/template", {}, {
                       get: {method: 'GET', params: {}}
                    }),
                    passwordPrefTemplateResource: defineResource(apiVer + "/passwordpreferences/template", {}, {
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    passwordPrefResource : defineResource(apiVer + "/passwordpreferences", {}, {
                        put: {method: 'PUT', params:{}}
                    }),
                    paymentTypeResource: defineResource(apiVer + "/paymenttypes/:paymentTypeId", {paymentTypeId: "@paymentTypeId"}, {
                        getAll: {method: 'GET', params: {}, isArray: true},
                        get: {method: 'GET' , params: {paymentTypeId: '@paymentTypeId'}},
                        update: {method: 'PUT', params: {paymentTypeId: '@paymentTypeId'}}
                    }),
                    paymentTypeLeafResource: defineResource(apiVer + "/paymenttypes/leaf", {}, {
                    	getAll: {method: 'GET', params: {}, isArray: true}
                    }),
                    paymentTypeTemplateResource: defineResource(apiVer + "/paymenttypes/template", {}, {
                    	template: {method: 'GET', params: {}, isArray: false}
                    }),
                    notificationsResource: defineResource(apiVer + "/notifications", {},{
                        getAllNotifications: {method: 'GET', params: {isRead: true, sqlSearch: '@sqlSearch'}},
                        getAllUnreadNotifications: {method: 'GET', params: {isRead: false, sqlSearch: '@sqlSearch'}},
                        update: {method: 'PUT', params:{}}
                    }),
                    externalServicesS3Resource: defineResource(apiVer + "/externalservice/S3", {},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    externalServicesSMTPResource: defineResource(apiVer + "/externalservice/SMTP", {},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    externalServicesNotificationResource: defineResource(apiVer + "/externalservice/NOTIFICATION", {},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    externalServicesResource: defineResource(apiVer + "/externalservice/:id", {id: '@id'},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    clientaddressFields:defineResource(apiVer+"/client/addresses/template",{},{
                            get:{method:'GET',params:{}}
                        }
                    ),
                    addressFieldConfiguration:defineResource(apiVer+"/fieldconfiguration/:entity",{},{
                        get:{method:'GET',params:{},isArray:true }
                    }),
                    clientAddress:defineResource(apiVer+"/client/:clientId/addresses",{},{

                        post:{method:'POST',params:{type:'@type'}},
                        get:{method:'GET',params:{type:'@type',status:'@status'},isArray:true},
                        put:{method:'PUT',params:{}}
                    }),
                    officeAddress:defineResource(apiVer+"/office/:officeId/addresses",{officeId :'@officeId'},{
                        post:{method:'POST',params:{type:'@type'}},
                        get:{method:'GET',params:{type:'@type',status:'@status'},isArray:true},
                        put:{method:'PUT',params:{}}
                    }),
                    familyMember:defineResource(apiVer+"/clients/:clientId/familymembers/:clientFamilyMemberId",{},{

                        get:{method: 'GET',params:{} },
                        delete:{method: 'DELETE',params:{}},
                            put:{method:'PUT',params:{}}

                    }),
                    familyMembers:defineResource(apiVer+"/clients/:clientId/familymembers/",{},{

                        get:{method: 'GET',isArray: true },
                        post:{method:'POST',params:{}}


                    }),
                    familyMemberTemplate:defineResource(apiVer+"/clients/:clientId/familymembers/template",{},{
                        get:{method: 'GET',params:{}}
                    }),
                   provisioningcriteria: defineResource(apiVer + "/provisioningcriteria/:criteriaId",{criteriaId:'@criteriaId'},{
                         get: {method: 'GET',params:{}},
                        getAll: {method: 'GET',params:{}, isArray : true},
                        template: {method: 'GET',params:{}},
                        post:{method:'POST',params:{}},
                        put: {method: 'PUT', params: {}}
                    }),
                    provisioningentries: defineResource(apiVer + "/provisioningentries/:entryId",{entryId:'@entryId'},{
                        get: {method: 'GET',params:{}},
                        getAll: {method: 'GET',params:{}},
                        template: {method: 'GET',params:{}},
                        post:{method:'POST',params:{}},
                        put: {method: 'PUT', params: {}},
                        createJournals:{method:'POST', params:{command : 'createjournalentry'}},
                        reCreateProvisioningEntries:{method:'POST', params:{command : 'recreateprovisioningentry'}},
                        getJournals: {method: 'GET', params: {entryId: '@entryId'}}
                    }),
                    provisioningjournals: defineResource(apiVer + "/journalentries/provisioning", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    provisioningentriesSearch: defineResource(apiVer + "/provisioningentries/entries", {}, {
                        get: {method: 'GET', params: {}}
                    }),

                    provisioningcategory: defineResource(apiVer + "/provisioningcategory", {}, {
                        getAll: {method: 'GET', params: {}, isArray : true}
                    }),

                    floatingrates: defineResource(apiVer + "/floatingrates/:floatingRateId",{floatingRateId:'@floatingRateId'},{
                        get: {method: 'GET',params:{}},
                        getAll: {method: 'GET',params:{}, isArray : true},
                        post:{method:'POST',params:{}},
                        put: {method: 'PUT', params: {}}
                    }),
                    variableinstallments: defineResource(apiVer + "/loans/:loanId/schedule",{loanId:'@loanId'},{
                        validate:{method:'POST',params:{command: 'calculateLoanSchedule'}},
                        addVariations:{method:'POST',params:{command: 'addVariations'}},
                        deleteVariations:{method:'POST',params:{command: 'deleteVariations'}}
                    }),
                    taxcomponent: defineResource(apiVer + "/taxes/component/:taxComponentId",{taxComponentId:'@taxComponentId'},{
                        getAll: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params: {}}
                    }),
                    taxcomponenttemplate: defineResource(apiVer + "/taxes/component/template",{},{
                    }),
                    taxgroup: defineResource(apiVer + "/taxes/group/:taxGroupId",{taxGroupId:'@taxGroupId'},{
                        getAll: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params: {}}
                    }),
                    taxgrouptemplate: defineResource(apiVer + "/taxes/group/template",{},{
                    }),

                    productsResource: defineResource(apiVer + "/products/:productType/:resourceType",{productType:'@productType', resourceType:'@resourceType'},{
                        template: {method: 'GET',params:{}},
                        post: {method: 'POST', params:{}}
                    }),
                    shareProduct: defineResource(apiVer + "/products/share/:shareProductId",{shareProductId:'@shareProductId'},{
                        post:{method:'POST',params:{}},
                        getAll: {method: 'GET',params:{}},
                        get: {method: 'GET', params:{}},
                        put: {method: 'PUT', params:{}}
                    }),
                    shareAccountTemplateResource: defineResource(apiVer + "/accounts/share/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    sharesAccount: defineResource(apiVer + "/accounts/share/:shareAccountId", {shareAccountId: '@shareAccountId'}, {
                        get: {method: 'GET', params: {}},
                        post: {method: 'POST', params:{}},
                        put: {method: 'PUT', params:{}}
                    }),
                    shareproductdividendresource: defineResource(apiVer + "/shareproduct/:productId/dividend/:dividendId", {productId: '@productId', dividendId: '@dividendId'}, {
                        get: {method: 'GET', params: {}},
                        getAll: {method: 'GET',params:{}},
                        post: {method: 'POST', params:{}},
                        put: {method: 'PUT', params:{}},
                        approve: {method: 'PUT', params:{command: 'approve'}}
                    }),

                    smsCampaignTemplateResource: defineResource(apiVer + "/smscampaigns/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),

                    smsCampaignResource: defineResource(apiVer + "/smscampaigns/:campaignId/:additionalParam", {campaignId: '@campaignId', additionalParam: '@additionalParam'}, {
                        getAll: {method: 'GET', params: {}},
                        get: {method: 'GET', params: {}},
                        save: {method: 'POST', params: {}},
                        update: {method: 'PUT', params: {}},
                        preview: {method: 'POST', params: {}},
                        withCommand: {method: 'POST', params: {}},
                        delete: {method: 'DELETE', params: {}}
                    }),

                    smsResource: defineResource(apiVer + "/sms/:campaignId/messageByStatus", {campaignId: '@campaignId', additionalParam: '@additionalParam'}, {
                        getByStatus: {method: 'GET', params:{}}
                    }),

                    entityDatatableChecksResource: defineResource(apiVer + "/entityDatatableChecks/:entityDatatableCheckId/:additionalParam", {entityDatatableCheckId: '@entityDatatableCheckId', additionalParam: '@additionalParam'}, {
                        getAll: {method: 'GET', params: {}},
                        get: {method: 'GET', params: {}},
                        save: {method: 'POST', params: {}},
                        delete: {method: 'DELETE', params: {}}
                    }),

					adHocQueryResource: defineResource(apiVer + "/adhocquery/:adHocId", {adHocId: '@adHocId'}, {
                        getAllAdHocQuery: {method: 'GET', params: {}, isArray: true},
                        disableAdHocQuery: {method: 'POST'},
                        enableAdHocQuery: {method: 'POST'},
                        update: { method: 'PUT' }
                    }),
                    adHocQueryTemplateResource: defineResource(apiVer + "/adhocquery/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                     commissionResource: defineResource(apiVer + "/commissions/:commissionId", {commissionId: '@commissionId'}, {
                        getAllCommissions: {method: 'GET', params: {}, isArray: true},
                        getCommission: {method: 'GET'},
                        update: {method: 'PUT', params: {}}
                    }),

                    twoFactorResource: defineResource(apiVer+"/twofactor", {deliveryMethod: "@deliveryMethod", extendedToken: "@extendedToken"}, {
                        getDeliveryMethods: {method: 'GET', params: {}, isArray: true},
                        requestOTP: {method: 'POST', params: {deliveryMethod: "@deliveryMethod", extendedToken: "@extendedToken"}}
                    }),
                    twoFactorConfigResource: defineResource(apiVer+"/twofactor/configure", {}, {
                        getAllConfigs: {method: 'GET', params: {}},
                        put: {method: 'PUT', params: {}}
                    }),
                    chargeSlabResource: defineResource(apiVer+"/charge/:chargeId/chargeslabs/:chargeSlabId", {chargeId : "@chargeId", chargeSlabId:"@chargeSlabId"}, {
                        getAllChargeSlabs: {method: 'GET', params: {}, isArray :true},
                        put: {method: 'PUT', params: {}}
                    }),
                    chargeExemptionResource: defineResource(apiVer+"/charge/:chargeId/chargeexemption/:chargeExemptionId", {chargeId : "@chargeId", chargeExemptionId:"@chargeExemptionId"}, {
                        put: {method: 'PUT', params: {}}
                    }),
                    ruleMasterResource: defineResource(apiVer+"/ruleconfig/master/:category",{category: "@category"},{
                        getAll: {method: 'GET', params: {}, isArray :true}
                    }),
                    ruleConfigResource: defineResource(apiVer+"/ruleconfig/:entityName/:category/:categoryId",
                        {entityName : "@entityName", category : "@category", categoryId :"@categoryId"},{
                        getAll: {method: 'GET', params: {}, isArray :true}
                    }),
                    consumeLimitsResource: defineResource(apiVer+"/:entityName/:entityId/consumelimits",{entityName: "@entityName",entityId: "@entityId"},{
                        getAll: {method: 'GET', params: {}, isArray :true}
                    }),
                    consumeLimitSummaryResource: defineResource(apiVer+"/consumelimits/summary",{},{
                        getAll: {method: 'GET', params: {}, isArray :true}
                    }),
                    userDeviceResource: defineResource(apiVer+"/userdevice/:deviceId", {deviceId:"@deviceId"}, {
					    getAll: {method: 'GET', params: {}, isArray :true},
					    update:{method:'PUT', params:{}},	
					    get:{method:'GET', params:{}},
					    delete: {method: 'DELETE', params: {}}
					}),
					userDeviceTemplateResource: defineResource(apiVer + "/userdevice/template", {}, {
					    getAll: {method: 'GET', params: {}, isArray :false}
                    }),
                    couriersResource: defineResource(apiVer + "/couriers/:courierId", {courierId:"@courierId"}, {
                    	save: {method: 'POST', params: {}},
                    	get:{method:'GET', params:{}}, 
                    	put: {method: 'PUT', params: {}},
                    	delete: {method: 'DELETE', params: {}},
					    getAll: {method: 'GET', params: {}, isArray :true}
                    }),
                    couriersTemplateResource: defineResource(apiVer + "/couriers/template", {}, {
					    template: {method: 'GET', params: {}, isArray :false}
                    }),
                    courierTransactionsResource: defineResource(apiVer + "/couriers/:courierId/transactions/:id", {courierId:"@courierId", id:"@id", sqlSearch: '@sqlSearch'}, {
                    	save: {method: 'POST', params: {}},
                    	put: {method: 'PUT', params: {}},
                    	getTransactionHistory: {method: 'GET', params: {}},
                    	get:{method:'GET', params:{}},
                    	delete: {method: 'DELETE', params: {}},
                    	getAll: {method: 'GET', params:{}, isArray :false}
                    }),
                    vaultsResource: defineResource(apiVer + "/vaults/:vaultId", {vaultId:"@vaultId"}, {
                    	save: {method: 'POST', params: {}},
                    	get:{method:'GET', params:{}}, 
                    	update: {method: 'PUT', params: {}},
					    getAll: {method: 'GET', params: {}, isArray :true}
                    }),
                    vaultsTemplateResource: defineResource(apiVer + "/vaults/template", {}, {
					    template: {method: 'GET', params: {}, isArray :false}
                    }),
                    vaultTransactionsResource: defineResource(apiVer + "/vaults/:vaultId/transactions/:id", {vaultId:"@vaultId", id:"@id", sqlSearch: '@sqlSearch'}, {
                    	save: {method: 'POST', params: {}},
                    	put: {method: 'PUT', params: {}},
                    	getTransactionHistory: {method: 'GET', params: {}},
                    	get:{method:'GET', params:{}},
                    	delete: {method: 'DELETE', params: {}},
                    	getAll: {method: 'GET', params:{}, isArray :false}
                    }),
                    vaultsTransactionsTemplateResource: defineResource(apiVer + "/vaults/:vaultId/transactions/template", {vaultId:"@vaultId"}, {
					    template: {method: 'GET', params: {}, isArray :false}
                    }),
                    couriersTransactionsTemplateResource: defineResource(apiVer + "/couriers/:courierId/transactions/:courierTransactionId/template", {courierId:"@courierId", courierTransactionId:"@courierTransactionId"}, {
					    template: {method: 'GET', params: {}, isArray :false}
                    }),
                    transactionAuthResource: defineResource(apiVer + "/tranAuth/:auditId", {auditId:"@auditId"}, {
                    }),

                    //Get UnApproved Cards - Newly Uploaded Bashes
                    getCardsResource: defineResource(apiVer + "/cardbatch/approval", {}, {
                        unApprovedCards: {method: 'GET', params: {}, isArray: true},
                    }),

                    //Save Approved Cards
                    saveApprovedCardsResource: defineResource(apiVer + "/cardbatch/approvecard", {}, {
                        save: {method: 'POST', params: {}},
                    }),
                    //Get Approved Cards - Newly Approved Cards
                    getApprovedCardsResource: defineResource(apiVer + "/cardbatch/searchbyseq?start=:start&end=:end", {start:'@start',end:'@end'},{
                        approvedCards: {method: 'GET', params: {}, isArray: false}, //get approved Cards
                    }),

                    //https://localhost:444/fineract-provider/api/v1/cardbatch/searchbyseq?end=0904&start=0901
                    //Get All Agents to assign Cards to
                    agentsResource: defineResource(apiVer + "/getAllAgents", {}, {
                        getAllAgents: {method: 'GET', params: {}, isArray: true},
                    }),

                    assignCardsSeqResource: defineResource(apiVer + "/cardbatch/assigncardseqs", {}, {
                        assignCardsSeq: {method: 'POST', params: {}, isArray: false},
                    }),

                    assignCardsToAgentsResource: defineResource(apiVer + "/cardbatch/assigncard",{}, {
                        assignCards: {method: 'POST', params: {}, isArray: false},
                    }),

                    //Get Assigned Cards to Dispatch
                    getAssignedCardsResource: defineResource(apiVer + "/cardbatch/dispatch",  {}, {
                        assignedCards: {method: 'GET', params: {}, isArray: true}, //get approved Cards
                    }),
                    //Dispatch Cards to Reciepients
                    dispatchCardsResource: defineResource(apiVer + "/cardbatch/dispatchcard", {}, {
                        dispatch: {method: 'POST', params: {}, isArray: false}, //send Cards
                    }),

                    //get Client Balance

                    //cardoperations/34/transactions/cardbalance/
                    // cardoperations/446/transactions/cardbalance
                    getBalanceResource: defineResource(apiVer + "/cardoperations/:clientId/transactions/cardbalance?seqNo=:seqNo",{clientId:'@clientId',seqNo:'@seqNo'}, {
                        getBalance: {method: 'GET',params:{},isArray: false},
                    }),
                    // cardoperations/linkcard?clientId=16
                    linkCardResource: defineResource(apiVer + "/cardoperations/linkcard?clientId=:clientId",{clientId:'@clientId'}, {
                        linkCardToClient: {method: 'POST',params:{},isArray: false},
                    }),
                    blockCardResource: defineResource(apiVer + "/cardoperations/blockCard?clientId=:clientId",{clientId:'@clientId'}, {
                        blockCard: {method: 'PUT',params:{},isArray: true},
                    }),
                    resetClientCardPasswordResource: defineResource(apiVer + "/cardoperations/resetpassword?clientId=:clientId",{clientId:'@clientId'}, {
                        resetPassword: {method: 'PUT',params:{},isArray: false},
                    }),
                    ///cardoperations/oper?clientId=4&command=resetpin&seqNo=XXXXXX
                    restCardPinResource: defineResource(apiVer + "/cardoperations/oper?clientId=:clientId&command=resetpin&seqNo=:seqNo",{clientId:'@clientId',seqNo:'@seqNo'}, {
                        resetPin: {method: 'POST',params:{},isArray: false},
                    }),
                    getCardDetailResource: defineResource(apiVer + "/cardoperations?clientId=:clientId",{clientId: '@clientId'},{
                        getCard:{isArray: false,method: 'GET', params:{}},
                    }),
                    getCardDetailedInformationResource:defineResource(apiVer + "/cardoperations/cardinfo?seqNo=:seqNo",{seqNo: '@seqNo'},{
                        cardDetails:{isArray: false,method: 'GET', params:{}},
                    }),
                    getTransInfo:defineResource(apiVer + "/cardoperations/cardtxn?seqNo=:seqNo",{seqNo: '@seqNo'},{
                        tansInfo:{isArray: false,method: 'GET', params:{}},
                    }),
                    getTransInformation:defineResource(apiVer + "/cardoperations/cardTrans?seqNo=:seqNo",{seqNo: '@seqNo'},{
                        tansInformation:{isArray: false,method: 'POST', params:{}},
                    }),
                    //https://finsys.app/fineract-provider/api/v1/cardoperations/cardTrans?seqNo=00000252
                    //cardoperations/34/transactions?command=loadcard
                    loadCardResource: defineResource(apiVer + "/cardoperations/:clientId/transactions?command=loadcard&seqNo=:seqNo",{clientId:'@clientId',seqNo:'@seqNo'}, {
                        loadCard:{isArray:false,method:'POST',params:{}},
                    }),
                    deductCardResource: defineResource(apiVer + "/cardoperations/:clientId/transactions?command=deductCard&seqNo=:seqNo",{clientId:'@clientId',seqNo:'@seqNo'}, {
                        deductCard:{isArray:false,method:'POST',params:{}},
                    }),
                    //cardoperations/34/transactions?command=postCharge&feetype=3
                    postChargeResoure: defineResource(apiVer + "/cardoperations/:clientId/transactions?command=postCharge&feetype=:feetype&seqNo=:seqNo",{clientId:'@clientId',feetype:'@feetype',seqNo:'@seqNo'}, {
                        postCharge:{isArray:false,method:'POST',params:{}},
                    }),
                    //Get Profile Balance ===>cardoperations/84/transactions/profilebalance
                    getProfileBalanceResource:defineResource(apiVer + "/cardoperations/:clientId/transactions/profilebalance",{clientId:'@clientId'},{
                        profileBalance:{isArray: false,method: 'GET', params:{}},
                    }),
                    cardTocardTransactionResource: defineResource(apiVer+
                        "/cardoperations/:clientId/transactions/c2c?fromSeqNo=:fromSeqNo&toSeqNo=:toSeqNo",
                        {clientId:'@clientId',fromSeqNo:'@fromSeqNo',toSeqNo:'@toSeqNo'},{
                        cardToCardTransfer:{isArray: false, method: 'POST', params:{}},
                    }),
                    ///cardoperations/transactions/p2p?from=8288339784&to=6219555239
                    profileToProfileResource: defineResource(apiVer+ "/cardoperations/p2p?from=:fromProfile&to=:toProfile", {},{
                       profileToProfileTransfer: {isArray:false, method: 'POST', params: {fromProfile:'@fromProfile',toProfile:'@toProfile'}},
                    }),
                    // cardoperations/updateProfile
                    mapProfileToGlAccountResource: defineResource(apiVer+ "/cardoperations/updateProfile", {},{
                        mapToGlAccount: {isArray:false, method: 'POST', params: {}},
                    }),
                    ///cardoperations/oper?clientId=481&command=block&seqNo=00000340
                    stopCardResource: defineResource(apiVer+ "/cardoperations/oper?clientId=:clientId&command=block&seqNo=:seqNo",
                        {},{
                        stopCard: {isArray:false, method: 'POST', params: {clientId:'@clientId',seqNo:'@seqNo'}},
                    }),
                    //cardoperations/oper?clientId=481&command=cancelblock&seqNo=00000340
                    cancelStopCardResource: defineResource(apiVer+ "/cardoperations/oper?clientId=:clientId&command=cancelblock&seqNo=:seqNo",
                        {},{
                            cancelStopCard: {isArray:false, method: 'POST', params: {clientId:'@clientId',seqNo:'@seqNo'}},
                    }),
                    //delinkCard?seqNo=XXX&profileNo=XXX
                    delinkCardResource: defineResource(apiVer+ "/cardoperations/delinkCard?seqNo=:seqNo&profileNo=:profileNo", {},{
                            delinkCard: {isArray:false, method: 'POST', params: {seqNo:'@seqNo',profileNo:'@profileNo'}},
                    }),
                    //https://finsys.app/fineract-provider/api/v1/cardoperations/profileSummary?profileNo=3
                    profileSummaryResource: defineResource(apiVer+ "/cardoperations/profileSummary?profileNo=:profileNo", {},{
                        profileSummary: {isArray:false, method: 'GET', params: {}},
                    }),
                    profileBalanceResource: defineResource(apiVer+ "/cardoperations/profilebalance?ProfileNo=:profileNo", {},{
                        profileBalance: {isArray:false, method: 'GET', params: {}},
                    }), //https://finsys.app/fineract-provider/api/v1/cardoperations/bulkCardSummary?profileNo=62195552391
                    uploadedSummaryResource: defineResource(apiVer+ "/cardoperations/bulkCardSummary?profileNo=:profileNo", {},{
                        uploadedSummary: {isArray:false, method: 'GET', params: {}},
                    }),//https://finsys.app/fineract-provider/api/v1/cardoperations/loadDeductCancelBulkCards
                    batchDeductLoadResource: defineResource(apiVer+ "/cardoperations/loadDeductCancelBulkCards", {},{
                        batchDeductLoad: {isArray:false, method: 'POST', params: {}},
                    }), //https://finsys.app/fineract-provider/api/v1/cardoperations/cardreplacement
                    replaceCardResource: defineResource(apiVer+ "/cardoperations/cardreplacement", {},{
                        replaceCard: {isArray:false, method: 'POST', params: {}},
                    }),
                    linFacilityTemplateResource: defineResource(apiVer+ "/linefacilityproducts/template", {},{
                        lineFacilityTemplate: {isArray:false, method: 'GET', params: {}},
                    }),
                    getLineFacilityProductsResource: defineResource(apiVer+ "/linefacilityproducts", {},{
                        getLineFacilityProducts: {isArray:true, method: 'GET', params: {}},
                        saveLineFacilityProduct: {isArray:false, method: 'POST', params: {}},
                    }),
                    searchLineFacilityProductResource: defineResource(apiVer+ "/linefacilityproducts/:id", {},{
                        searchLineFacilityProduct: {isArray:false, method: 'GET', params: {}},
                        updateLineProduct:{isArray:false, method: 'PUT', params: {}},
                    }),
                    lineFacilityAccountsTempResource: defineResource(apiVer+ "/linefacilityaccount/template", {},{
                        getAccounts: {isArray:true, method: 'GET', params: {}},
                    }),
                    savingsAccountsLineFacility: defineResource(apiVer+ "/linefacilityaccounts/facilitybysavingsId?savingsAccount=:savingsAccount", {},{
                        get: {isArray:false, method: 'GET', params: {}},
                    }),
                    lineFacilityContractResource: defineResource(apiVer+ "/linefacilityaccounts", {},{
                        saveContract: {isArray:false, method: 'POST', params: {}},
                        getContracts: {isArray:true, method: 'GET', params: {}},
                        getLineContract: {isArray:false, method: 'GET', params: {}},

                    }), //
                    approveLineFacilityContractResource: defineResource(apiVer+ "/linefacilityaccounts/contract/:id", {},{
                        approve: {isArray:false, method: 'POST', params: {}},
                        disburse: {isArray:false, method: 'POST', params: {}},
                    }),
                    withdrawFromFacilityAccountResource: defineResource(apiVer+ "/savingsaccounts/:accountId/transactions?command=withdrawal", {},{
                        withdraw: {isArray:false, method: 'POST', params: {}},
                    }),
                    updateLineFacilityContractResource: defineResource(apiVer+ "/linefacilityaccount/:id", {},{
                        update: {isArray:false, method: 'PUT', params: {}},
                    }),
                };
            }];
        }
    });
    mifosX.ng.services.config(function ($provide) {
        $provide.provider('ResourceFactory', mifosX.services.ResourceFactoryProvider);
    }).run(function ($log) {
        $log.info("ResourceFactory initialized");
    });
}(mifosX.services || {}));
