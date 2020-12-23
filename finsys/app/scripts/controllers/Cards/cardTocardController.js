(function (module) {
    mifosX.controllers = _.extend(module, {
        cardToCardController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope,dateFilter, Upload,localStorageService) {
            let linkVar ='#cardOperationsDetailedInfo/'+localStorageService.getFromLocalStorage('clickedClientID');
            angular.element('#getBack').attr('href',linkVar);
            scope.accountId = localStorageService.getFromLocalStorage('accntID');

            scope.formData={};
            scope.first = {};
            scope.first.date = new Date();
            scope.first.transactionDate = new Date ();
            //console.log(scope.first);

            /*resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                scope.paymentTypes = data.paymentTypeOptions;
               // console.log(data);
               // console.log(scope.paymentTypes);
            }); */
            scope.paymentTypes =    [];
            resourceFactory.paymentTypeLeafResource.getAll({},function(data){
                scope.paymentTypes = data;
            });

            resourceFactory.clientResource.get({clientId: localStorageService.getFromLocalStorage('clientId')}, function (data) {
                scope.client = data;
               // console.log(scope.client);
            });

            resourceFactory.getCardDetailResource.getCard({clientId: localStorageService.getFromLocalStorage('clientId')},function (data) {
                scope.clientCards = data.data;
                //console.log(scope.clientCards);
            });

            scope.convertDateArrayToObject = function(dateFieldName){
                for(var i in scope.savingaccountdetails.transactions){
                    scope.savingaccountdetails.transactions[i][dateFieldName] = new Date(scope.savingaccountdetails.transactions[i].date);
                }
            };
            scope.savingaccountdetails = [];
            resourceFactory.savingsResource.get({accountId: localStorageService.getFromLocalStorage('accntID'), associations: 'all'}, function (data) {
                scope.savingaccountdetails = data;
                //localStorageService.addToLocalStorage('acc',scope.savingaccountdetails);
               // console.log(data);
                scope.convertDateArrayToObject('date');
                scope.savingaccountdetails.availableBalance = scope.savingaccountdetails.enforceMinRequiredBalance?(scope.savingaccountdetails.summary.accountBalance - scope.savingaccountdetails.minRequiredOpeningBalance):scope.savingaccountdetails.summary.accountBalance;
                scope.transDetails = data.transactions;

                //console.log( scope.transDetails);
            });

            scope.transactionSort = {
                column: 'id',
                descending: true
            };
            var params = {fromAccountId: scope.savingaccountdetails.id};
            resourceFactory.accountTransfersTemplateResource.get(params, function (data) {
               // console.log(data);
                scope.transfer = data;
                scope.toOffices = data.toOfficeOptions;
                scope.toAccountTypes = data.toAccountTypeOptions;
                scope.formData.transferAmount = data.transferAmount;
            });
            scope.changeEvent = function () {

                var params = scope.formData;
                delete params.transferAmount;
                delete params.transferDate;
                delete params.transferDescription;

                resourceFactory.accountTransfersTemplateResource.get(params, function (data) {
                   // console.log(data);
                    scope.transfer = data;
                    scope.toOffices = data.toOfficeOptions;
                    scope.toAccountTypes = data.toAccountTypeOptions;
                    scope.toClients = data.toClientOptions;
                    scope.toAccounts = data.toAccountOptions;
                    scope.formData.transferAmount = data.transferAmount;
                });
            };
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.officesarr = data;
            });

            ///Search Client to send to

            scope.searchClient = function () {
                scope.actualClients = [];
                scope.searchResults = [];
                scope.filterText = "";
                var searchString = scope.searchText;
                searchString = searchString.replace(/(^"|"$)/g, '');
                var exactMatch = false;
                var n = searchString.localeCompare(scope.searchText);
                if (n != 0) {
                    exactMatch = true;
                }

                if (!scope.searchText) {
                    scope.initPage();
                } else {
                    resourceFactory.globalSearch.search({
                        query: searchString,
                        resource: "clients,clientIdentifiers",
                        exactMatch: exactMatch,
                        getClientsOnly: true
                    }, function (data) {
                        var arrayLength = data.length;
                        //console.log(data);

                        angular.element('#toClientId').children().remove().end();
                        angular.element('#toOfficeId').children().remove().end();
                        for (var i = 0; i < data.length; ++i) {
                            if (data[i].linkStatus === 'A') {
                                angular.element('#toClientId').append('<option value=' + data[i].entityId + '>' + data[i].entityName + '</option>');
                                //angular.element('#fromProfile').append('<option value=' + scope.officesarr[i].id + '>' + scope.officesarr[i].name + '</option>');
                                angular.element('#toOfficeId').append('<option value=' +data[i].parentId + '>' + data[i].parentName + '</option>');

                                //scope.getAccToSendTo();
                                resourceFactory.getCardDetailResource.getCard({clientId: data[i].entityId},function (data) {
                                    scope.clientCardsToSendTo = data.data;
                                    //console.log(scope.clientCardsToSendTo);
                                    angular.element('#toSeq').children().remove().end();
                                    for (var i in scope.clientCardsToSendTo){
                                        angular.element('#toSeq').append('<option value=' +scope.clientCardsToSendTo[i].seq_number + '>' + scope.clientCardsToSendTo[i].seq_number + '</option>');
                                    }
                                    $('#toOfficeId').prop('selectedIndex',1);
                                    $('#toClientId').prop('selectedIndex',1);
                                    $('#toSeq').prop('selectedIndex',1);

                                });
                                //Remove zeros from Account
                                console.log(data[i].entityAccountNo);
                                console.log(parseInt(data[i].entityAccountNo.replace(/\D/g,''), 10));
                                resourceFactory.clientResource.get({clientId: parseInt(data[i].entityAccountNo.replace(/\D/g,''), 10)}, function (data) {
                                    scope.clientTosen = data;
                                    //console.log(scope.clientTosen);

                                    resourceFactory.savingsResource.get({
                                        accountId: scope.clientTosen.savingsAccountId,
                                        associations: 'all'
                                    }, function (data) {
                                        scope.savingaccountdetailstosend = data;
                                        //localStorageService.addToLocalStorage('acc',scope.savingaccountdetails);
                                        //console.log(data);
                                    });
                                });


                            }
                        }

                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var client = {};
                            client.status = {};
                            client.subStatus = {};
                            client.status.value = result.entityStatus.value;
                            client.status.code = result.entityStatus.code;
                            client.linkStatus = result.linkStatus;
                            if (result.entityType == 'CLIENT') {
                                client.displayName = result.entityName;
                                client.accountNo = result.entityAccountNo;
                                client.id = result.entityId;
                                client.externalId = result.entityExternalId;
                                client.officeName = result.parentName;

                            } else if (result.entityType == 'CLIENTIDENTIFIER') {
                                numberOfClients = numberOfClients + 1;
                                client.displayName = result.parentName;
                                client.id = result.parentId;
                                client.externalId = result.parentExternalId;

                            }
                            scope.actualClients.push(client);
                        }
                        var numberOfClients = scope.actualClients.length;
                        scope.totalClients = numberOfClients;
                        scope.clients = scope.actualClients.slice(0, scope.clientsPerPage);
                    });
                }
            }
            angular.element('#searchText').on('blur',function () {
                scope.searchClient();
            });
            ///End Search client to send to
            angular.element( '#cardToCard' ).mousemove(function( event ) {
                    //angular.element('#paymentTypeId option:contains("CASHOUT")').prop('selected',true);
                    //angular.element('#paymentTypeId option:contains("Transfer")').prop('selected',true);
                    //angular.element('#paymentTypeId').prop('disabled',true);

                angular.element('#toAccountId option:contains("Savings")').prop('selected',true);

                angular.element('#transactionDate').prop('disabled',true);
                angular.element('#toAccountId').prop('disabled',true);
            });

            scope.cancelTransfare = function () {
                scope.getCardBalance();
                location.path('/cardOperationsDetailedInfo/'+localStorageService.getFromLocalStorage('clickedClientID'));
            };
            scope.getCardBalance = function(){
                resourceFactory.getBalanceResource.getBalance({clientId: localStorageService.getFromLocalStorage('clickedClientID')},function (data) {});
            };
            scope.performTransaction = function() {
                //scope.formData.fromCard = angular.element('#fromCard').val().split(':')[1];
                //scope.formData.toCard = angular.element('#toCard').val().split(':')[1];
                scope.formData.transferDate = angular.element('#transactionDate').val();
                scope.formData.transferAmount = (angular.element('#transferAmount').val().replace(/,/g, ''));
                //scope.formData.paymentTypeId = angular.element('#paymentTypeId').val();
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                scope.formData.transferDescription = angular.element('#transferDescription').val();
                scope.formData.fromAccountId = scope.savingaccountdetails.id;
                scope.formData.fromOfficeId = parseInt(scope.client.officeId);
                scope.formData.fromAccountType = parseInt(angular.element('#toAccountId').val().split(':')[1]);
                scope.formData.fromClientId = parseInt(routeParams.id);

                scope.formData.toClientId = parseInt(angular.element('#toClientId').val());
                scope.formData.toAccountId = parseInt(scope.savingaccountdetailstosend.id);
                scope.formData.toOfficeId = parseInt(angular.element('#toOfficeId').val());
                scope.formData.toAccountType = parseInt(angular.element('#toAccountId').val().split(':')[1]);

                if (localStorageService.getFromLocalStorage('cardClicked') === angular.element('#toSeq').val()) {
                    swal({
                        title: 'Error',
                        text: 'Transaction cannot be performed within the same sequence number',
                        icon: 'error',
                        buttons: 'OK',
                        dangerMode: true,
                        onCloseClickOutside: false,
                    });
                } else {
                   // console.log('fromSeqNo :' + localStorageService.getFromLocalStorage('cardClicked') + '\ntoSeqNo :' + angular.element('#toSeq').val());
                    //console.log(scope.formData);
                    // 'cardoperations/:clientId/transactions/c2c?fromSeqNo=:fromSeqNo&toSeqNo=:toSeqNo&profileNo=:profileNo'
                    resourceFactory.cardTocardTransactionResource.cardToCardTransfer({clientId : routeParams.id,
                        fromSeqNo:localStorageService.getFromLocalStorage('cardClicked'), toSeqNo:angular.element('#toSeq').val()}, scope.formData ,function (data) {
                        //console.log(data);

                        if (data.message.toLowerCase().includes('error')){
                            swal({
                                title: 'Error',
                                text: data.message,
                                icon: 'error',
                                buttons: 'OK',
                                dangerMode: true,
                                onCloseClickOutside: false,
                            });
                        }else{
                            swal({
                                title: 'Successful',
                                text: data.message,
                                icon: 'success',
                                buttons: 'OK',
                                dangerMode: false,
                                onCloseClickOutside: false,
                            }).then(function () {
                                location.path('/offices?isOutlet=false');
                            });
                        }
                    });
                }
            }
            angular.element(document).ready( function () {
                setTimeout(function(){
                    scope.validate = new jaidsValidator();
                    scope.validate.formValidationInit('cardToCard', 'submit',  scope.performTransaction);
                },500);
            });
        }
    });
    mifosX.ng.application.controller('cardToCardController', ['$scope','$routeParams', 'ResourceFactory', '$location',
        'API_VERSION', '$rootScope','dateFilter', 'Upload','localStorageService', mifosX.controllers.cardToCardController]).run(function ($log) {
        $log.info("cardToCardController initialized");
    });
}(mifosX.controllers || {}));