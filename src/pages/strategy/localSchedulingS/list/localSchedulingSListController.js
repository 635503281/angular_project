(function(app){
    "use strict";

    app.controller("localSchedulingSListCtrl",localSchedulingSListCtrl);
    localSchedulingSListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","publicService"];
    function localSchedulingSListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,publicService){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.localSchedulingS_pagingOptions){
                $scope.pagingOptions=$rootScope.localSchedulingS_pagingOptions;
                $scope.searchOptions=$rootScope.localSchedulingS_searchOptions;

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
                    type:null,
                    domainName:null
                }
            }

            //展示数据
            $scope.items=[
                // {
                //     cpID:"123456",//cpID
                //     domainName:"www.baidu.com",//域名
                //     type:0,//名单类型 0-黑名单 1-白名单
                //     dispatchGroupID:"1245",//分组编号 
                //     validity:60,//有效期
                //     createTime:1233444444,//创建时间  
                // }
            ];

            //选中
            $scope.selectItems=[];

            //名单类型
            $scope.typeList=[{id:null,name:$translate.instant("all")},{id:0,name:$translate.instant("blacklist")},{id:1,name:$translate.instant("whitelist")}];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"cpID",title:$translate.instant("CPID"),align:"left",minWidth:120,
                     templet:`<div>{{d.cpID||"--"}}</div>`
                    },
                    {field:"domainName",title:$translate.instant("domainName"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.domainName}}">{{d.domainName||"--"}}</span></div>`
                    },
                    {field:"type",title:$translate.instant("type"),align:"left",minWidth:120,
                     templet:function(d){
                        switch(d.type){
                            case 0:return $translate.instant("blacklist");break;
                            case 1:return $translate.instant("whitelist");break;
                        }
                        return "--"
                     }
                    },
                    {field:"dispatchGroupID",title:$translate.instant("dispatchGroupID"),align:"left",minWidth:150,
                     templet:`<div>{{d.dispatchGroupID||"--"}}</div>`
                    },
                    {field:"dispatchGroupName",title:$translate.instant("dispatchGroupName"),align:"left",minWidth:150,
                     templet:`<div>{{d.dispatchGroupName||"--"}}</div>`
                    },
                    {field:"validity",title:$translate.instant("validity"),align:"left",minWidth:120,
                     templet:`<div>{{d.validity||"--"}}</div>`
                    },
                    {field:"createTime",title:$translate.instant("createTime"),align:"left",width:160,
                     templet:`<div><span title="{{new Date(d.createTime).format('yyyy-MM-dd hh:mm:ss')}}">{{new Date(d.createTime).format('yyyy-MM-dd hh:mm:ss')}}</span></div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:120,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.localSchedulingS.modifyBtn}?'':'none'}}" lay-event="edit"   title=${$rootScope.localSchedulingS.modifyName}></button>
                        <button class="btn icon_issued {{${$rootScope.localSchedulingS.issuedBtn}?'':'none'}}" lay-event="issued" title=${$rootScope.localSchedulingS.issuedName}></button>
                        <button class="btn icon_delete {{${$rootScope.localSchedulingS.deleteBtn}?'':'none'}}" lay-event="del"    title=${$rootScope.localSchedulingS.deleteName}></button>
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
                        $rootScope.localSchedulingS_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $rootScope.localSchedulingS_searchOptions=$scope.searchOptions;
                        $state.go("index.strategy.localSchedulingS.edit",{id:data.id});
                    break;
                    case "issued"://下发
                        let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/apply";
                        $http.post(url,[data.id]).then(({data})=>{
                            if(data.success){
                                commonMethod.layuiTip($translate.instant("issued_S"));
                            }
                        }).catch((err)=>{});

                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/delete";
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

        //搜索
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/list";
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize,
                search:{
                    type:$scope.searchOptions.type,
                    domainName:$scope.searchOptions.domainName
                }
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

        //批量删除
        $scope.deleteMore=()=>{
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/delete";
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
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/local/domain/apply";
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

        $scope.init();

        delete $rootScope.localSchedulingS_pagingOptions;
    };
    module.exports=localSchedulingSListCtrl;

})(angular.module("app"));