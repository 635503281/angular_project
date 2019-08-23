
(function(app){
    'use strict';

    app.controller("onlineUserCtrl",onlineUserCtrl);
    onlineUserCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function onlineUserCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        
        //初始化
        $scope.init=()=>{
           
            //分页参数
            $scope.pagingOptions={
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                currentPage: 1,
                total: 0,// 存放list总记录数
                maxPages: 1,// 最大页数
            };

            //展示数据
            $scope.items=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"userName",title:$translate.instant("userName"),align:"left",
                      templet:`<div>{{d.userName||"--"}}</div>`   
                    },
                    {field:"ip",title:$translate.instant("IP"),align:"left",
                     templet:`<div>{{d.ip||"--"}}</div>`
                    },
                    {field:"loginTime",title:$translate.instant("loginTime"),align:"left",
                     templet:`<div>{{new Date(d.loginTime).format("yyyy-MM-dd hh:mm:ss")||"--"}}</div>`
                    },
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数     
                   
            });

            $scope.getPageData();
           
        };

        //分页
        $scope.getPageData=()=>{
            let url=commonMethod.getServerUrl()+"/rest/userManagement/user/getOnlineUser";
            let obj={
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
        
        $scope.init();
    };
    module.exports=onlineUserCtrl;


})(angular.module("app"));