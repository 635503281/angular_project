(function(app){
    "use strict";

    app.controller("resourceStrategyListCtrl",resourceStrategyListCtrl);
    resourceStrategyListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","$filter"];
    function resourceStrategyListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,$filter){
        //初始化
        $scope.init=()=>{
            //tab列表
            $scope.tabList=[
                {id:1,name:$rootScope.resourceStrategy.staticResourceConfigName, isShow:$rootScope.resourceStrategy.staticResourceConfigBtn},
                {id:2,name:$rootScope.resourceStrategy.dynamicResourceConfigName,isShow:$rootScope.resourceStrategy.dynamicResourceConfigBtn},  
            ];

            //当前tab页
            $scope.currentTab=$stateParams.currentTab!=null?$stateParams.currentTab:$filter('filter')($scope.tabList,{isShow:true})[0]?$filter('filter')($scope.tabList,{isShow:true})[0].id:0;

            //是否启动保存的分页参数
            if($scope.currentTab==1&&$rootScope.resourceStrategy_pagingOptions){
                $scope.pagingOptions=$rootScope.resourceStrategy_pagingOptions;
                
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

            //初始化加载tab
            $scope.initTab($scope.currentTab);

        };

        //tab切换
        $scope.switchTab=(index)=>{
            if($scope.currentTab!=index){
                $scope.currentTab=index;
                $scope.initTab(index);
            }
        };

        //初始化tab
        $scope.initTab=(index)=>{
            switch (index){
                case 2://动态回源配置

                    // 动态配置参数
                    $scope.item={
                        activeTCS:null,//主TCSIPv4地址
                        activeTCSv6:null,//主TCSIPv6地址
                        backupTCS:null,//备份TCS地址
                        backupTCSv6:null,//备TCSIPv6地址
                    };
                    $scope.getDynamicConfig();

                break;
                case 1://静态回源配置

                    //静态配置展示数据
                    $scope.items=[
                        // {id:1,domain:"www.baidu.com",sourceList:[{sourceIP:'127.0.0.1',sourceIPv6:"test",port:8080},{sourceIP:'127.0.0.1',sourceIPv6:null,port:8080}]}
                    ];
                    //选中
                    $scope.selectItems=[];

                    //初始化渲染table
                    $scope.table=layui.table.render({
                        elem:"#tab",
                        cols:[[
                            {type:"checkbox",field:"left"},
                            {field:"domain",title:$translate.instant("domain"),align:"left",
                             templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                            },
                            {field:"IP",title:$translate.instant("IP"),align:"left",
                             templet:function(d){
                                let ipList=d.sourceList.map((value,index)=>{ 
                                    if(value.sourceIPv6){
                                        return  `${value.sourceIP}:${value.port} , ${value.sourceIPv6}:${value.port}`
                                    }else{
                                        return `${value.sourceIP}:${value.port}`
                                    }
                                    
                                });
                                let ipStr=ipList.join(" | ");
                                return `<div title='${ipStr}'>${ipStr}</div>`
                             }
                            },
                            {title:$translate.instant("operation"),fixed:"right",align:"left",width:120,
                             toolbar:`<div><div class="operation_btn">
                                <button class="btn icon_modify {{${$rootScope.resourceStrategy.staticResourceConfig_modifyBtn}?'':'none'}}" lay-event="edit"   title=${$rootScope.resourceStrategy.staticResourceConfig_modifyName}></button>
                                <button class="btn icon_issued {{${$rootScope.resourceStrategy.staticResourceConfig_issuedBtn}?'':'none'}}" lay-event="issued" title=${$rootScope.resourceStrategy.staticResourceConfig_issuedName}></button>
                                <button class="btn icon_delete {{${$rootScope.resourceStrategy.staticResourceConfig_deleteBtn}?'':'none'}}" lay-event="del"    title=${$rootScope.resourceStrategy.staticResourceConfig_deleteName}></button>
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
                                $rootScope.resourceStrategy_pagingOptions=$scope.pagingOptions;//保存分页参数
                                $state.go("index.strategy.resourceStrategy.edit",{id:data.id});
                            break;
                            case "issued"://下发
                                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/apply";
                                $http.post(url,[data.id]).then(({data})=>{
                                    if(data.success){
                                        commonMethod.layuiTip($translate.instant("issued_S"));
                                    }
                                }).catch((err)=>{});

                            break;
                            case "del"://删除
                                commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                                    let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/delete";
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
                break;
                
            }
            
        };

        //获取动态配置
        $scope.getDynamicConfig=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/tcsAddr/get";
            $http.get(url).then(({data})=>{
                if(data.success){
                    $scope.item=data.data;
                }
            }).catch((err)=>{});
        };

        //下发动态资源配置
        $scope.issued=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/tcsAddr/save";
            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    commonMethod.layuiTip($translate.instant("issued_S"));
                }
            }).catch((err)=>{});
        };

        //动态配置分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/list";
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

        //批量删除
        $scope.deleteMore=()=>{
            let ids=$scope.selectItems.map((value)=>value.id);
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/delete";

            commonMethod.commonTip({tip:$translate.instant("isDeleteMore")}).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        $translate.instant("delete_S");
                        $scope.getPageData();
                    }
                }).catch((err)=>{});

            },()=>{});
        };

        //批量下发
        $scope.issuedMore=()=>{
            let ids=$scope.selectItems.map((value)=>value.id);
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/backtosource/sourceStrategyConfig/apply";
            
            commonMethod.commonTip({tip:$translate.instant("isIssuedMore")}).then(function(){
                $http.post(url,ids).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("issued_S"));
                        $scope.getPageData();
                    }
                }).catch((err)=>{});
                
            },()=>{});
        };

        $scope.init();

        delete $rootScope.resourceStrategy_pagingOptions;
    };
    module.exports=resourceStrategyListCtrl;

})(angular.module("app"));