(function (module) {
    mifosX.services = _.extend(module, {
        NotificationService: function ($rootScope, $timeout) {
            this.showSuccess = function (msg) {
                if(msg)
                    $rootScope.notiMsg = msg;
                else
                    $rootScope.notiMsg = "Action completed successfully!";
                $rootScope.showNoti = true;
                $rootScope.notiStatus = "success";
               $(window).scrollTop(0);
               $timeout(function() {
                    $rootScope.showNoti = false;
        
                }, 5000);
            };
            this.showError = function(msg){
                this.showFailure(msg);
            };
            this.showFailure = function (msg) {
                if(msg)
                    $rootScope.notiMsg = msg;
                else
                    $rootScope.notiMsg = "Something went wrong!";
                $rootScope.showNoti = true;
                $rootScope.notiStatus = "failure";
               $(window).scrollTop(0);
               $timeout(function() {
                    $rootScope.showNoti = false;
        
                }, 5000);
            };

            this.showWarning = function (msg) {
                if(msg)
                    $rootScope.notiMsg = msg;
                else
                    $rootScope.notiMsg = "Be carefull!";
                $rootScope.showNoti = true;
                $rootScope.notiStatus = "warning";
               $(window).scrollTop(0);
               $timeout(function() {
                    $rootScope.showNoti = false;
        
                }, 5000);
            };
        }
    });
    mifosX.ng.services.service('NotificationService', ['$rootScope','$timeout', mifosX.services.NotificationService]).run(function ($log) {
        $log.info("NotificationService initialized");
    });
}(mifosX.services || {}));