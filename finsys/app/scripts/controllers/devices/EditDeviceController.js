(function (module) {
    mifosX.controllers = _.extend(module, {
       EditDeviceController: function (scope, localStorageService, resourceFactory, location, http, API_VERSION, Upload, $rootScope, routeParams, dateFilter) {
           scope.userDetails = localStorageService.getFromLocalStorage('userData');
           scope.formData = {};
           scope.manufaturerOptionData = [];
           scope.modelOptionData = [];
           scope.deviceId =  routeParams.id;
           resourceFactory.userListResource.getAllUsers(function (data) {
               scope.users = data;
           });
           resourceFactory.userDeviceTemplateResource.get(function (data) {
                scope.manufaturerOptionData = data.manufaturerOptionData;
                scope.modelOptionData = data.modelOptionData;
           });
            
            scope.first = {};
           resourceFactory.userDeviceResource.get({deviceId: routeParams.id}, function (data) {
                scope.device = data;
                scope.formData.primaryImei = data.imei1;
                scope.formData.secondaryImei = data.imei2;
                scope.first.startDate = new Date(dateFilter(data.startDate, scope.df));
                scope.first.endDate = new Date(dateFilter(data.endDate, scope.df));
                scope.formData.isActive = data.isActive;
                if(data.manufactrerId){
                    scope.formData.manufacturerId = data.manufactrerId;
                }
                if(data.deviceModel){
                    scope.formData.modelId = data.deviceModel.id;
                }
                if(data.appuserId){
                       scope.formData.appuserId = data.appuserId;
                }
            
            });
            
            
           scope.submit = function () {
               this.formData.locale = scope.optlang.code;
               this.formData.isActive = this.formData.isActive || false;
               var startDate = dateFilter(scope.first.startDate, scope.df);
                var endDate = dateFilter(scope.first.endDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.startDate = startDate;
                this.formData.endDate = endDate;
               resourceFactory.userDeviceResource.update({deviceId: routeParams.id}, this.formData, function (data) {
                   location.path('/viewdevice/' + data.resourceId);
               });
           };
           

       }
    });
    mifosX.ng.application.controller('EditDeviceController', ['$scope', 'localStorageService', 'ResourceFactory', '$location', '$http', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', 'dateFilter', mifosX.controllers.EditDeviceController]).run(function ($log) {
        $log.info("EditDeviceController initialized");
    });
}(mifosX.controllers || {}));