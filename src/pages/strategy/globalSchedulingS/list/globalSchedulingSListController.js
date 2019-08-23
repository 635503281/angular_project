(function(app){
    "use strict";

    app.controller("globalSchedulingSListCtrl",globalSchedulingSListCtrl);
    globalSchedulingSListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function globalSchedulingSListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.globalSchedulingS_pagingOptions){
                $scope.pagingOptions=$rootScope.globalSchedulingS_pagingOptions;
                
            }else{
                //分页参数
                $scope.pagingOptions={
                    pageSizes: [10, 20, 30, 50, 100],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,// 存放list总记录数
                    maxPages: 1,// 最大页数
                };
            }
            

            //展示数据
            $scope.items=[
                // {id:1,domain:"www.baidu.com",status:0,ttl:20,policy:1}
            ];
            $scope.selectItems=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                    },
                    {field:"status",title:$translate.instant("status"),align:"left",sort:true,minWidth:120,
                     templet:function(d){
                        switch(d.status){
                            case 0:return $translate.instant("status_0");break;
                            case 1:return $translate.instant("status_1");break;
                        }
                        return "--"
                     }
                    },
                    {field:"ttl",title:$translate.instant("ttl"),align:"left",minWidth:120,
                     templet:`<div>{{d.ttl||"--"}}</div>`
                    },
                    {field:"policy",title:$translate.instant("policy"),align:"left",sort:true,minWidth:150,
                     templet:function(d){
                        switch(d.policy){
                            case 0:return $translate.instant("policy_t0");break;
                            case 1:return $translate.instant("policy_t1");break;
                            case 2:return $translate.instant("policy_t2");break;
                            case 3:return $translate.instant("policy_t3");break;
                            case 4:return $translate.instant("policy_t4");break;
                            case 5:return $translate.instant("policy_t5");break;
                        }
                        return "--"
                     }
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:120,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.globalSchedulingS.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.globalSchedulingS.modifyName}></button>
                        <button class="btn icon_issued {{${$rootScope.globalSchedulingS.issuedBtn}?'':'none'}}" lay-event="issued" title=${$rootScope.globalSchedulingS.issuedName}></button>
                        <button class="btn icon_delete {{${$rootScope.globalSchedulingS.deleteBtn}?'':'none'}}" lay-event="del" title=${$rootScope.globalSchedulingS.deleteName}></button>
                     </div></div>`
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数   
                   
            });
            
            //修改及删除
            layui.table.on("tool(tab)",function({data,event}){
          
                switch(event){
                    case "edit"://编辑
                        $rootScope.globalSchedulingS_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.strategy.globalSchedulingS.edit",{id:data.id});
                    break;
                    case "issued"://下发
                        let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/distribute";
                        $http.post(url,[data.id]).then(({data})=>{
                            if(data.success){
                                commonMethod.layuiTip($translate.instant("issued_S"));
                            }
                        }).catch((err)=>{});

                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/delete";
                            $http.post(url,[data.id]).then(({data})=>{        
                                if(data.success){
                                    commonMethod.layuiTip($translate.instant("delete_S"));
                                    $scope.getPageData(); 
                                }
                                                  
                            }).catch((err)=>{});

                        },()=>{});
                      
                    break;
                }

            });

            //监听选中
            layui.table.on('checkbox(tab)',function(obj){
                $scope.$apply(function(){
                    $scope.selectItems=layui.table.checkStatus('tab').data;
                });
                
            });
        

            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/list";
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
                    })

                }else{
                    $scope.noData=true;
                }    

            }).catch((err)=>{ $scope.noData=true; });

        };

        //批量删除
        $scope.deleteMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/delete";
            let ids=$scope.selectItems.map((value)=>value.id);

            commonMethod.commonTip({tip:$translate.instant('isDeleteMore')}).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("delete_S"));
                        $scope.getPageData();
                    }
                }).catch((err)=>{});

            },()=>{});
        };

        //批量下发
        $scope.issuedMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/distribute";
            let ids=$scope.selectItems.map((value)=>value.id);

            commonMethod.commonTip({tip:$translate.instant('isIssuedMore')}).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("issued_S"));
                        $scope.getPageData();
                    }

                }).catch((err)=>{});
                
            },()=>{});
        };

        //全量下发
        $scope.issuedAll=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/policy/distributeAll";

            commonMethod.commonTip({tip:$translate.instant('isIssuedAll')}).then(function(){
                $http.post(url).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("issued_S"));
                        $scope.getPageData();
        
                    }

                }).catch((err)=>{});

            },()=>{});
        };

        $scope.init();

        delete $rootScope.globalSchedulingS_pagingOptions;
    };
    module.exports=globalSchedulingSListCtrl;

})(angular.module("app"));