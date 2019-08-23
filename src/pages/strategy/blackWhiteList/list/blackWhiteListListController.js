(function(app){
    "use strict";

    app.controller("blackWhiteListListCtrl",blackWhiteListListCtrl);
    blackWhiteListListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function blackWhiteListListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.blackWhiteList_pagingOptions){
                $scope.pagingOptions=$rootScope.blackWhiteList_pagingOptions;
                $scope.searchOptions=$rootScope.blackWhiteList_searchOptions;
                
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
                    host:null
                }
            }
            

            //展示数据
            $scope.items=[];

            //选中
            $scope.selectItems=[];

            //名单类型
            $scope.typeList=[
                {id:0,name:$translate.instant("whiteList")},
                {id:1,name:$translate.instant("blackList")},
            ]

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"tcsIpListType",title:$translate.instant("type"),align:"left",sort:true,minWidth:130,
                     templet:d=>{
                         switch(d.tcsIpListType){
                             case 0:return $translate.instant("whiteList");break;
                             case 1:return $translate.instant("blackList");break;
                         }
                         return "--"
                     }
                    },
                    {field:"domain",title:$translate.instant("domain"),align:"left",sort:true,minWidth:150,
                     templet:`<div>{{d.host||"--"}}</div>`
                    },
                    {field:"ipv4List",title:$translate.instant("ipv4List"),align:"left",minWidth:150,
                     templet:`<div>{{d.ipv4list||"--"}}</div>`
                    },
                    {field:"ipv6List",title:$translate.instant("ipv6List"),align:"left",minWidth:160,
                     templet:`<div>{{d.ipv6list||"--"}}</div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.blackWhiteList.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.blackWhiteList.modifyName}></button>
                        <button class="btn icon_delete {{${$rootScope.blackWhiteList.deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.blackWhiteList.deleteName}></button>
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
                        $rootScope.blackWhiteList_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $rootScope.blackWhiteList_searchOptions=$scope.searchOptions;
                        $state.go("index.strategy.blackWhiteList.edit",{id:data.id});
                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/deleteTCSIpBlackWhiteList";
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
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/getTCSIpBlackWhiteList";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                host:$scope.searchOptions.host
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
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/sendTCSIpBlackWhiteList";
            commonMethod.commonTip({tip:$translate.instant('isIssuedAll')}).then(function(){
                $http.get(url).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("issued_S"));
                    }
                }).catch((err)=>{});
            });
    
        };

        //批量删除
        $scope.deleteMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/deleteTCSIpBlackWhiteList";
            let ids=$scope.selectItems.map(value=>value.id);

            commonMethod.commonTip({tip:$translate.instant('isDeleteMore')}).then(function(){
                $http.post(url,{deleteList:ids}).then(({data})=>{
                    if(data.success){
                        commonMethod.layuiTip($translate.instant("delete_S"));
                        $scope.getPageData();
                    }
                }).catch((err)=>{});
            });
        };

        $scope.init();

        delete $rootScope.blackWhiteList_pagingOptions;
    };
    module.exports=blackWhiteListListCtrl;

})(angular.module("app"));