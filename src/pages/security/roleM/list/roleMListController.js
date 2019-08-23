(function(app){
    "use strict";

    app.controller("roleMListCtrl",roleMListCtrl);
    roleMListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","loginService"];
    function roleMListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,loginService){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.roleM_pagingOptions){
                $scope.pagingOptions=$rootScope.roleM_pagingOptions;
                $scope.searchOptions=$rootScope.roleM_searchOptions;   
            }else{
                //分页参数
                $scope.pagingOptions={
                    pageSizes: [10, 20, 30, 50, 100],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,// 存放list总记录数
                    maxPages: 1,// 最大页数
                };
                //搜索条件
                $scope.searchOptions={
                    queryKey:null,//用户名
                };
            }
            

            //展示数据
            $scope.items=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"name",title:$translate.instant("roleName"),align:"left",minWidth:150,
                     templet:`<div>{{d.name||"--"}}</div>`
                    },
                    {field:"creator",title:$translate.instant("createUser"),align:"left",minWidth:150,
                     templet:`<div>{{d.creator||"--"}}</div>`
                    },
                    {field:"description",title:$translate.instant("description"),align:"left",minWidth:150,
                     templet:`<div>{{d.description||"--"}}</div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.roleM.modifyBtn}?'':'none'}}" lay-event="edit"  title=${$rootScope.roleM.modifyName}></button>
                        <button class="btn icon_delete {{${$rootScope.roleM.deleteBtn}?'':'none'}}" lay-event="delete" {{d.name!="sysadmin"?'':'disabled'}} title=${$rootScope.roleM.deleteName}></button>
                     </div></div>`
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数      

            });
            
            //修改 删除
            layui.table.on("tool(tab)",function({data,event}){
                switch(event){
                    case "edit"://修改
                        $rootScope.roleM_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $rootScope.roleM_searchOptions=$scope.searchOptions;
                        $state.go("index.security.roleM.edit",{id:data.id});
                    break;
                    case "delete"://删除
                        commonMethod.commonTip({tip:$translate.instant("isDelete")}).then(()=>{
                            let url=commonMethod.getServerUrl()+"/rest/roleManagement/role/deleteRole?id="+data.id;
                            $http.get(url).then(({data})=>{
                                if(data.success){
                                    commonMethod.layuiTip($translate.instant("delete_S"));
                                    $scope.getPageData();
                                }

                            }).catch(()=>{});
                        });
                    break;

                }

            });

            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            let url=commonMethod.getServerUrl()+"/rest/roleManagement/role/getList";
            let obj={
                queryKey:$scope.searchOptions.queryKey,
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize
            };
            $http.get(url,{params:obj}).then(({data})=>{
                if(data.success&&data.data.list.length>0){
                    $scope.pagingOptions.total=data.data.total;
                    $scope.pagingOptions.maxPages=Math.ceil($scope.pagingOptions.total/$scope.pagingOptions.pageSize);

                    $scope.items=data.data.list;
                    $scope.noData=false;

                    //重新加载表格
                    $scope.table.reload({
                        data:$scope.items,
                        limit:$scope.items.length
                    });

                }else{
                    $scope.noData=true;
                }
                
            }).catch((err)=>{ $scope.noData=true; });

        };

        //查询
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        $scope.init();

        delete $rootScope.roleM_pagingOptions;
        delete $rootScope.roleM_searchOptions;
    };
    module.exports=roleMListCtrl;

})(angular.module("app"));