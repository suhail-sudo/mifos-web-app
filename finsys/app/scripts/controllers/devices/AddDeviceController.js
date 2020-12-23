(function (module) {
    mifosX.controllers = _.extend(module, {
       AddDeviceController: function (scope, localStorageService, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams) {
           scope.userDetails = localStorageService.getFromLocalStorage('userData');
    	   scope.formData = {};
    	   scope.availableRoles = [];
    	   scope.manufacturerOptionData = [];
    	   scope.formData.isActive = true;
    	   resourceFactory.userListResource.getAllUsers(function (data) {
    		   scope.users = data;
           });
			resourceFactory.userDeviceTemplateResource.get(function (data) {
				scope.manufacturerOptionData = data.manufaturerOptionData;
				scope.modelOptionData = data.modelOptionData;
            });
			
			
           scope.submit = function () {
        	   this.formData.locale = scope.optlang.code;
        	    var startDate = dateFilter(scope.first.startDate, scope.df);
                var endDate = dateFilter(scope.first.endDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.startDate = startDate;
                this.formData.endDate = endDate;
               this.formData.isActive = this.formData.isActive || false;
               resourceFactory.userDeviceResource.save(this.formData, function (data) {
                   location.path('/viewdevice/' + data.resourceId);
               });
           };
           

       }
    });
    mifosX.ng.application.controller('AddDeviceController', ['$scope', 'localStorageService', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', mifosX.controllers.AddDeviceController]).run(function ($log) {
        $log.info("AddDeviceController initialized");
    });
}(mifosX.controllers || {}))