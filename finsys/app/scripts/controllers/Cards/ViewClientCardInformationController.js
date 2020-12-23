//ViewClientCardInformationController
(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientCardInformationController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope, Upload,localStorageService) {
            scope.userData = localStorageService.getFromLocalStorage('userData');
            scope.trs = [];
            scope.client = [];
            scope.identitydocuments = [];
            scope.buttons = [];
            scope.clientdocuments = [];
            scope.staffData = {};
            scope.formData = {};
            scope.openLoan = true;
            scope.openSaving = true;
            scope.openShares = true ;
            scope.updateDefaultSavings = false;
            scope.charges = [];
            scope.params = {};
            scope.consumeLimits = [];
            scope.isAgent = false;
            scope.transactionSummary = [];
            scope.summary = {};


            // address
            scope.addresses=[];
            scope.view={};
            scope.view.data=[];
            // scope.families=[];
            var entityname="ADDRESS";
            formdata={};

            //console.log(routeParams.id);

            resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                scope.client = data;
                localStorageService.addToLocalStorage('clientAcc',scope.client.displayName);
                scope.isClosedClient = scope.client.status.value == 'Closed';
                scope.staffData.staffId = data.staffId;
                scope.isAgent = data.clientNonPersonDetails.agentCode !== undefined;

                //console.log(scope.client);
                localStorageService.addToLocalStorage('accntID', scope.client.savingsAccountId);


                resourceFactory.consumeLimitsResource.getAll({"entityName" :  "Client", "entityId":routeParams.id},function(limits){
                    resourceFactory.ruleMasterResource.getAll({"category" : "master"}, function (data) {
                        _.find(data, function(ruleParam){
                            if(ruleParam.elementType = "combo"){
                                var combo =  JSON.parse(ruleParam.paramComboJson);
                                if(combo.values){
                                    scope.params[ruleParam.paramName]  = JSON.parse(combo.values);
                                }
                            }
                        });
                        var i = 0;
                        _.each(limits, function(limit){
                            if(limit.category){
                                var entityJson = _.find(scope.params[limit.category], function(param){
                                    return param.id == limit.categoryId;
                                });
                                limit.categoryName = entityJson.name;
                                //limit.entityName = "label.heading.consume.limits." + entityName;
                            }
                            scope.consumeLimits.push(limit);
                        });


                    });
                });
                scope.navigateToSavingsOrDepositAccount = function (eventName, accountId, savingProductType) {
                    switch(eventName) {

                        case "deposit":
                            if(savingProductType==100)
                                location.path('/savingaccount/' + accountId + '/deposit');
                            if(savingProductType==300)
                                location.path('/recurringdepositaccount/' + accountId + '/deposit');
                            break;
                        case "withdraw":
                            if(savingProductType==100)
                                location.path('/savingaccount/' + accountId + '/withdrawal');
                            if(savingProductType==300)
                                location.path('/recurringdepositaccount/' + accountId + '/withdrawal');
                            break;
                    }
                }

                var clientStatus = new mifosX.models.ClientStatus();
                if (clientStatus.statusKnown(data.status.value)) {
                    scope.buttons = clientStatus.getStatus(data.status.value, scope.isAgent);
                    scope.savingsActionbuttons = [
                        {
                            name: "button.deposit",
                            type: "100",
                            icon: "fa fa-arrow-up",
                            taskPermissionName: "DEPOSIT_SAVINGSACCOUNT"
                        },
                        {
                            name: "button.withdraw",
                            type: "100",
                            icon: "fa fa-arrow-down",
                            taskPermissionName: "WITHDRAW_SAVINGSACCOUNT"
                        },
                        {
                            name: "button.deposit",
                            type: "300",
                            icon: "fa fa-arrow-up",
                            taskPermissionName: "DEPOSIT_RECURRINGDEPOSITACCOUNT"
                        },
                        {
                            name: "button.withdraw",
                            type: "300",
                            icon: "fa fa-arrow-down",
                            taskPermissionName: "WITHDRAW_RECURRINGDEPOSITACCOUNT"
                        }
                    ];
                }
            });

            scope.isClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.isSavingClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.pre.mature.closure" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };

            scope.isShareClosed = function (shareAccount) {
                if ( shareAccount.status.code === "shareAccountStatusType.closed" ||
                    shareAccount.status.code === "shareAccountStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.setLoan = function () {
                if (scope.openLoan) {
                    scope.openLoan = false
                } else {
                    scope.openLoan = true;
                }
            };
            scope.setSaving = function () {
                if (scope.openSaving) {
                    scope.openSaving = false;
                } else {
                    scope.openSaving = true;
                }
            };

            scope.setShares = function () {
                if (scope.openShares) {
                    scope.openShares = false;
                } else {
                    scope.openShares = true;
                }
            };

            scope.getProfileBalance= function(){
              console.log( routeParams.id);
                resourceFactory.getProfileBalanceResource.profileBalance({clientId: routeParams.id},function (data) {
                    scope.proflBalance = parseInt(data.data.balance)/100;
                });
            }
            scope.getProfileBalance();
            scope.getClientClicked= function() {
                resourceFactory.clientAccountResource.get({clientId: routeParams.id}, function (data) {
                    scope.clientAccounts = data;
                    console.log('----Client Account Data------\n');// + scope.clientAccounts.savingsAccounts);
                    if (data.savingsAccounts) {
                        //console.log(data.savingsAccounts[0].id);
                        scope.accId= data.savingsAccounts[0].id;
                        //scope.cardOperationsCommand(1);
                        scope.clientESavingsAcc = data;
                        for (var i in data.savingsAccounts) {
                            if (data.savingsAccounts[i].status.value == "Active") {
                                scope.updateDefaultSavings = true;
                                break;
                            }
                        }
                        scope.totalAllSavingsAccountsBalanceBasedOnCurrency = [];
                        for (var i in data.savingsAccounts) {
                            if (!scope.isSavingClosed(data.savingsAccounts[i])) {
                                var isNewEntryMap = true;
                                for (var j in scope.totalAllSavingsAccountsBalanceBasedOnCurrency) {
                                    if (scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].code === data.savingsAccounts[i].currency.code) {
                                        isNewEntryMap = false;
                                        var totalSavings = scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].totalSavings + data.savingsAccounts[i].accountBalance;
                                        scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].totalSavings = totalSavings;
                                    }
                                }
                                if (isNewEntryMap) {
                                    var map = {};
                                    map.code = data.savingsAccounts[i].currency.code;
                                    map.totalSavings = data.savingsAccounts[i].accountBalance;
                                    scope.totalAllSavingsAccountsBalanceBasedOnCurrency.push(map);
                                }
                            }
                        }
                    } else {
                        swal({
                            title: localStorageService.getFromLocalStorage('clientAcc') + ' has no active account',
                            text: 'Activate Account',
                            icon: 'warning',
                            buttons: 'OK',
                            dangerMode: true,
                        }).then(function () {
                           // scope.cardOperationsCommand(0);
                            location.path('/cardOpr');
                            console.log(location.path());
                        });
                    }
                });
            }
            scope.getClientClicked();
            scope.cardOperationsCommand= function(param){
                if (param===0){
                    angular.element("button[name='cardOprs']").attr('disabled',true);
                }else{
                    angular.element("button[name='cardOprs']").attr('disabled',false);
                }
            }

            scope.getLinkedCard=function(){
                resourceFactory.getCardDetailResource.getCard({clientId: routeParams.id},function (data) {
                    //console.log(data);
                    scope.clientCardDetail = data.data;

                    if (data.data.length > 0){
                        console.log('found something');
                        scope.cardOperationsCommand(1);
                        if (data.data.length==3){
                            //angular.element("#linkCard").attr('disabled',true);
                            angular.element("#linkCard").attr('disabled',false);
                        }else{
                            angular.element("#linkCard").attr('disabled',false);
                        }
                        angular.element('#cardInfo').show();
                        angular.element('#cardInfoHead').show();

                        if (data.data.activation_status==='A'){
                            scope.btnText = 'Deactivate Card';
                        } else{
                            scope.btnText = 'Activate Card';
                        }
                    }else{
                        console.log('found nothing');
                        angular.element("button[name='cardOprs']").attr('disabled',true);
                        angular.element("#linkCard").attr('disabled',false);
                        angular.element('#cardInfo').hide();
                        angular.element('#cardInfoHead').hide();
                    }
                });
            }

            scope.getClientBalance = function(){
                for (var i in scope.clientCardDetail){
                    resourceFactory.getBalanceResource.getBalance({clientId: routeParams.id,seqNo:scope.clientCardDetail[i].seq_number},function (data) {
                        scope.clientBalance = parseInt(data.data.balance)/ 100;
                        console.log(scope.clientBalance);
                        if (data.hasOwnProperty('data')){
                            swal({
                                title: 'Successful',
                                text:  'Balance synchronization Successful',
                                icon: 'success',
                                closeOnClickOutside: false,
                                buttons: 'OK',
                            });
                        }else{
                            swal({
                                title: 'error',
                                text:  'Balance synchronization Failed',
                                icon: 'error',
                                closeOnClickOutside: false,
                                buttons: 'OK',
                            });
                        }
                    });
                }
            }

            scope.getLinkedCard();
            for (var i in scope.clientCardDetail){
                resourceFactory.getBalanceResource.getBalance({clientId: routeParams.id,seqNo:scope.clientCardDetail[i].seq_number},function (data) {
                    //console.log(data);
                    scope.clientBalance = parseInt(data.data.balance)/ 100;
                });
            }

            //Link card Method
            scope.linkCard=function(){
                swal({
                    title: 'Link '+localStorageService.getFromLocalStorage('clientAcc')+' to card?',
                    text:  'You are about to link the above client to a card',
                    icon: 'warning',
                    closeOnClickOutside: false,
                    buttons: true,
                }).then((willLink) => {
                    if (willLink) {
                        swal('',{
                            //content: "input",
                            content: {
                                element: "input",
                                attributes: {
                                    placeholder: "Type a unique card sequence number",
                                    type: "text",
                                    maxlength:5,
                                },
                                dangerMode: true,
                            },
                            closeOnClickOutside: false,
                        }).then((value) => {
                            if ((value === undefined) || (value === null)){
                                swal({
                                    title: 'You need to enter a unique card sequence number',
                                    text: 'Empty Sequence Number',
                                    icon: 'error',
                                    buttons: 'OK',
                                    closeOnClickOutside: false,
                                    dangerMode: true,
                                });
                            }else{
                                var cardSeqNo = value.trim();
                                scope.cardUser = {}
                                if (cardSeqNo == '') {
                                    swal({
                                        title: 'You need to enter a unique card sequence number',
                                        text: 'Link ' + localStorageService.getFromLocalStorage('clientAcc') + ' to a card',
                                        icon: 'error',
                                        buttons: 'OK',
                                        closeOnClickOutside: false,
                                        dangerMode: true,
                                    });
                                } else {
                                    scope.cardUser.clientId = routeParams.id;
                                    scope.cardUser.cardSeqNo = cardSeqNo;

                                    // console.log(scope.cardUser);
                                    if (scope.cardUser.cardSeqNo === null) {
                                        swal({
                                            title: 'You need to enter a unique card sequence number',
                                            text: 'Link ' + localStorageService.getFromLocalStorage('clientAcc') + ' to a card',
                                            icon: 'error',
                                            buttons: 'OK',
                                            closeOnClickOutside: false,
                                            dangerMode: true,
                                        });
                                    } else {
                                        //{clientId:routeParams.id}
                                        resourceFactory.linkCardResource.linkCardToClient(scope.cardUser, function (data) {
                                            //Await Response
                                            //console.log(data);
                                            if (data.message.toLowerCase().includes('successfully')) {
                                                swal({
                                                    title: 'Successful',
                                                    text: data.message,
                                                    icon: 'success',
                                                    buttons: 'OK',
                                                    closeOnClickOutside: false,
                                                    dangerMode: false,
                                                }).then(function () {
                                                    scope.getClientClicked();
                                                    scope.getLinkedCard();
                                                    angular.element('#cardInfo').show();
                                                    angular.element('#cardInfoHead').show();
                                                });
                                            } else {
                                                swal({
                                                    title: 'Failed To link Card to Account',
                                                    text: data.message,
                                                    icon: 'error',
                                                    buttons: 'OK',
                                                    closeOnClickOutside: false,
                                                    dangerMode: true,
                                                }).then(function () {
                                                    scope.getClientClicked();
                                                    scope.getLinkedCard();
                                                    angular.element('#cardInfo').hide();
                                                    angular.element('#cardInfoHead').hide();
                                                });
                                            }
                                        });
                                    }
                            }
                        }
                        });
                    } else {
                        swal({
                            title: 'Card linking to ' + localStorageService.getFromLocalStorage('clientAcc'),
                            text:  'has been cancelled',
                            icon: 'warning',
                            buttons: 'OK',
                            closeOnClickOutside: false,
                            timer: 3000,
                        });
                    }
                });
            }


            scope.initiateLink=function(){
                angular.element('#inContent').hide();
                angular.element('#confirmDocuments').show();
                angular.element('#identityPassport').prop('checked',false);
                angular.element('#cardEnvelope').prop('checked',false);
                angular.element('#proofOfResidence').prop('checked',false);
            }
            scope.closeModal= function(){
                if ((angular.element('#identityPassport').prop('checked') == true) &&
                    (angular.element('#cardEnvelope').prop('checked') == true) &&
                    (angular.element('#proofOfResidence').prop('checked') == true)){
                    swal({
                        title: 'Successful',
                        text:  'All Required Documents Confirmed\n\tProceed to Card Linking',
                        icon: 'success',
                        buttons: 'OK',
                        timer: 5000,
                        closeOnClickOutside: false,
                    }).then(function () {
                        angular.element('#confirmDocuments').hide();
                        angular.element('#inContent').show();
                        scope.linkCard();
                    });
                }else{
                    swal({
                        title: 'Unconfirmed Documents',
                        text:  'Do you want to Cancel Card Linking?',
                        icon: 'warning',
                        closeOnClickOutside: false,
                        buttons: {
                            cancel: "No, Continue Linking",
                            catch: {
                                text: "Yes Cancel Card Linking",
                                value: "cancel",
                            },
                        },
                    }).then((willCancel) => {
                        if (willCancel=='cancel') {
                            swal({
                                title: 'Cancelled',
                                text:  'Card Linking Cancelled',
                                icon: 'warning',
                                buttons: 'OK',
                                dangerMode: true,
                                closeOnClickOutside: false,
                                timer: 3000,
                            }).then(function () {
                                scope.cancelModal();
                            });
                        }
                    });
                }
            }
            scope.cancelModal=function () {
                angular.element('#confirmDocuments').hide();
                angular.element('#inContent').show();
            }

            scope.blockClientCard=function () {
                swal({
                    title: 'Are you sure you want to block ' + localStorageService.getFromLocalStorage('clientAcc') +'`s Card?',
                    text:  'Block Client Card',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                }).then((willBlock) => {
                    if (willBlock) {
                        resourceFactory.blockCardResource.blockCard(scope.cardUser,{clientId:routeParams.id}, function (data) {
                            //Await Response
                        });
                    } else {
                        swal({
                            title: localStorageService.getFromLocalStorage('clientAcc') +'`s Card is not Blocked',
                            text:  'Block Client Card',
                            icon: 'success',
                            buttons: 'OK',
                            dangerMode: true,
                        });
                    }
                });
            }
            
            scope.resetPass=function () {
                let timer = 10,
                    startTimer = false;

                (function customSwal() {
                    swal({
                        title: "Resetting Password",
                        text: "Password reset in..." + timer,
                        timer: !startTimer ? timer * 1000 : undefined,
                        button: false,
                        closeOnClickOutside: false,
                        icon: 'success',
                    });
                    startTimer = true;
                    if(timer) {
                        timer--;
                        setTimeout(customSwal, 1000);
                    }
                    resourceFactory.resetClientCardPasswordResource.resetPassword({clientId: routeParams.id},function (data) {
                        if (timer===0){
                            swal({
                                title: 'Successful',
                                text:  'Password Reset Complete',
                                icon: 'success',
                                buttons: 'OK',
                                timer: 3000,
                                closeOnClickOutside: false,
                                footer: '<a>Password reset is sent to Card Holder</a>',
                            });
                        }
                    });
                })();
            }
            scope.btnText = 'Deactivate Card';
            scope.changeBtnText = function(){
                if (scope.btnText==='Deactivate Card'){
                    scope.btnText = 'Activate Card';
                } else{
                    scope.btnText = 'Deactivate Card';
                }
            }

            scope.routeToCardDetailedInfo = function (myCard) {
                location.path('/cardOperationsDetailedInfo/'+routeParams.id);
                localStorageService.addToLocalStorage('accIdtoUse',scope.accId);
                localStorageService.addToLocalStorage('cardClicked',myCard);
                console.log(routeParams.id);
            }

            /***
             * @Author Wisani Witness
             * Create Custom select to Reset card password
             * Get all card Details of a client
             * */

            function createCardsSelect (){

                const mySelect = document.createElement('select');
                mySelect.className = 'form-control';

                const defaultOption = document.createElement('option');
                defaultOption.innerHTML = 'Please Select Card';
                defaultOption.value ='';
                mySelect.appendChild(defaultOption);
                for (var x in scope.clientCardDetail){
                    if (scope.clientCardDetail[x].activation_status=='A'){
                        const myOption = document.createElement('option');
                        myOption.innerHTML = scope.clientCardDetail[x].card_number;
                        myOption.value = scope.clientCardDetail[x].seq_number;

                        mySelect.appendChild(myOption);
                    }
                }

                return mySelect;
            }

            scope.resetCardPassword = function () {
                scope.resetData = {};

                var select = createCardsSelect();
                var value;
                scope.sequenceNumber = '';
                select.onchange = function selectChanged(e) {
                    value = e.target.value;

                    scope.sequenceNumber = value;
                    //console.log(scope.sequenceNumber);
                }

                swal({
                    title: 'Select Card Number',
                    content: {
                        element: select,
                    },
                    closeOnClickOutside: true,
                    closeOnEsc:false,
                    buttons: 'OK',
                }).then(function(){
                    if (scope.sequenceNumber===''){
                        swal({
                            title: 'Error',
                            text:'Select a Card Number to Reset password',
                            icon:'error',
                            dangerMode: true,
                            buttons:'OK',
                            closeOnClickOutside: false,
                            closeOnEsc:false,
                        });
                    }else{
                        //Witness -- Call Reset Password API HERE
                        scope.resetData.seq_no = scope.sequenceNumber;
                    }
                });

            }

            scope.stopCardData ={};
            scope.stopCard = function () {
                var select = createCardsSelect();
                scope.sequenceNumberToStop = '';
                swal({
                    title: 'Select Card Number to Stop',
                    content: {
                        element: select,
                    },
                    closeOnClickOutside: true,
                    closeOnEsc:false,
                    buttons: 'OK',
                }).then(function(){
                    if (scope.sequenceNumberToStop===''){
                        swal({
                            title: 'Error',
                            text:'Select a Card to Stop',
                            icon:'error',
                            dangerMode: true,
                            buttons:'OK',
                            closeOnClickOutside: false,
                            closeOnEsc:false,
                        });
                    }else{
                        scope.proceedStopCard(scope.sequenceNumberToStop);
                    }
                });

                select.onchange = function selectChanged(e) {
                    value = e.target.value;

                    scope.sequenceNumberToStop = value;
                    //console.log(scope.sequenceNumberToStop);
                }

                scope.proceedStopCard = function (seqNo) {
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
                    }

                    swal({
                        title: 'Are You Sure you want to Stop card?',
                        text: seqNo,
                        closeOnClickOutside: false,
                        closeOnEsc:false,
                        buttons:true,
                    }).then((willStopCard) => {
                        //whatever
                        if (willStopCard){
                            swal({
                                title: 'Select Reason',
                                content: {
                                    element: reasonSelect,
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
                                    scope.stopCardData.stopReasonID = scope.reason;
                                    //scope.stopCardData.seqNo = seqNo;
                                    //scope.stopCardData.clientId = routeParams.id;
                                   console.log(scope.stopCardData);
                                    resourceFactory.stopCardResource.stopCard({clientId:routeParams.id,seqNo:scope.sequenceNumberToStop},scope.stopCardData,function (data) {
                                        console.log(data);
                                        if (data.message.toLowerCase().includes('error')) {

                                            swal({
                                                title: 'Failed To link Card to Account',
                                                text: data.message,
                                                icon: 'error',
                                                buttons: 'OK',
                                                closeOnClickOutside: false,
                                                dangerMode: true,
                                            }).then(function () {
                                                scope.getClientClicked();
                                                scope.getLinkedCard();
                                            });
                                        } else {
                                            swal({
                                                title: 'Successful',
                                                text: data.message,
                                                icon: 'success',
                                                buttons: 'OK',
                                                closeOnClickOutside: false,
                                                dangerMode: false,
                                            }).then(function () {
                                                scope.getClientClicked();
                                                scope.getLinkedCard();
                                            });
                                        }
                                    });
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
                }
            }

            scope.resetCardPin= function () {
                var selectToReset = createCardsSelect();
                scope.sequenceNumberToResetPin = '';
                swal({
                    title: 'Select Card Number to reset Pin',
                    content: {
                        element: selectToReset,
                    },
                    closeOnClickOutside: true,
                    closeOnEsc:false,
                    buttons: 'OK',
                }).then((val) =>{
                    console.log(val);
                    if (scope.sequenceNumberToResetPin===''){
                        swal({
                            title: 'Error',
                            text:'Select a Card to Reset Pin',
                            icon:'error',
                            dangerMode: true,
                            buttons:'OK',
                            closeOnClickOutside: false,
                            closeOnEsc:false,
                        });
                    }else{
                        //API Call for Reset Pin
                        resourceFactory.restCardPinResource.resetPin({clientId:routeParams.id,seqNo:scope.sequenceNumberToResetPin},function (data) {
                            //console.log(data);
                            if (data.message.toLowerCase().includes('error')){
                                swal({
                                    title: 'Error',
                                    text: data.message,
                                    icon:'error',
                                    dangerMode: true,
                                    buttons:'OK',
                                    closeOnClickOutside: false,
                                    closeOnEsc:false,
                                });
                            }else{
                                swal({
                                    title: 'successful',
                                    text: data.message,
                                    icon:'success',
                                    dangerMode: false,
                                    buttons:'OK',
                                    closeOnClickOutside: false,
                                    closeOnEsc:false,
                                });
                            }
                        });
                    }
                });

                selectToReset.onchange = function selectChanged(evnt) {
                    scope.sequenceNumberToResetPin = evnt.target.value;
                    //console.log(scope.sequenceNumberToResetPin);
                }
            }

            scope.deactivateCard=function () {
                //scope.changeBtnText();
                var selectToDeactivate = createCardsSelect();
                scope.sequenceNumberToDeactivate = '';
                swal({
                    title: 'Select Card Number to Deactivate',
                    content: {
                        element: selectToDeactivate,
                    },
                    closeOnClickOutside: true,
                    closeOnEsc:false,
                    buttons: 'OK',
                }).then((value) =>{
                    console.log(value);
                    if (scope.sequenceNumberToDeactivate===''){
                        swal({
                            title: 'Error',
                            text:'Select a Card to Deactivate',
                            icon:'error',
                            dangerMode: true,
                            buttons:'OK',
                            closeOnClickOutside: false,
                            closeOnEsc:false,
                        });
                    }else{
                        //API Call for Reset Pin
                    }
                });

                selectToDeactivate.onchange = function selectChanged(evnt) {
                    scope.sequenceNumberToDeactivate = evnt.target.value;
                    console.log(scope.sequenceNumberToDeactivate);
                }
            }

        }
    });
    mifosX.ng.application.controller('ViewClientCardInformationController', ['$scope','$routeParams', 'ResourceFactory', '$location',
        'API_VERSION', '$rootScope', 'Upload','localStorageService', mifosX.controllers.ViewClientCardInformationController]).run(function ($log) {
        $log.info("ViewClientCardInformationController initialized");
    });
}(mifosX.controllers || {}));