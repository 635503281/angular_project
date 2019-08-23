(function(app){
    "use strict";

    app.controller("badInfoListCtrl",badInfoListCtrl);
    badInfoListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function badInfoListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.badInfo_pagingOptions){
                $scope.pagingOptions=$rootScope.badInfo_pagingOptions;
                
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
                // {
                //     instruction:0,//指令类型
                //     url:"127.0.0.1",//违规的域名或URL
                // }
            ];

            //选中数据
            $scope.selectItems=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"instruction",title:$translate.instant("instruction"),sort:true,align:"left",
                     templet:function(d){
                        switch (d.instruction){
                            case 0:return $translate.instant("instruction_0");break;
                            case 1:return $translate.instant("instruction_1");break;
                        }
                        return "--"
                     }
                    },
                    {field:"url",title:$translate.instant("url"),align:"left",
                     templet:`<div><span title="{{d.url}}">{{d.url||"--"}}</span></div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:120,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.badInfo.modifyBtn}?'':'none'}}"  lay-event="edit" title="${$rootScope.badInfo.modifyName}"></button>
                        <button class="btn icon_issued {{${$rootScope.badInfo.issuedBtn}?'':'none'}}"  lay-event="issued" title="${$rootScope.badInfo.issuedName}"></button>
                        <button class="btn icon_delete {{${$rootScope.badInfo.deleteBtn}?'':'none'}}"  lay-event="del" title="${$rootScope.badInfo.deleteName}"></button>
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
                        $rootScope.badInfo_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.content.badInfo.edit",{id:data.id});
                    break;
                    case "issued"://下发
                        let url=commonMethod.getServerUrl()+"/rest/blackAcl/apply";
                        $http.post(url,[data.id]).then(({data})=>{        
                            if(data.success){
                                commonMethod.layuiTip($translate.instant("issued_S"));
                            }
                                                
                        }).catch((err)=>{});
    
                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/blackAcl/delete";
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

            let url=commonMethod.getServerUrl()+"/rest/blackAcl/getAll";
            let obj={
                pageNum:$scope.pagingOptions.currentPage,
                pageSize:$scope.pagingOptions.pageSize
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
            let url=commonMethod.getServerUrl()+"/rest/blackAcl/delete";
            let ids=$scope.selectItems.map(val=>val.id);
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
            let url=commonMethod.getServerUrl()+"/rest/blackAcl/apply";
            let ids=$scope.selectItems.map(value=>value.id);

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

        delete $rootScope.badInfo_pagingOptions;
    };
    module.exports=badInfoListCtrl;

})(angular.module("app"));