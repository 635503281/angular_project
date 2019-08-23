(function(app){
    "use strict";

    app.controller("globalSchedulingDListCtrl",globalSchedulingDListCtrl);
    globalSchedulingDListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function globalSchedulingDListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.globalSchedulingD_pagingOptions){
                $scope.pagingOptions=$rootScope.globalSchedulingD_pagingOptions;
                
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
                // {id:1,domain:"www.baidu.com",nodeID:1,groupID:1,groupName:"test"}
            ];
            $scope.selectItems=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:200,
                     templet:d=>{
                        // 解析域名list 
                        let str=d.domainList.map(value=>value.domainName).join(" | ");
                        return `<span title="${str}">${str}</span>`
                     }
                    },
                    {field:"nodeID",title:$translate.instant("nodeID"),align:"left",sort:true,minWidth:120,
                     templet:`<div>{{d.nodeID||"--"}}</div>`
                    },
                    {field:"groupID",title:$translate.instant("groupID"),align:"left",sort:true,minWidth:150,
                     templet:`<div>{{d.groupID||"--"}}</div>`
                    },
                    {field:"groupName",title:$translate.instant("groupName"),align:"left",minWidth:150,
                     templet:`<div>{{d.groupName||"--"}}</div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.globalSchedulingD.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.globalSchedulingD.modifyName}></button>
                        <!--<button class="btn icon_issued" lay-event="issued" title=${$translate.instant("issued")}></button>-->
                        <button class="btn icon_delete {{${$rootScope.globalSchedulingD.deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.globalSchedulingD.deleteName}></button>
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
                        $rootScope.globalSchedulingD_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.strategy.globalSchedulingD.edit",{id:data.id});
                    break;
                    case "issued"://下发
                        let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/apply";
                        $http.post(url,[data.id]).then(({data})=>{
                            if(data.success){
                                commonMethod.layuiTip($translate.instant("issued_S"));
                            }
                        }).catch((err)=>{});

                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete'),message:$translate.instant("globalSchedulingD_del_tip")}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/delete";
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
                
            })
        

            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            $scope.selectItems=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/list";
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
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/delete";
            let ids=$scope.selectItems.map((value)=>value.id);

            commonMethod.commonTip({tip:$translate.instant('isDeleteMore'),message:$translate.instant("globalSchedulingD_del_tip")}).then(function(){
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
            let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/global/domain/apply";
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

        delete $rootScope.globalSchedulingD_pagingOptions;
    };
    module.exports=globalSchedulingDListCtrl;

})(angular.module("app"));