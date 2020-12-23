(function (module) {
    mifosX.controllers = _.extend(module, {
        EditUserController: function (scope, routeParams, resourceFactory, location) {

            scope.formData = {};
            scope.offices = [];
            scope.available = [];
            scope.selected = [];
            scope.selectedRoles = [] ;
            scope.availableRoles = [];

            scope.user = [];
            scope.formData.roles = [] ;

            resourceFactory.userListResource.get({userId: routeParams.id, template: 'true'}, function (data) {
                scope.formData.username = data.username;
                scope.formData.firstname = data.firstname;
                scope.formData.lastname = data.lastname;
                scope.formData.email = data.email;
                scope.formData.officeId = data.officeId;
                scope.formData.parentId = data.parentId;
                scope.formData.isSelfServiceUser = data.isSelfServiceUser;
                scope.view ={};
                scope.getOfficeStaff();
                if(data.staff){
                    scope.formData.staffId = data.staff.id;
                }
                scope.selectedRoles=data.selectedRoles;
                scope.availableRoles = data.availableRoles ;


                scope.userId = data.id;
                scope.offices = data.allowedOffices;
                if(data.clients[0]){
                    scope.view.isAgent = data.clients[0].isAgent;
                    scope.view.clientId = data.clients[0].id;
                    scope.view.clientData = data.clients[0];
                }
                scope.changeSelfUserType();
                
                //scope.availableRoles = data.availableRoles.concat(data.selectedRoles);
                scope.formData.passwordNeverExpires = data.passwordNeverExpires;
            });
            resourceFactory.userResource.getAllUsers(function (data) {
                scope.users = data;
            });

            scope.clientsPerPage = 2;
            scope.pageNumber = 1;
            scope.changeSelfUserType = function(){
                if(scope.view.isAgent){
                    scope.selfUserType = "Agent"
                    resourceFactory.clientResource.getAllClients({
                        offset: ((scope.pageNumber - 1) * scope.clientsPerPage),
                        limit: scope.clientsPerPage,
                        getAgents : true,
                        officeId:scope.formData.officeId
                    }, function (data) {
                        scope.clients = data.pageItems;
                        if(undefined == _.find(scope.clients, function(client){ return client.id == scope.view.clientId})){
                            scope.clients.push(scope.view.clientData);
                        }
                    });
                }else{
                    scope.selfUserType = "Client";
                    resourceFactory.clientResource.getAllClients({
                        offset: ((scope.pageNumber - 1) * scope.clientsPerPage),
                        limit: scope.clientsPerPage,
                        officeId:scope.formData.officeId
                    }, function (data) {
                        scope.clients = data.pageItems;
                        if(!_.find(scope.clients, function(client){ return client.id == scope.view.clientId})){
                            scope.clients.push(scope.view.clientData);
                        }
                    });
                }
            }
            
            scope.loadNextClients = function(){
                scope.pageNumber++;
                scope.changeSelfUserType();
            }
            scope.loadPreviousClients = function(){
                scope.pageNumber--;
                scope.changeSelfUserType();
            }
            scope.getOfficeStaff = function(){
                scope.changeSelfUserType();
                resourceFactory.employeeResource.getAllEmployees({officeId:scope.formData.officeId},function (staffs) {
                    scope.staffs = staffs;
                });
            };

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

            scope.submit = function () {
                for (var i in scope.selectedRoles) {
                    scope.formData.roles.push(scope.selectedRoles[i].id) ;
                }
                if(scope.formData.isSelfServiceUser){
                    scope.formData.clients = [];
                    scope.formData.clients.push(scope.view.clientId);
                }
                resourceFactory.userListResource.update({'userId': scope.userId}, this.formData, function (data) {
                    location.path('/viewuser/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditUserController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditUserController]).run(function ($log) {
        $log.info("EditUserController initialized");
    });
}(mifosX.controllers || {}));
