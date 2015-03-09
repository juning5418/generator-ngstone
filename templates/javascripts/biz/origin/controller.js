'use strict';
/**
 * @ngdoc function
 * @name <%= scriptAppName %>.controller:<%= classedName %>Ctrl
 * @description
 * # <%= classedName %>Ctrl
 * Controller of the <%= scriptAppName %>
 */
angular.module('<%= scriptAppName %>')
    .controller('<%= classedName %>Ctrl', function ($scope,resourcePool,msgService,dialogService) {
        var resourceClass = resourcePool.<%= cameledName %>;
        var openDialogForm = function (resourceInst,done) {
            dialogService.complexBox({
                templateUrl: './views/<%= dashedName %>/dialog-form.html',
                onComplete: function (dialogScope, dialogInstance) {
                    dialogScope.isEdit = !!resourceInst;
                    dialogScope.<%= cameledName %> = resourceInst ? resourceInst.copy() : {};
                    dialogScope.ok = function () {
                        if (dialogScope.dialogForm.$invalid) {
                            return;
                        }
                        if (dialogScope.isEdit) {
                            dialogScope.<%= cameledName %>.$update(function () {
                                dialogInstance.close();
                                done && done(dialogScope.<%= cameledName %>);
                            })
                        } else {
                            resourceClass.new(dialogScope.<%= cameledName %>, function (resource) {
                                dialogInstance.close();
                                done && done(resource);
                            })
                        }
                    };
                }
            })
        };
        angular.extend($scope,{
            currentPage: 1,
            searchParams:{},
            doSearch:function () {
                $scope.searchParams.currentPage = $scope.currentPage;
                resourceClass.query($scope.searchParams, function (resources,data) {
                    $scope.resources = resources;
                    $scope.totalItems = data.totalCount;
                })
            },
            inputKeyup: function (ev) {
                if(ev.keyCode === 13){
                    $scope.doSearch();
                }
            },
            newRc: function () {
                openDialogForm(null, function (newReource) {
                    $scope.resources.unshift(newReource);
                    msgService.success('新增成功');
                })
            }<%
        var tableCfg = bizCfg.dataGrid.gridTable,
        operation = tableCfg.operation,
        opBtn;
        for(var i = 0,l = operation.length;i < l;i++){
                opBtn = operation[i]; %>,
            <%= opBtn.method  || ('opMethod' + i) %>: function(rcItem,index) {<%
            if(opBtn.method === 'modify'){ %>
                openDialogForm(rcItem, function (newResource) {
                    $scope.resources[index] = newResource;
                    msgService.success('修改成功');
                })<%
            } else
            if(opBtn.method === 'del'){ %>
                dialogService.confirm('确定删除吗？', function () {
                    rcItem.$delete(function () {
                        $scope.resources.splice(index, 1);
                        msgService.success('删除成功');
                    })
                })<%
            } else { %>
                <% } %>
            }<%
        } %>
        });
        $scope.doSearch();
    });
