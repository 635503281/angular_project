(function(app){
    "use strict";

    app.controller("policyConfigListCtrl",policyConfigListCtrl);
    policyConfigListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod","$filter"];
    function policyConfigListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod,$filter){
        //初始化
        $scope.init=()=>{
            //tablist
            $scope.tabList=[
                {id:1,name:$rootScope.policyConfig.injectPolicyName,isShow:$rootScope.policyConfig.injectPolicyBtn},
                {id:2,name:$rootScope.policyConfig.distributePolicyName,isShow:$rootScope.policyConfig.distributePolicyBtn},
                {id:3,name:$rootScope.policyConfig.syncPolicyName,isShow:$rootScope.policyConfig.syncPolicyBtn}
            ];
            let tabId=$filter('filter')($scope.tabList,{isShow:true})[0]?$filter('filter')($scope.tabList,{isShow:true})[0].id:0;
            //当前tab页
            $scope.currentTab=sessionStorage.getItem("policyConfig_type")?parseInt(sessionStorage.getItem("policyConfig_type")):tabId;
            
            $scope.initTab($scope.currentTab);
    
        };

        //tab切换
        $scope.switchTab=(index)=>{
            if($scope.currentTab!=index){
                $scope.currentTab=index;
                sessionStorage.setItem("policyConfig_type",$scope.currentTab);
                $scope.initTab(index);
            }
        };

        //初始化tab
        $scope.initTab=(index)=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.policyConfig_pagingOptions){
                $scope.pagingOptions=$rootScope.policyConfig_pagingOptions;
                
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
            $scope.items=[];

            if(!index)return;

            switch(index){
                case 1://注入
                    //初始化渲染table
                    $scope.table=layui.table.render({
                        elem:"#tab",
                        cols:[[
                            {field:"policyType",title:$translate.instant("policyType"),align:"left",minWidth:120,
                            templet:d=>{
                                switch(d.policyType){
                                    case 0:return $translate.instant("policyType_0");break;
                                    case 1:return $translate.instant("injectPolicy");break;
                                }
                                return "--";
                            }
                            },
                            {field:"cpId",title:$translate.instant("cpId"),align:"left",minWidth:120,
                            templet:`<div><span title="{{d.cpId}}">{{d.cpId||"--"}}</span></div>`
                            },
                            {field:"url",title:$translate.instant("url"),align:"left",minWidth:200,
                            templet:`<div><span title="{{d.url}}">{{d.url||"--"}}</span></div>`
                            },
                            {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:120,
                            templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                            }, 
                            {field:"fileType",title:$translate.instant("fileType"),align:"left",minWidth:120,
                            templet:`<div>{{d.fileType||"--"}}</div>`
                            },
                            {field:"effectiveTime",title:$translate.instant("effectiveTime"),align:"left",minWidth:300,
                            templet:d=>{
                                if(d.startTime){
                                    return new Date(d.startTime).format("yyyy-MM-dd hh:mm:ss") +" ~ "+ new Date(d.endTime).format("yyyy-MM-dd hh:mm:ss")
                                }else return "--";
                            }
                            },  
                            {field:"delayedHours",title:$translate.instant("delayedHours")+"(h)",align:"left",minWidth:200,
                            templet:`<div>{{d.delayedHours!=null?d.delayedHours:"--"}}</div>`
                            }, 
                            {field:"dailyTime",title:$translate.instant("dailyTime"),align:"left",minWidth:200,
                            templet:d=>{
                                if(d.dailyStartTime){
                                    return new Date(d.dailyStartTime).format("hh:mm:ss")+" ~ "+new Date(d.dailyEndTime).format("hh:mm:ss")
                                }else return "--";
                            }
                            },          
                            {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                            toolbar:`<div><div class="operation_btn">
                                <button class="btn icon_modify {{${$rootScope.policyConfig.injectPolicy_modifyBtn}?'':'none'}}"  lay-event="edit" title=${$rootScope.policyConfig.injectPolicy_modifyName}></button>
                                <button class="btn icon_delete {{${$rootScope.policyConfig.injectPolicy_deleteBtn}?'':'none'}}"  lay-event="del"  title=${$rootScope.policyConfig.injectPolicy_deleteName}></button>
                            </div></div>`
                            }
                        ]],
                        data:$scope.items,//数据
                        limit:$scope.items.length,//渲染显示的个数   
                        initSort:{field:"policyType",type:"asc"}   
                        
                    });
                    
                    //修改及删除
                    layui.table.on("tool(tab)",function({data,event}){
                
                        switch(event){
                            case "edit"://编辑
                                $rootScope.policyConfig_pagingOptions=$scope.pagingOptions;//保存分页参数
                                $state.go("index.content.policyConfig.edit",{id:data.id,type:index});
                            break;
                        
                            case "del"://删除
                                commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                                    let url=commonMethod.getServerUrl()+"/rest/content/deleteContentInjectPolicy";
                                    $http.post(url,{id:data.id}).then(({data})=>{       
                                        if(data.success){
                                            commonMethod.layuiTip($translate.instant("delete_S"));
                                            $scope.getPageData(); 
                                        }
                                                        
                                    }).catch((err)=>{});

                                },()=>{});
                            
                            break;
                        }

                    });
                break;
                case 2://分发
                    //初始化渲染table
                    $scope.table=layui.table.render({
                        elem:"#tab",
                        cols:[[
                            {field:"policyType",title:$translate.instant("policyType"),align:"left",minWidth:120,
                            templet:d=>{
                                switch(d.policyType){
                                    case 0:return $translate.instant("policyType_0");break;
                                    case 1:return $translate.instant("distributePolicy");break;
                                }
                                return "--";
                            }
                            },
                            {field:"cpId",title:$translate.instant("cpId"),align:"left",minWidth:120,
                            templet:`<div><span title="{{d.cpId}}">{{d.cpId||"--"}}</span></div>`
                            },
                            {field:"url",title:$translate.instant("url"),align:"left",minWidth:200,
                            templet:`<div><span title="{{d.url}}">{{d.url||"--"}}</span></div>`
                            },
                            {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:120,
                            templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                            }, 
                            {field:"fileType",title:$translate.instant("fileType"),align:"left",minWidth:120,
                            templet:`<div>{{d.fileType||"--"}}</div>`
                            }, 
                            {field:"effectiveTime",title:$translate.instant("effectiveTime"),align:"left",minWidth:300,
                            templet:d=>{
                                if(d.startTime){
                                    return new Date(d.startTime).format("yyyy-MM-dd hh:mm:ss") +" ~ "+ new Date(d.endTime).format("yyyy-MM-dd hh:mm:ss")
                                }else return "--";
                            }
                            }, 
                            {field:"distributeNodes",title:$translate.instant("distributeNodes"),align:"left",minWidth:200,
                             templet:d=>{
                                 if(d.distributeNodes&&d.distributeNodes.length>0){
                                     return d.distributeNodes.map(value=>value.nodeName)
                                 }else return "--"
                             }
                            }, 
                            {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                            toolbar:`<div><div class="operation_btn">
                                <button class="btn icon_modify {{${$rootScope.policyConfig.distributePolicy_modifyBtn}?'':'none'}}"  lay-event="edit" title=${$rootScope.policyConfig.distributePolicy_modifyName}></button>
                                <button class="btn icon_delete {{${$rootScope.policyConfig.distributePolicy_deleteBtn}?'':'none'}}"  lay-event="del"  title=${$rootScope.policyConfig.distributePolicy_deleteName}></button>
                            </div></div>`
                            }
                        ]],
                        data:$scope.items,//数据
                        limit:$scope.items.length,//渲染显示的个数   
                        initSort:{field:"policyType",type:"asc"}   
                        
                    });
                    
                    //修改及删除
                    layui.table.on("tool(tab)",function({data,event}){
                
                        switch(event){
                            case "edit"://编辑
                                $rootScope.policyConfig_pagingOptions=$scope.pagingOptions;//保存分页参数
                                $state.go("index.content.policyConfig.edit",{id:data.id,type:index});
                            break;
                        
                            case "del"://删除
                                commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                                    let url=commonMethod.getServerUrl()+"/rest/content/deleteContentDistributePolicy";
                                    $http.post(url,{id:data.id}).then(({data})=>{       
                                        if(data.success){
                                            commonMethod.layuiTip($translate.instant("delete_S"));
                                            $scope.getPageData(); 
                                        }
                                                        
                                    }).catch((err)=>{});

                                },()=>{});
                            
                            break;
                        }

                    });
                break;
                case 3://同步
                    //初始化渲染table
                    $scope.table=layui.table.render({
                        elem:"#tab",
                        cols:[[
                            {field:"policyType",title:$translate.instant("policyType"),align:"left",minWidth:120,
                            templet:d=>{
                                switch(d.policyType){
                                    case 0:return $translate.instant("policyType_0");break;
                                    case 1:return $translate.instant("synchroPolicy");break;
                                }
                                return "--";
                            }
                            },
                            {field:"cpId",title:$translate.instant("cpId"),align:"left",minWidth:120,
                            templet:`<div><span title="{{d.cpId}}">{{d.cpId||"--"}}</span></div>`
                            },
                            {field:"url",title:$translate.instant("url"),align:"left",minWidth:200,
                            templet:`<div><span title="{{d.url}}">{{d.url||"--"}}</span></div>`
                            },
                            {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:120,
                            templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                            }, 
                            {field:"fileType",title:$translate.instant("fileType"),align:"left",minWidth:120,
                            templet:`<div>{{d.fileType||"--"}}</div>`
                            }, 
                            {field:"effectiveTime",title:$translate.instant("effectiveTime"),align:"left",minWidth:300,
                            templet:d=>{
                                if(d.startTime){
                                    return new Date(d.startTime).format("yyyy-MM-dd hh:mm:ss") +" ~ "+ new Date(d.endTime).format("yyyy-MM-dd hh:mm:ss")
                                }else return "--";
                            }
                            }, 
                            {field:"syncNodes",title:$translate.instant("syncNodes"),align:"left",minWidth:200,
                            templet:d=>{
                                if(d.syncNodes&&d.syncNodes.length>0){
                                    return d.syncNodes.map(value=>value.nodeName)
                                }else return "--"
                            }
                           },           
                            {title:$translate.instant("operation"),width:100,fixed:"right",align:"left",
                            toolbar:`<div><div class="operation_btn">
                                <button class="btn icon_modify {{${$rootScope.policyConfig.syncPolicy_modifyBtn}?'':'none'}}"  lay-event="edit" title=${$rootScope.policyConfig.syncPolicy_modifyName}></button>
                                <button class="btn icon_delete {{${$rootScope.policyConfig.syncPolicy_deleteBtn}?'':'none'}}"  lay-event="del"  title=${$rootScope.policyConfig.syncPolicy_deleteName}></button>
                            </div></div>`
                            }
                        ]],
                        data:$scope.items,//数据
                        limit:$scope.items.length,//渲染显示的个数   
                        initSort:{field:"policyType",type:"asc"}   
                        
                    });
                    
                    //修改及删除
                    layui.table.on("tool(tab)",function({data,event}){
                
                        switch(event){
                            case "edit"://编辑
                                $rootScope.policyConfig_pagingOptions=$scope.pagingOptions;//保存分页参数
                                $state.go("index.content.policyConfig.edit",{id:data.id,type:index});
                            break;
                        
                            case "del"://删除
                                commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                                    let url=commonMethod.getServerUrl()+"/rest/content/deleteContentSyncPolicy";
                                    $http.post(url,{id:data.id}).then(({data})=>{       
                                        if(data.success){
                                            commonMethod.layuiTip($translate.instant("delete_S"));
                                            $scope.getPageData(); 
                                        }
                                                        
                                    }).catch((err)=>{});

                                },()=>{});
                            
                            break;
                        }

                    });
                break;
            }
            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            let url=commonMethod.getServerUrl();
            switch($scope.currentTab){
                case 1:url+="/rest/content/getContentInjectPolicy";break;
                case 2:url+="/rest/content/getContentDistributePolicy";break;
                case 3:url+="/rest/content/getContentSyncPolicy";break;
            }
            let obj={
                first:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                max:$scope.pagingOptions.pageSize
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

        $scope.init();

        delete $rootScope.policyConfig_pagingOptions;
    };
    module.exports=policyConfigListCtrl;

})(angular.module("app"));