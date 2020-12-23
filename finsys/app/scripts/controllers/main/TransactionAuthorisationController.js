
(function (module) {
    mifosX.controllers = _.extend(module, {
        TransactionAuthorisationController: function (scope, resourceFactory, $uibModal, $rootScope ,  notificationService) {
            $rootScope.enterOTP = function (auditId, tranTimeOut) {
                notificationService.showWarning("Transaction Requies OTP authorisation!");
                $uibModal.open({
                    backdrop  : 'static',
                    keyboard  : false,
                    templateUrl: 'sendOTP.html',
                    controller: ClientDeleteCtrl,
                    resolve: {
                        auditId: function(){
                            return auditId;
                        },
                        tranTimeOut : function(){
                            return tranTimeOut;
                        }
                    },
                });

               
            };

            var ClientDeleteCtrl = function ($scope, $uibModalInstance, auditId, tranTimeOut) {
                console.log(auditId);
                $scope.tranTimeOut = tranTimeOut > 10 ? tranTimeOut - 10 : 0 ;
                $scope.sendOTP = function () { 
                    resourceFactory.transactionAuthResource.save({auditId: auditId, authToken:$scope.authToken, command:"authorise"}, {}, function (data) {
                        notificationService.showSuccess("Transaction posted successfully!");
                        $uibModalInstance.dismiss();
                        if(!data.rollbackTransaction)
                            window.history.back();
                    });
                };
                $scope.requestOTP = function () {
                    resourceFactory.transactionAuthResource.save({auditId: auditId, command:"requestOTP"}, {}, function (data) {
                        notificationService.showSuccess("New OTP request sent successfully!");
                    });
                }
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            //$rootScope.enterOTP (0,150);
        }
    });
    mifosX.ng.application.controller('TransactionAuthorisationController', ['$scope', 'ResourceFactory', '$uibModal', '$rootScope', 'NotificationService', mifosX.controllers.TransactionAuthorisationController]).run(function ($log) {
        $log.info("TransactionAuthorisationController initialized");
    });
}(mifosX.controllers || {}));


