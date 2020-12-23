(function (module) {
    mifosX.controllers = _.extend(module, {
        profileToProfileController: function (scope,routeParams,resourceFactory, location, API_VERSION, $rootScope,dateFilter, Upload,localStorageService) {
            scope.formData={};
            scope.first = {};
            scope.first.date = new Date();
            scope.first.transactionDate = new Date ();

            resourceFactory.paymentTypeTemplateResource.template(function (data) {
                scope.paymentTypes = data.allowedParents;
                //console.log(scope.paymentTypes);
            });

            function toObject(arr) {
                var rv = {};
                for (var i = 0; i < arr.length; ++i) {
                    rv[i] = arr[i];
                }
                return rv;
            }

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.officesarr = data;
                //console.log(scope.officesarr);
                //console.log(scope.officesarr[0].id);
                //angular.element('#toProfile').children().remove().end();
                //angular.element('#fromProfile').children().remove().end();
                for (var i = 0; i < scope.officesarr.length; ++i) {
                    if (scope.officesarr[i].profile_no) {
                        angular.element('#toProfile').append('<option value=' + scope.officesarr[i].profile_no + '>' + scope.officesarr[i].name + '</option>');
                        angular.element('#fromProfile').append('<option value=' + scope.officesarr[i].profile_no + '>' + scope.officesarr[i].name + '</option>');
                    }
                    /*else{
                        angular.element('#toProfile').append('<option value=' + scope.officesarr[i].id + '>' + scope.officesarr[i].name + '</option>');
                        angular.element('#fromProfile').append('<option value=' + scope.officesarr[i].id + '>' + scope.officesarr[i].name + '</option>');
                    } */
                }

                scope.offices = toObject(scope.officesarr);
                //console.log(scope.offices);
            });


            angular.element( '#profileToProfile' ).mousemove(function( event ) {
                //angular.element('#paymentTypeId option:contains("CASHOUT")').prop('selected',true);
                angular.element('#paymentTypeId option:contains("Transfer")').prop('selected',true);
                angular.element('#paymentTypeId').prop('disabled',true);
                angular.element('#transactionDate').prop('disabled',true);
            });

            scope.checkCardsSelected = function() {
                if ((angular.element('#fromProfile').val())===(angular.element('#toProfile').val())){
                    angular.element('#fromProfile').css('box-shadow','2px 2px 2px red');
                    angular.element('#toProfile').css('box-shadow','2px 2px 2px red');
                    swal({
                        title: 'Please NOTE that!',
                        text:  'A Profile Cannot Perform transaction within itself',
                        icon: 'info',
                        buttons: 'OK',
                        dangerMode: true,
                        onCloseClickOutside: false,
                    }).then(function () {
                        angular.element('#fromProfile').css('box-shadow','none');
                        angular.element('#toProfile').css('box-shadow','none');
                    });
                }
            }

            scope.performTransaction = function(){
                scope.fromProfile= angular.element('#fromProfile').val();
                scope.toProfile = angular.element('#toProfile').val();
                //scope.formData.transactionDate = angular.element('#transactionDate').val();
                scope.formData.transactionAmount = (angular.element('#transactionAmount').val().replace(/,/g ,''));
                //scope.formData.paymentTypeId = parseInt(angular.element('#paymentTypeId').val().split(':')[1]);
                //scope.formData.note = angular.element('#note').val();

                if (scope.fromProfile === scope.toProfile){
                    angular.element('#fromProfile').css('box-shadow','2px 2px 2px red');
                    angular.element('#toProfile').css('box-shadow','2px 2px 2px red');
                    swal({
                        title: 'A Profile Cannot Perform transaction within itself',
                        text:  'Profile Selection/Specification Error',
                        icon: 'warning',
                        buttons: 'OK',
                        dangerMode: true,
                        onCloseClickOutside: false,
                    }).then(function () {
                        angular.element('#fromProfile').css('box-shadow','none');
                        angular.element('#toProfile').css('box-shadow','none');
                    });
                }else{
                    console.log(scope.formData);
                    resourceFactory.profileToProfileResource.profileToProfileTransfer({fromProfile:scope.fromProfile,toProfile:scope.toProfile},scope.formData,function (data) {
                        console.log(data);
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
                                location.path('/cardOperationsDetailedInfo/'+localStorageService.getFromLocalStorage('clickedClientID'));
                            });
                        }
                    });
                }
            }
            angular.element(document).ready( function () {
                setTimeout(function(){
                    scope.validate = new jaidsValidator();
                    scope.validate.formValidationInit('profileToProfile', 'submit',  scope.performTransaction);
                },500);
            });
        }
});
mifosX.ng.application.controller('profileToProfileController', ['$scope','$routeParams', 'ResourceFactory', '$location',
    'API_VERSION', '$rootScope','dateFilter', 'Upload','localStorageService', mifosX.controllers.profileToProfileController]).run(function ($log) {
    $log.info("profileToProfileController initialized");
});
}(mifosX.controllers || {}));