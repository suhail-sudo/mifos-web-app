(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateUserController: function (scope, resourceFactory, location) {
            scope.offices = [];
            scope.available = [];
            scope.selected = [];
            scope.selectedRoles = [] ;
            scope.availableRoles = [];
            scope.selfUserType = "Agent"; 
            scope.clientsPerPage = 10;
            scope.pageNumber = 1;
            scope.view ={};
            scope.formData = {
                sendPasswordToEmail: true,
                roles: []
            };
            scope.formData.isSelfServiceUser = true;
            scope.users = [];
            resourceFactory.userTemplateResource.get(function (data) {
                scope.offices = data.allowedOffices;
                scope.availableRoles = data.availableRoles;
                scope.users = data.availableRoles;
            });
            
            resourceFactory.userResource.getAllUsers(function (data) {
                scope.users = data;
            });

            scope.changeSelfUserType = function(){
                if(scope.view.isAgent){
                    scope.selfUserType = "Agent";
                    resourceFactory.clientResource.getAllClients({
                        offset: ((scope.pageNumber - 1) * scope.clientsPerPage),
                        limit: scope.clientsPerPage,
                        getAgents : true,
                        officeId:scope.formData.officeId
                    }, function (data) {
                        scope.clients = data.pageItems;
                    });
                }else{
                    scope.selfUserType = "Client";
                    resourceFactory.clientResource.getAllClients({
                        offset: ((scope.pageNumber - 1) * scope.clientsPerPage),
                        limit: scope.clientsPerPage,
                        officeId:scope.formData.officeId
                    }, function (data) {
                        scope.clients = data.pageItems;
                    });
                }
            }
            //scope.changeSelfUserType();
            scope.loadNextClients = function(){
                scope.pageNumber++;
                scope.changeSelfUserType();
            }
            scope.loadPreviousClients = function(){
                scope.pageNumber--;
                scope.changeSelfUserType();
            }

            scope.addRole = function () {
                for (var i in this.available) {
                    for (var j in scope.availableRoles) {
                        if (scope.availableRoles[j].id == this.available[i]) {
                            var temp = {};
                            temp.id = this.available[i];
                            temp.name = scope.availableRoles[j].name;
                            scope.selectedRoles.push(temp);
                            scope.availableRoles.splice(j, 1);
                        }
                    }
                }
                //We need to remove selected items outside of above loop. If we don't remove, we can see empty item appearing
                //If we remove available items in above loop, all items will not be moved to selectedRoles
                for (var i in this.available) {
                    for (var j in scope.selectedRoles) {
                        if (scope.selectedRoles[j].id == this.available[i]) {
                            scope.available.splice(i, 1);
                        }
                    }
                }
            };
            scope.removeRole = function () {
                for (var i in this.selected) {
                    for (var j in scope.selectedRoles) {
                        if (scope.selectedRoles[j].id == this.selected[i]) {
                            var temp = {};
                            temp.id = this.selected[i];
                            temp.name = scope.selectedRoles[j].name;
                            scope.availableRoles.push(temp);
                            scope.selectedRoles.splice(j, 1);
                        }
                    }
                }
                //We need to remove selected items outside of above loop. If we don't remove, we can see empty item appearing
                //If we remove selected items in above loop, all items will not be moved to availableRoles
                for (var i in this.selected) {
                    for (var j in scope.availableRoles) {
                        if (scope.availableRoles[j].id == this.selected[i]) {
                            scope.selected.splice(i, 1);
                        }
                    }
                }
            };

            scope.getOfficeStaff = function(){
                scope.changeSelfUserType();
                resourceFactory.employeeResource.getAllEmployees({officeId:scope.formData.officeId},function (data) {
                    scope.staffs = data;
                });
            };

            scope.submit = function () {
                for (var i in scope.selectedRoles) {
                    scope.formData.roles.push(scope.selectedRoles[i].id) ;
                }
                if(scope.formData.isSelfServiceUser){
                    scope.formData.clients = [];
                    scope.formData.clients.push(scope.view.clientId) ;
                }
                resourceFactory.userListResource.save(this.formData, function (data) {
                    location.path('/viewuser/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateUserController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateUserController]).run(function ($log) {
        $log.info("CreateUserController initialized");
    });
}(mifosX.controllers || {}));
