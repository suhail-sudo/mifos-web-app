(function (module) {
    mifosX.controllers = _.extend(module, {
        CardController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope, Upload,localStorageService) {
            scope.userData = localStorageService.getFromLocalStorage('userData');
            scope.formData = {};
            scope.first = {};
            scope.first.queryParams = '&';

            scope.formData.officeId = scope.userData.officeId;
            scope.formData.officeName = scope.userData.officeName;
            scope.onFileSelect = function (files) {
                //console.log(files);
                scope.formData.file = files[0];
                console.log(scope.formData);
                if (scope.formData.file) {
                    console.log(scope.formData.file.name);
                } else {
                    console.log('No File');
                }

                //console.log(scope.formData);
            };
            //Upload new Cards
            scope.upload = function () {
                console.log(scope.formData);
                if (scope.formData.file){
                    Upload.upload({
                        url: $rootScope.hostUrl + API_VERSION + '/cardupload/uploadtemplate?branchno=' + scope.formData.officeId,
                        data: {file: scope.formData.file},
                    }).then(function (data) {
                        // to fix IE not refreshing the model
                        console.log(data);
                        if (data.data.error===''){
                            swal({
                                title: 'Successful',
                                text: 'File Uploaded Successfully',
                                icon: 'success',
                                button: 'OK',
                            });
                        }else {
                            swal({
                                title: 'Not Successful',
                                text: data.data.error,
                                icon: 'error',
                                button: 'OK',
                                dangerMode: true,
                            });
                        }
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    });
                }else{
                    angular.element('#file').css('box-shadow','2px 2px 3px red');
                    swal({
                        title: "No Batch selected!",
                        text: "Select a File to Upload",
                        icon: "error",
                        button: "OK",
                        dangerMode: true,
                    }).then(function () {
                        angular.element('#file').css('box-shadow','none');
                    });
                }
            };

            //Retreive Uploaded UnApproved Cards
            scope.getCardsBatch = function () {
                resourceFactory.getCardsResource.unApprovedCards(function (data) {
                    scope.unApprovedCards = data;

                    if (scope.unApprovedCards.length>0){
                        console.log(data);
                    }else{
                        swal({
                            title: 'No Batch to approve!',
                            text: 'Batches Empty',
                            icon: 'error',
                            button: 'OK',
                            dangerMode: true,
                        });
                    }
                });
            };

            let arrBatches = {};
            var results = "";
            scope.addToApproveReject = function(result) {
                console.log(Object.keys(result)[0]);
                if ( results == ""){
                    results = Object.keys(result);
                }else {
                    results = results + "," + Object.keys(result)[0];
                }

                let id =  Object.keys(result) ;
                if (Object.values(result)[0]==true){
                    arrBatches[id]=Object.keys(result)[0];
                }else{
                    delete arrBatches[id];
                }
                localStorageService.addToLocalStorage('batch',arrBatches);
                console.log(arrBatches);
            };

            scope.approvedBatch = {};
            scope.approveBash= function(){
                scope.approvedBatch.batchid = Object.values(arrBatches).toString();
                console.log(scope.approvedBatch);
                if (scope.approvedBatch.batchid){
                   // console.log(scope.approvedBatch.batchid);
                    resourceFactory.saveApprovedCardsResource.save(scope.approvedBatch, function (data) {
                        console.log(data);
                        //location.path('/cards/');
                        if (data.error===''){
                            swal({
                                title: 'Successful',
                                text: 'Cards are successfully Approved',
                                icon: 'success',
                                button: 'OK',
                                dangerMode: false,
                            }).then(function () {
                                scope.getCardsBatch();

                            });
                        }else{
                            swal({
                                title: 'Failed',
                                text: 'Failed Approve cards',
                                icon: 'error',
                                button: 'OK',
                                dangerMode: true,
                            });
                        }
                    });
                }else{
                    swal({
                         title: 'No Batch selected!',
                         text: 'Select at least one batches to approve',
                         icon: 'error',
                         button: 'OK',
                         dangerMode: true,
                     });
                }
            };

            //Retrieve Approved Batches to assign to Agents
            scope.getApprovedBatches= function(){
                //Retrieve Agents
                //resourceFactory.agentsResource.getAllAgents( function (data) {
                resourceFactory.userTemplateResource.get(function(data){
                    scope.agents = data.allowedOffices;

                    delete scope.agents[Object.keys(scope.agents)[0]];
                    //console.log( scope.agents);
                });
            };
            scope.sequences={};
            var arrCardsObj = {};
            var array=[];
            var newObjectCards ={};
            scope.searchCards = function(){
                if (angular.element('#startSeqNum').val()===''){
                    angular.element('#startSeqNum').css('box-shadow', '2px 2px 3px red');
                    swal({
                        title: 'Specify start Sequence Number',
                        text: 'Error',
                        icon: 'warning',
                        buttons: 'OK',
                        dangerMode: true,
                    }).then(function () {
                        angular.element('#startSeqNum').css('box-shadow', 'none');
                    });
                }else if (angular.element('#endSeqNum').val()===''){
                    angular.element('#endSeqNum').css('box-shadow', '2px 2px 3px red');
                    swal({
                        title: 'Specify End Sequence Number',
                        text: 'Error',
                        icon: 'warning',
                        buttons: 'OK',
                        dangerMode: true,
                    }).then(function () {
                        angular.element('#endSeqNum').css('box-shadow', 'none');
                    });
                }else {

                    //https://finsys.app/fineract-provider/api/v1/cardbatch/searchbyseq?start=00000352&end=00000352
                    console.log(scope.sequences);
                    resourceFactory.getApprovedCardsResource.approvedCards(
                        {start:scope.sequences.start,
                            end:scope.sequences.end} ,
                        function(data) {
                            console.log(data.data);
                            scope.approvedBatches= data.data;
                            if (data.data.length <=0){
                                swal({
                                    title: 'No cards Found',
                                    text: 'Error',
                                    icon: 'warning',
                                    buttons: 'OK',
                                    dangerMode: true,
                                }).then(function () {
                                    //scope.approvedBatches= {};
                                    $('#cardsTable').addClass('hide');
                                    $('#assignTo').addClass('hide');
                                });
                            }else{
                                $('#cardsTable').removeClass('hide');
                                $('#assignTo').removeClass('hide');
                                $('#selectAll').prop('checked', true);
                                $('.cardsItemsChk').prop('checked', true);
                            }

                            for (var i=0; i < scope.approvedBatches.length; i++){
                                console.log(scope.approvedBatches[i].seq_number);
                                newObjectCards[scope.approvedBatches[i].seq_number] = scope.approvedBatches[i].seq_number;
                            }

                        });
                    scope.getApprovedBatches();
                }
            }

            console.log(newObjectCards);
            //Creating Array Cards

            //var arrCardsObj = {}
            scope.getValueItem = function (param) {
                $('.cardsItemsChk').prop('checked', true);
                console.log(param.appCards.seq_number);
                //createControlString(param);
                var cardSeq = param.appCards.seq_number;

                if (Object.values(arrCardsObj).indexOf(cardSeq) > -1) {
                    console.log('has : ' + cardSeq);
                    delete arrCardsObj[cardSeq];
                }else{
                    arrCardsObj[cardSeq] = cardSeq;
                }

                console.log(arrCardsObj);
            }

            scope.checkAll = function(){
                if ($('#selectAll').is(':checked')){
                    console.log('checked');
                    $('.cardsItemsChk').prop('checked', true);

                    $("input:checkbox[name=cardDetails]").each(function() {
                        array.push($(this).context.id);
                        console.log(array);

                        if (Object.values(arrCardsObj).indexOf($(this).context.id) > -1) {
                            console.log('has : ' + $(this).context.id);
                            delete arrCardsObj[$(this).context.id];

                        }else{
                            arrCardsObj[$(this).context.id] = $(this).context.id;
                        }
                        console.log(arrCardsObj);
                        arrCardsObj[$(this).context.id] = $(this).context.id;
                    });
                }else{
                    console.log('unchecked');
                    $('.cardsItemsChk').prop('checked', false);
                    arrCardsObj = {};
                }

                console.log(arrCardsObj);
            }
            scope.assignCardsToProfile = function(){
                console.log(newObjectCards);
                if (angular.element('#agentId').val()==='' ||
                    angular.element('#agentId').val().split(':')[0].toLowerCase().includes('undefined')){
                        angular.element('#agentId').css('box-shadow','2px 2px 2px red');
                    swal({
                        title: 'Select Agent to assign cards to',
                        text: 'Assign Cards',
                        icon: 'error',
                        buttons: 'OK',
                        dangerMode: true,
                    }).then(function () {
                        angular.element('#agentId').css('box-shadow','none');
                    });
                }else if (Object.keys(newObjectCards).length <= 0){
                    swal({
                        title: 'Select Cards to assign to Profile',
                        text: 'Assign Cards',
                        icon: 'error',
                        buttons: 'OK',
                        dangerMode: true,
                    });
                } else{
                    scope.sendCards = {
                        'agentId':angular.element('#agentId').val().split(':')[1],
                        'seqnos': Object.keys(newObjectCards)
                    }
                    console.log(scope.sendCards);
                    resourceFactory.assignCardsSeqResource.assignCardsSeq(scope.sendCards,function (data) {
                        console.log(data);
                        if (data.message.toLowerCase().includes('successfully')){
                            swal({
                                title: 'Successful',
                                text:  data.message,
                                icon: 'success',
                                closeOnClickOutside: false,
                                buttons: 'OK',
                            }).then(function () {
                                scope.searchCards();

                                //scope.sequences={};

                                //Clear all arrays and objects
                                for (var member in scope.sequences) {
                                    delete scope.sequences[member];
                                }
                                //arrCardsObj = {};
                                for (var objmember in arrCardsObj) {
                                    delete arrCardsObj[objmember];
                                }
                                array.length =0;
                                //newObjectCards ={};
                                for (var objcardmember in newObjectCards) {
                                    delete newObjectCards[objcardmember];
                                }
                            });
                        }else{

                            swal({
                                title: 'Error',
                                text:  data.message,
                                icon: 'error',
                                closeOnClickOutside: true,
                                buttons: 'OK',
                            });

                        }
                    });
                }
            }

            //Assign Cards to Agents
            scope.assignData={};
            scope.assignToAgent = function(batch,batchNo,agentId){
                console.log(batch + ' '+agentId);

                scope.assignData.batchno=batch;
                scope.assignData.agentId=agentId;

                if ((scope.assignData.agentId===undefined) || (scope.assignData.agentId==='') ){
                    swal({
                        title: 'Select Agent to assign cards to',
                        text: 'Assign Cards',
                        icon: 'error',
                        buttons: 'OK',
                        dangerMode: true,
                    });
                }else{
                    swal({
                        title: 'Do you want to assign `'+ batchNo +' the selected entity?',
                        text: 'Assign Cards',
                        icon: 'warning',
                        buttons: true,
                        dangerMode: true,
                    }).then((willAssign) => {
                        if (willAssign) {
                            scope.assignBatches(batchNo);
                        }else{
                            swal('The Batch `' + batchNo + '` is still not assigned');
                        }
                    });
                }
            };

            scope.assignBatches = function(myBatch){
                console.log(scope.assignData);

                resourceFactory.assignCardsToAgentsResource.assignCards(scope.assignData,function (data) {
                    console.log(data);
                    if(data.message.toLowerCase().includes('successfully')){
                        swal({
                            title:  myBatch +' Successfully Assigned',
                            text: data.message,
                            icon: 'success',
                            button: 'OK',
                        }).then(function () {
                            scope.getApprovedBatches();
                        });
                    }else{
                        swal({
                            title:  'Failed',
                            text: data.message,
                            icon: 'error',
                            button: 'OK',
                            dangerMode: true,
                        });
                    }
                });
            }
            //Retrieve Assigned cards to dispatch
            scope.getAssignedCards= function(){
                resourceFactory.getAssignedCardsResource.assignedCards(function(data){
                    scope.assigned =data;

                    if (scope.assigned.length>0) {
                        console.log(scope.assigned);
                        for (var i in scope.assigned) {

                            var batchNo = scope.assigned[i].batch_no;

                            if ((batchNo===undefined) || (batchNo==='')){

                            }else {
                                angular.element('#batchNo').append('<option value=' + batchNo + '>' + batchNo + '</option>');
                            }
                        }
                    }else{
                        swal({
                            title:  'There are no assigned card batches present',
                            text: 'Dispatch Cards',
                            icon: 'warning',
                            button: 'OK',
                        });
                    }
                });
            };
            //Dispatch Cards to Agents
            scope.dispatchData={};

            scope.dispatchCards = function () {
                scope.dispatchData.batch_no = angular.element('#batchNo').val();
                scope.dispatchData.name = angular.element('#firstname').val();
                scope.dispatchData.phone = angular.element('#mobileNo').val();
                scope.dispatchData.email = angular.element('#email').val();
                console.log(scope.dispatchData);

            if((scope.dispatchData.batch_no==='') || (scope.dispatchData.batch_no===undefined)){
                angular.element('#batchNo').css('box-shadow','2px 2px 3px red');
                swal({
                    title: 'No Batch selected!',
                    text: 'Select a Batch',
                    icon: 'error',
                    button: 'OK',
                    dangerMode: true,
                }).then(function () {
                    angular.element('#batchNo').css('box-shadow','none');
                });
            }else{
                if (((scope.dispatchData.name==='') || ( scope.dispatchData.phone==='') || (scope.dispatchData.email==='')) ||
                    ((scope.dispatchData.name===undefined) || ( scope.dispatchData.phone===undefined) || (scope.dispatchData.email===undefined))){
                    swal({
                        title:  'Enter all Valid Recipient Details',
                        text: 'Incomplete inputs',
                        icon: 'error',
                        button: 'OK',
                    });
                }else{
                    resourceFactory.dispatchCardsResource.dispatch(scope.dispatchData,function (data) {
                    console.log(data);
                        swal({
                            title:  'Successful',
                            text: 'Batch Successfully Dispatched',
                            icon: 'success',
                            button: 'OK',
                        }).then(function () {
                            $('#batchNo option:eq(0)').prop('selected', true);
                            angular.element('#firstname').val('');
                            angular.element('#mobileNo').val('');
                            angular.element('#email').val('');
                            //scope.getAssignedCards();
                            location.path('/cards/');
                        });
                    });
                }}
            };

            /*angular.element(document).ready( function () {
                setTimeout(function(){
                    scope.validate = new jaidsValidator();
                    scope.validate.formValidationInit('CardProvisioningForm', 'dispatchBtn',  scope.dispatchCards);
                },500);
            }); */
            scope.delinkData = {};
            scope.first = {};
            scope.first.date = new Date();
            scope.first.delinkDate = new Date ();

            function toObject(arr) {
                var rv = {};
                for (var i = 0; i < arr.length; ++i) {
                    rv[i] = arr[i];
                }
                return rv;
            }
            scope.getOffices = function () {
                resourceFactory.officeResource.getAllOffices(function (data) {
                    scope.officesarr = data;
                    angular.element('#profileNo').children().remove().end();
                    angular.element('#profileNo').append('<option selected value=' + "" + '>' + "----------Select Profile----------" + '</option>');
                    //console.log(scope.officesarr);
                    for (var i = 0; i < scope.officesarr.length; ++i) {
                        //console.log(scope.officesarr[i].profile_no + ':' + scope.officesarr[i].name);
                        if (scope.officesarr[i].profile_no) {
                            angular.element('#profileNo').append('<option value=' + scope.officesarr[i].profile_no + '>'
                                + scope.officesarr[i].name + '</option>');
                        }
                    }
                    scope.offices = toObject(scope.officesarr);
                });
            };
            scope.cancelDelink = function () {
                angular.element('#cardSeqNo').val('');
                location.path('/cards/');
            };

            scope.delinkCard = function () {
                console.log(scope.delinkData);
                resourceFactory.delinkCardResource.delinkCard({seqNo:scope.delinkData.seqNo,profileNo:scope.delinkData.profileNo},function(data){
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
                            location.path('/cards/');
                        });
                    }
                });
            }
            angular.element(document).ready( function () {
                setTimeout(function(){
                    scope.validate = new jaidsValidator();
                    scope.validate.formValidationInit('delinkCardFrm', 'delinkBtn',  scope.delinkCard);
                },500);
            });
        }
});
mifosX.ng.application.controller('CardController', ['$scope','$routeParams', 'ResourceFactory', '$location',
    'API_VERSION', '$rootScope', 'Upload','localStorageService', mifosX.controllers.CardController]).run(function ($log) {
    $log.info("CardController initialized");
});
}(mifosX.controllers || {}));