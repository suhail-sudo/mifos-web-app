(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCardDetailedInfoController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope, Upload,localStorageService) {
            scope.userData = localStorageService.getFromLocalStorage('userData');
            scope.clientIDSelected = routeParams.id;
            let linkVar = '#cardOperations/' + scope.clientIDSelected;
            scope.transDetails = [];
            scope.actualGroups = [];
            scope.searchText = "";

            console.log(linkVar);
            $('#getBack').attr('href', linkVar);

            //First set Stop card Button Text
            scope.cardCommand = 'Stop Card';
            scope.cardSeqNumber = localStorageService.getFromLocalStorage('cardClicked');
            scope.getCardClickedDetails = function () {
                resourceFactory.getCardDetailResource.getCard({clientId: routeParams.id}, function (data) {
                    //console.log(data);
                    scope.clientCardDetail = data.data;
                    //console.log( scope.clientCardDetail);
                    if (scope.clientCardDetail) {
                        console.log('found something');
                    } else {
                        console.log('found nothing');
                    }

                    resourceFactory.getCardDetailedInformationResource.cardDetails({seqNo: scope.cardSeqNumber}, function (data) {
                        scope.getCardDetail = data.data;
                        //console.log(scope.getCardDetail);
                        scope.cardBalance = scope.getCardDetail.card_current_balance;
                        //scope.cardBalance = scope.cardBalance/100;
                        //console.log(scope.cardBalance);

                        if (scope.getCardDetail.card_status.toUpperCase() === 'A') {
                            scope.cardCommand = 'Stop Card';
                            angular.element('#activateCard').addClass('hide');
                            angular.element('#cancelStopCard').addClass('hide');

                            angular.element('.cardOpr').removeClass('hide');
                        } else {
                            scope.cardCommand = 'Cancel Stop Card';
                            angular.element('#activateCard').removeClass('hide');
                            angular.element('#cancelStopCard').removeClass('hide');

                            angular.element('.cardOpr').addClass('hide');
                        }
                        localStorageService.addToLocalStorage('clickedClientID', scope.getCardDetail.cust_id);
                    });

                    resourceFactory.getBalanceResource.getBalance({
                        clientId: routeParams.id,
                        seqNo: scope.cardSeqNumber
                    }, function (data) {
                        console.log('Balance SYNC Called');
                        //console.log(data);
                        scope.cardBalance = data.data.balance;
                        scope.cardBalance = parseInt(scope.cardBalance) / 100;
                    });
                });
                scope.convertDateArrayToObject = function (dateFieldName) {
                    for (var i in scope.savingaccountdetails.transactions) {
                        scope.savingaccountdetails.transactions[i][dateFieldName] = new Date(scope.savingaccountdetails.transactions[i].date);
                    }
                };
                scope.savingaccountdetails = [];
                resourceFactory.savingsResource.get({
                    accountId: localStorageService.getFromLocalStorage('accntID'),
                    associations: 'all'
                }, function (data) {
                    scope.savingaccountdetails = data;
                    //localStorageService.addToLocalStorage('acc',scope.savingaccountdetails);
                    //console.log(data);
                    scope.convertDateArrayToObject('date');
                    scope.savingaccountdetails.availableBalance = scope.savingaccountdetails.enforceMinRequiredBalance ? (scope.savingaccountdetails.summary.accountBalance - scope.savingaccountdetails.minRequiredOpeningBalance) : scope.savingaccountdetails.summary.accountBalance;
                    //scope.transDetails = data.transactions;

                    //console.log( scope.transDetails);
                });

                scope.transactionSort = {
                    column: 'id',
                    descending: true
                };

                resourceFactory.getTransInformation.tansInformation({seqNo: scope.cardSeqNumber}, function (data) {
                    //console.log(data);
                    scope.transDetails = data.data;
                });
            }

            scope.getCardClickedDetails();
            /**
             * Function to trigger Transactions(Deposit/Withdraw)
             * Send Action Button to local Storage - To recognise transaction
             * route to Transaction controller (withdrawFundsController)
             */
            scope.deductFunds = function () {
                //'/cardOperations/withdrawFunds/:id'
                if (scope.getCardDetail.card_status.toUpperCase() === 'A') {
                    location.path('/cardOperations/withdrawFunds/' + scope.getCardDetail.card_seq_no);
                    localStorageService.addToLocalStorage('inActionBtn', $('#deduct').text());
                } else {
                    scope.flagIActiveCard('Deduct Funds');
                }
            }
            scope.loadFunds = function () {
                if (scope.getCardDetail.card_status.toUpperCase() === 'A') {
                    location.path('/cardOperations/loadFunds/' + scope.getCardDetail.card_seq_no);
                    localStorageService.addToLocalStorage('inActionBtn', $('#loadCard').text());
                } else {
                    scope.flagIActiveCard('Load Funds');
                }
            }

            scope.tranferFunds = function () {
                location.path('/cardOperations/cardToCardTransfer/' + routeParams.id);
                localStorageService.addToLocalStorage('inActionBtn', $('#transfer').text());
                localStorageService.addToLocalStorage('clientId', scope.getCardDetail.cust_id);
            }

            scope.flagIActiveCard = function (descrpt) {
                swal({
                    title: 'Card is currently inActive',
                    text: 'The system cannot ' + descrpt + ' on an inActive cards',
                    icon: 'error',
                    buttons: 'OK',
                    dangerMode: true,
                    timer: 5000,
                    closeOnClickOutside: false,
                });
            }

            console.log('Output Language:' + scope.optlang.code);
            scope.postChargesToCard = function () {
                if (scope.getCardDetail.card_status.toUpperCase() === 'A') {
                    location.path('/cardOperations/postCharge/' + scope.getCardDetail.card_seq_no);
                    localStorageService.addToLocalStorage('inActionBtn', $('#postCharge').text());
                } else {
                    scope.flagIActiveCard('Post Charge');
                }
            }

            /*scope.stopCardData ={};
            scope.stopCard = function () {
                //'/cardOperations/withdrawFunds/:id'
                if (scope.cardCommand ==='Stop Card') {
                    //location.path('/cardOperations/stopCard/' + scope.getCardDetail.card_seq_no);
                    localStorageService.addToLocalStorage('inActionBtn', $('#stopCard').text());

                    var value;
                    const select = document.createElement('select');
                    //select.className = 'select-custom';
                    select.className = 'form-control';
                    const option0 = document.createElement('option');
                    const option1 = document.createElement('option');
                    const option2 = document.createElement('option');
                    const option3 = document.createElement('option');
                    const option4 = document.createElement('option');
                    const option5 = document.createElement('option');
                    const option6 = document.createElement('option');
                    const option7 = document.createElement('option');
                    const option8 = document.createElement('option');

                    option0.innerHTML = 'Select a Reason why you want to Stop This card';
                    option0.value = '';
                    option1.innerHTML = 'Card stopped as it has been lost';
                    option1.value = '1';
                    option2.innerHTML = 'Card stopped as it has been stolen';
                    option2.value = '2';
                    option3.innerHTML = 'Card stopped pending outcome of query';
                    option3.value = '3';
                    option4.innerHTML = 'Card stopped to consolidate onto single card';
                    option4.value = '4';
                    option5.innerHTML = 'Card stopped as it is no longer active';
                    option5.value = '5';
                    option6.innerHTML = 'Card stopped as allowable PIN tries have been exceeded';
                    option6.value = '6';
                    option7.innerHTML = 'Suspected fraud';
                    option7.value = '7';
                    option8.innerHTML = ' Emergency card replacement';
                    option8.value = '8';

                    select.appendChild(option0);
                    select.appendChild(option1);
                    select.appendChild(option2);
                    select.appendChild(option3);
                    select.appendChild(option4);
                    select.appendChild(option5);
                    select.appendChild(option6);
                    select.appendChild(option7);
                    select.appendChild(option8);

                    scope.reason = '';
                    select.onchange = function selectChanged(e) {
                        value = e.target.value;

                        scope.reason = value;
                    }

                    swal({
                        title: 'Are You Sure you want to Stop card?',
                        text: scope.getCardDetail.card_no,
                        closeOnClickOutside: false,
                        closeOnEsc:false,
                        buttons:true,
                    }).then((willStopCard) => {
                        //whatever
                        if (willStopCard){
                            swal({
                                title: 'Select Reason',
                                content: {
                                    element: select,
                                },
                                closeOnClickOutside: false,
                                closeOnEsc:false,
                                buttons:'OK',
                            }).then(function(){
                                if (scope.reason===''){
                                    swal({
                                        title: 'Error',
                                        text:'Select a reason To Stop Card',
                                        icon:'error',
                                        dangerMode: true,
                                        buttons:'OK',
                                        closeOnClickOutside: false,
                                        closeOnEsc:false,
                                    });
                                }else{
                                    //Witness -- Call Stop card API HERE
                                    scope.stopCardData.reason = scope.reason;
                                    scope.stopCardData.seqNo = scope.getCardDetail.card_seq_no;
                                    //console.log(scope.stopCardData);
                                }
                            });
                        }else{
                            swal({
                                title: 'Card Not Stopped',
                                text:'Card Still Active',
                                icon:'info',
                                dangerMode: false,
                                buttons:'OK'
                            });
                        }

                    });

                }else{
                    //Cancel Stop Card
                }
            }; */
            scope.resetPin = function () {
                localStorageService.addToLocalStorage('inActionBtn', $('#resetPinCard').text());
            };
            scope.activateCard = function () {

            };

            scope.cancelStopCardFunc = function () {
                resourceFactory.cancelStopCardResource.cancelStopCard({
                    clientId: routeParams.id,
                    seqNo: scope.getCardDetail.card_seq_no
                }, function (data) {
                    console.log(data);
                    //if (data.message.toLowerCase().includes('successfully')) {
                    swal({
                        title: 'Successful',
                        text: data.message,
                        icon: 'success',
                        buttons: 'OK',
                        closeOnClickOutside: false,
                        dangerMode: false,
                    }).then(function () {
                        scope.getCardClickedDetails();
                    });
                    /*} else {
                        swal({
                            title: 'Failed',
                            text: data.message,
                            icon: 'error',
                            buttons: 'OK',
                            closeOnClickOutside: false,
                            dangerMode: true,
                        }).then(function () {
                            scope.getCardClickedDetails();
                        });
                    }*/
                });
            };

            scope.replaceCardData ={}
            scope.replaceCardFunc = function () {
                swal('',{
                    //content: "input",
                    content: {
                        element: "input",
                        attributes: {
                            placeholder: "Type a new unique card sequence number",
                            type: "text",
                            maxlength:10,
                        },
                        dangerMode: true,
                    },
                    closeOnClickOutside: false,
                }).then((value) => {
                    if ((value === undefined) || (value === null) ||(value=='')){
                        swal({
                            title: 'You need to enter a unique card sequence number',
                            text: 'Empty Sequence Number',
                            icon: 'error',
                            buttons: 'OK',
                            closeOnClickOutside: false,
                            dangerMode: true,
                        });
                    }else{
                        scope.proceedStopCard(value);
                    }
                });
            };

            scope.proceedStopCard = function (seqEnter) {
                var value;
                const reasonSelect = document.createElement('select');
                //select.className = 'select-custom';
                reasonSelect.className = 'form-control';
                const option0 = document.createElement('option');
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                const option3 = document.createElement('option');
                const option4 = document.createElement('option');
                const option5 = document.createElement('option');
                const option6 = document.createElement('option');
                const option7 = document.createElement('option');
                const option8 = document.createElement('option');

                option0.innerHTML = 'Select a Reason why you want to Stop This card';
                option0.value = '';
                option1.innerHTML = 'Card stopped as it has been lost';
                option1.value = '1';
                option2.innerHTML = 'Card stopped as it has been stolen';
                option2.value = '2';
                option3.innerHTML = 'Card stopped pending outcome of query';
                option3.value = '3';
                option4.innerHTML = 'Card stopped to consolidate onto single card';
                option4.value = '4';
                option5.innerHTML = 'Card stopped as it is no longer active';
                option5.value = '5';
                option6.innerHTML = 'Card stopped as allowable PIN tries have been exceeded';
                option6.value = '6';
                option7.innerHTML = 'Suspected fraud';
                option7.value = '7';
                option8.innerHTML = ' Emergency card replacement';
                option8.value = '8';

                reasonSelect.appendChild(option0);
                reasonSelect.appendChild(option1);
                reasonSelect.appendChild(option2);
                reasonSelect.appendChild(option3);
                reasonSelect.appendChild(option4);
                reasonSelect.appendChild(option5);
                reasonSelect.appendChild(option6);
                reasonSelect.appendChild(option7);
                reasonSelect.appendChild(option8);

                scope.reason = '';
                reasonSelect.onchange = function selectChanged(e) {
                    value = e.target.value;

                    scope.reason = value;
                    //scope.stopCardData.reason = scope.reason;
                };

                swal({
                    title: 'Are You Sure you want to Replace card sequence ' + scope.getCardDetail.card_seq_no,
                    text: 'by Sequence Number ' + seqEnter + '?',
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: true,
                }).then((willStopCard) => {
                    //whatever
                    if (willStopCard) {
                        swal({
                            title: 'Select Reason',
                            content: {
                                element: reasonSelect,
                            },
                            closeOnClickOutside: false,
                            closeOnEsc: false,
                            buttons: 'OK',
                        }).then(function () {
                            if (scope.reason===''){
                                swal({
                                    title: 'Error',
                                    text:'Select a reason To Replace Card',
                                    icon:'error',
                                    dangerMode: true,
                                    buttons:'OK',
                                    closeOnClickOutside: false,
                                    closeOnEsc:false,
                                });
                            }else{
                                scope.replaceCardData.fromSeqNo = scope.getCardDetail.card_seq_no;
                                scope.replaceCardData.toSeqNo = seqEnter;
                                scope.replaceCardData.stopReasonID = scope.reason;
                                resourceFactory.replaceCardResource.replaceCard(scope.replaceCardData,function(data) {
                                    console.log(data);
                                    if (data.message.toLowerCase().includes('successfully')) {
                                        swal({
                                            title: 'Successful',
                                            text: data.message,
                                            icon: 'success',
                                            closeOnClickOutside: false,
                                            buttons: 'OK',
                                        }).then(function () {
                                            location.path('/cardOperationsDetailedInfo/' + routeParams.id);
                                        });
                                    }else{
                                        swal({
                                            title: 'Error',
                                            text: data.message,
                                            icon: 'error',
                                            closeOnClickOutside: false,
                                            buttons: 'OK',
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            };
        }
  });
    mifosX.ng.application.controller('ViewCardDetailedInfoController', ['$scope','$routeParams', 'ResourceFactory', '$location',
        'API_VERSION', '$rootScope', 'Upload','localStorageService', mifosX.controllers.ViewCardDetailedInfoController]).run(function ($log) {
        $log.info('ViewCardDetailedInfoController initialized');
    });
}(mifosX.controllers || {}));