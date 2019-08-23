(function(app){
    "use strict";

    app.controller("auxiliaryStrategyListCtrl",auxiliaryStrategyListCtrl);
    auxiliaryStrategyListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","publicService","ngDialog"];
    function auxiliaryStrategyListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,publicService,ngDialog){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.auxiliaryStrategy_pagingOptions){
                $scope.pagingOptions=$rootScope.auxiliaryStrategy_pagingOptions;
                $scope.searchOptions=$rootScope.auxiliaryStrategy_searchOptions;

            }else{
                //分页参数
                $scope.pagingOptions={
                    pageSizes: [10, 20, 30, 50, 100],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,// 存放list总记录数
                    maxPages: 1,// 最大页数
                };
                //搜索字段
                $scope.searchOptions={
                    cpId:null,
                    domain:null
                }
            }

            //优先级
            $scope.priorityList=[
                {id:0,name:$translate.instant("priority_b")},
                {id:1,name:$translate.instant("priority_f")},
            ];

            //类型
            $scope.typeList=[
                {id:1,name:$translate.instant("staticResource")},
                {id:2,name:$translate.instant("dynamicResource")},
                {id:3,name:"cname"},
                {id:4,name:"NS"}
            ];

            //展示数据
            $scope.items=[
                // {
                //     domain:"www.baidu.com",
                //     cpId:"0123",
                //     priority:1,
                //     type:1,
                //     staticIP:"",
                //     staticIPv6:"",
                //     dynamicIP:"",
                //     dynamicIPv6:"",
                //     cname:"www.test.com",
                //     nameserverIP:"",
                //     ipList:['1.1.1.1-10.10.10.10'],
                //     ipv6List:['1.1.1.1-10.10.10.10']
                // }
            ];

            //选中
            $scope.selectItems=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                    },
                    {field:"cpId",title:$translate.instant("cpId"),align:"left",minWidth:120,
                     templet:`<div><span title="{{d.cpId}}">{{d.cpId||"--"}}</span></div>`
                    },
                    {field:"priority",title:$translate.instant("priority"),align:"left",minWidth:120,
                     templet:function(d){
                        switch(d.priority){
                            case 0:return $translate.instant("priority_b");break;
                            case 1:return $translate.instant("priority_f");break;
                        }
                        return "--"
                     }
                    },
                    {field:"type",title:$translate.instant("type"),align:"left",minWidth:150,
                     templet:function(d){
                        for(let {id,name} of $scope.typeList){
                            if(d.type==id)return name
                        }
                        return "--"
                     }
                    },
                    {field:"staticIP",title:$translate.instant("staticIP"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.staticIP}}">{{d.staticIP||"--"}}</span></div>`
                    },
                    {field:"dynamicIP",title:$translate.instant("dynamicIP"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.dynamicIP}}">{{d.dynamicIP||"--"}}</span></div>`
                    },
                    {field:"cname",title:$translate.instant("cname"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.cname}}">{{d.cname||"--"}}</span></div>`
                    },
                    {field:"nameserverIP",title:$translate.instant("nameserverIP"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.nameserverIP}}">{{d.nameserverIP||"--"}}</span></div>`
                    },

                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.auxiliaryStrategy.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.auxiliaryStrategy.modifyName}></button>
                        <button class="btn icon_delete {{${$rootScope.auxiliaryStrategy.deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.auxiliaryStrategy.deleteName}></button>
                     </div></div>` 
                    //  <button class="btn icon_issued" lay-event="issued" title=${$translate.instant("issued")}></button>
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数      
                   
            });
            
            //修改及删除
            layui.table.on("tool(tab)",function({data,event}){
          
                switch(event){
                    case "edit"://编辑
                        $rootScope.auxiliaryStrategy_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $rootScope.auxiliaryStrategy_searchOptions=$scope.searchOptions;
                        $state.go("index.strategy.auxiliaryStrategy.edit",{id:data.id});
                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/deleteTCSAuxiliaryPolicy";
                            $http.post(url,{deleteList:[data.id]}).then(({data})=>{        
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

        //搜索
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/getTCSAuxiliaryPolicy";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                
                cpId:$scope.searchOptions.cpId,
                domain:$scope.searchOptions.domain
            };
            $http.post(url,obj).then(({data})=>{
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

        //全量下发
        $scope.issuedAll=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/sendTCSAuxiliaryPolicy";
            commonMethod.commonTip({tip:$translate.instant('isIssuedAll')}).then(function(){
                $http.get(url).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("issued_S"));
                        // $scope.getPageData();
                    }
    
                }).catch((err)=>{});

            },()=>{});
           
        };

        //批量删除
        $scope.deleteMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/deleteTCSAuxiliaryPolicy";
            let ids=$scope.selectItems.map(value=>value.id);

            commonMethod.commonTip({tip:$translate.instant('isDeleteMore')}).then(function(){
                $http.post(url,{deleteList:ids}).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("delete_S"));
                        $scope.getPageData();
                    }
                }).catch((err)=>{});

            },()=>{});
        };

        $scope.init();

        delete $rootScope.auxiliaryStrategy_pagingOptions;
    };
    module.exports=auxiliaryStrategyListCtrl;

})(angular.module("app"));