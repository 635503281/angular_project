(function(app){
    "use strict";

    app.controller("securityLogCtrl",securityLogCtrl);
    securityLogCtrl.$inject=["$scope","$http","$translate","publicService","commonMethod","ngDialog"];
    function securityLogCtrl($scope,$http,$translate,publicService,commonMethod,ngDialog){
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

            //查询字段
            $scope.searchOptions={
                times:null,//时间
                operateType:null,//类型 0-登录 1-登出 null-全部
                ip:null,//操作人ip
                userName:null,//用户名
            };

            //操作类型
            $scope.operateTypeList=[
                {id:null,name:$translate.instant("all")},
                {id:0,name:$translate.instant("login")},
                {id:1,name:$translate.instant("loginOut")}
            ];

            //展示数据
            $scope.items=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"createTime",title:$translate.instant("createTime"),sort:true,align:"left",minWidth:160,
                     templet:`<div>{{new Date(d.createTime).format("yyyy-MM-dd hh:mm:ss")}}</div>`
                    },
                    {field:"userName",title:$translate.instant("userName"),align:"left",minWidth:150,
                    templet:`<div>{{d.userName||"--"}}</div>`
                    },
                    {field:"ip",title:$translate.instant("IP"),align:"left",minWidth:180,
                    templet:`<div>{{d.ip||"--"}}</div>`
                    },
                    {field:"operateType",title:$translate.instant("type"),align:"left",minWidth:100,
                     templet:d=>{
                        for(let {id,name} of $scope.operateTypeList){
                            if(d.operateType==id&&d.operateType!=null)return name
                        }
                        return id||'--'
                     }
                    },   
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数
                
            });
          
            $scope.getPageData();
        };


        //分页
        $scope.getPageData=function(){
            let url=commonMethod.getServerUrl()+"/rest/security/log/query";

            let obj={
                start:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                num:$scope.pagingOptions.pageSize,

                userName:$scope.searchOptions.userName,
                ip:$scope.searchOptions.ip,
                operateType:$scope.searchOptions.operateType,
                startTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[0]:null,
                endTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[1]:null,
           
            }
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
    };
    module.exports=securityLogCtrl;

})(angular.module("app"));