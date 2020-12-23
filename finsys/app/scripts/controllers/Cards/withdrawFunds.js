(function (module) {
    mifosX.controllers = _.extend(module, {
        withdrawFunds: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope,dateFilter, Upload,localStorageService) {
            scope.clientID = localStorageService.getFromLocalStorage('clickedClientID');
            scope.accountId = localStorageService.getFromLocalStorage('accntID');
            console.log(routeParams.id);
            scope.formData = {};
            let linkVar ='#cardOperationsDetailedInfo/'+localStorageService.getFromLocalStorage('clickedClientID');

            resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                scope.paymentTypes = data.paymentTypeOptions;
                console.log(scope.paymentTypes);
            });

            //Append Link to BreadCrumb
            angular.element('#getBack').attr('href',linkVar);

            resourceFactory.getCardDetailResource.getCard({clientId: scope.clientID},function (data) {
                //console.log(data);
                scope.clientCardDetail = data.data;
                //console.log( scope.clientCardDetail);
                if (scope.clientCardDetail){
                    console.log('found something');
                    resourceFactory.getCardDetailedInformationResource.cardDetails({seqNo: scope.clientCardDetail.seq_number},function (data) {
                        scope.getCardDetail=data.data;
                        console.log(scope.getCardDetail);
                        localStorageService.addToLocalStorage('clickedClientID',scope.getCardDetail.cust_id);
                    });

                    resourceFactory.getTransInfo.tansInfo({seqNo: scope.clientCardDetail.seq_number},function (data) {
                        //console.log(data);
                        scope.transDetails=data.data;
                    });
                }else{
                    console.log('found nothing');
                }
            });
            scope.chargeTypes = [
                {"id":"1","name":"SMS Balance Enquiry"},
                {"id":"2","name":"ATM Balance Enquiry"},
                {"id":"3","name":"ATM Balance Enquiry - Agent Bank"},
                {"id":"4","name":"ATM Cash Withdrawal"},
                {"id":"5","name":"ATM Cash Withdrawal - Agent Bank"},
                {"id":"6","name":"POS Purchase"},
                {"id":"7","name":"POS Purchase with Cashback"},
                {"id":"8","name":"SMS Transaction Notification"},
                {"id":"9","name":"Emergency Cash Advance"},
                {"id":"10","name":"Emergency Card Replacement/Cash Advance"},
                {"id":"11","name":"Cashout"},
                {"id":"12","name":"Card Order"},
                {"id":"13","name":"Card Delivery"},
                {"id":"14","name":"Card Load"},
                {"id":"15","name":"Monthly Active Card"},
                {"id":"16","name":"Monthly Inactive Card"},
                {"id":"17","name":"Non-participating Merchant Fee"},
                {"id":"18","name":"Deposit"},
                {"id":"19","name":"Card Initiation"},
                {"id":"20","name":"Card Reinitiation"},
                {"id":"21","name":"Replacement Card"},
                {"id":"22","name":"Reissue Fee"},
                {"id":"23","name":"SMS PIN Change Fee"},
                {"id":"24","name":"Card To Profile Transfer Fee"},
                {"id":"25","name":"Transfer Fee"}
            ];

            console.log( scope.chargeTypes);
            for (var i in scope.chargeTypes){
                $('#chargeType').append('<option value='+ scope.chargeTypes[i].id
                    + '>' + scope.chargeTypes[i].name + '</option>');
            }

            //set Default Selected Payment Type - Auto Select Cashin, Cashout, or Fee Posting
            angular.element( '#withdrawFunds' ).mousemove(function( event ) {
                if (localStorageService.getFromLocalStorage('inActionBtn').toLowerCase().includes('load')){
                    angular.element('#paymentTypeId option:contains("CASHIN")').prop('selected',true);
                    angular.element('#paymentTypeId').prop('disabled',true);
                }else if(localStorageService.getFromLocalStorage('inActionBtn').toLowerCase().includes('deduct')){
                    angular.element('#paymentTypeId option:contains("CASHOUT")').prop('selected',true);
                    angular.element('#paymentTypeId').prop('disabled',true);
                }else {
                    //angular.element('#paymentTypeId option:contains("CASHOUT")').prop('selected',true);
                    angular.element('#paymentTypeId option:contains("FEE POSTING")').prop('selected',true);
                    angular.element('#paymentTypeId').prop('disabled',true);
                }
                //Disable and Restrict date to Today
                angular.element('#transactionDate').prop('disabled',true);
            });

            //Auto set Today`s Date
            scope.first = {};
            scope.first.date = new Date();
            scope.first.transactionDate = new Date ();
            console.log(scope.first);

            console.log(scope.first.transactionDate);
            scope.performTransaction = function () {
                //scope.formData.cardSeqNo = scope.getCardDetail.card_seq_no;
                scope.formData.dateFormat = localStorageService.getFromLocalStorage('dateformat');
                scope.formData.locale = scope.optlang.code;
                    //localStorageService.getFromLocalStorage('Language').code;
                scope.formData.transactionDate = angular.element('#transactionDate').val();
                scope.formData.transactionAmount = (angular.element('#transactionAmount').val().replace(/,/g ,''));
                scope.formData.paymentTypeId = parseInt(angular.element('#paymentTypeId').val().split(':')[1]);
                //scope.formData.note=angular.element('#note').val();
                //scope.formData.clientId=scope.clientID;
                //scope.formData.card_seq_no = routeParams.id;

                if (localStorageService.getFromLocalStorage('inActionBtn').toLowerCase().includes('load')){
                    console.log(scope.formData);
                    resourceFactory.loadCardResource.loadCard({clientId: scope.clientID,seqNo: routeParams.id},scope.formData,function (data) {
                        console.log(data);
                        scope.responseShow(data);
                    });
                }else if (localStorageService.getFromLocalStorage('inActionBtn').toLowerCase().includes('deduct')){
                    resourceFactory.deductCardResource.deductCard({clientId: scope.clientID,seqNo: routeParams.id},scope.formData,function (data) {
                        console.log(data);
                        scope.responseShow(data);
                    });
                }else if (localStorageService.getFromLocalStorage('inActionBtn').toLowerCase().includes('post')){
                    scope.feetype = angular.element('#chargeType').val();
                    scope.formData.paymentTypeId = 4;
                    if (scope.feetype==''){
                        swal({
                            title: 'Select Fee Type',
                            text:  'Fee Type',
                            icon: 'warning',
                            buttons: 'OK',
                            dangerMode: true,
                        });
                    }else {
                        resourceFactory.postChargeResoure.postCharge({
                            clientId: scope.clientID,
                            feetype: scope.feetype,
                            seqNo: routeParams.id
                        }, scope.formData, function (data) {
                            console.log(data);
                            scope.responseShow(data);
                        });
                    }
                }
            }

            scope.responseShow = function(res){
                if (res.message.toLowerCase().includes('successfully')){
                    scope.getCardBalance();
                    swal({
                        title: 'Successful',
                        text:  res.message,
                        icon: 'success',
                        buttons: 'OK',
                        dangerMode: false,
                    }).then(function () {
                        //Route back to Client Card and transactions information screen
                        scope.cancelTransaction();
                    });
                }else{
                    swal({
                        title: 'Error',
                        text:  res.message,
                        icon: 'error',
                        buttons: 'OK',
                        dangerMode: true,
                    });
                }
            }

            //Route back to client card info
            scope.cancelTransaction = function(){
                scope.getCardBalance();
                location.path('/cardOperationsDetailedInfo/'+localStorageService.getFromLocalStorage('clickedClientID'));
            }

            scope.getCardBalance = function(){
                resourceFactory.getBalanceResource.getBalance({clientId: scope.clientID,seqNo:routeParams.id},function (data) {
                    console.log(data);
                });
            }

            scope.getCardBalance();
            angular.element(document).ready( function () {
                setTimeout(function(){
                    scope.validate = new jaidsValidator();
                    scope.validate.formValidationInit('withdrawFunds', 'submit',  scope.performTransaction);
                },500);
            });
        }
    });
    mifosX.ng.application.controller('withdrawFunds', ['$scope','$routeParams', 'ResourceFactory', '$location',
        'API_VERSION', '$rootScope','dateFilter', 'Upload','localStorageService', mifosX.controllers.withdrawFunds]).run(function ($log) {
        $log.info("withdrawFunds initialized");
    });
}(mifosX.controllers || {}));