(function(app){
    "use strict";

    app.controller("archiveListCtrl",archiveListCtrl);
    archiveListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function archiveListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.archive_pagingOptions){
                $scope.pagingOptions=$rootScope.archive_pagingOptions;
                
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

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"tableName",title:$translate.instant("tableName"),align:"left",
                     templet:`<div>{{d.tableName||"--"}}</div>`
                    },
                    {field:"dateLimit",title:$translate.instant("dateLimit"),align:"left",
                     templet:`<div>{{d.dateLimit||"--"}}</div>`
                    },
                    {field:"countLimit",title:$translate.instant("countLimit"),align:"left",
                     templet:`<div>{{d.countLimit||"--"}}</div>`
                    },
                    {field:"elementName",title:$translate.instant("elementName"),align:"left",
                     templet:`<div>{{d.elementName||"--"}}</div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.archiveManagement.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.archiveManagement.modifyName}></button>
                        <button class="btn icon_delete {{${$rootScope.archiveManagement.deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.archiveManagement.deleteName}></button>
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
                        $rootScope.archive_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.system.archive.edit",{id:data.id});
                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/dataClear/deleteDataClearConfig?id="+data.id;
                            $http.post(url).then(({data})=>{        
                                if(data.success){
                                    commonMethod.layuiTip($translate.instant("delete_S"));
                                    $scope.getPageData(); 
                                }
                                                  
                            }).catch((err)=>{});

                        },()=>{});
                      
                    break;
                }

            });

            $scope.getPageData();
        };

        //分页
        $scope.getPageData=()=>{
            let url=commonMethod.getServerUrl()+"/rest/dataClear/getList";
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

        delete $rootScope.archive_pagingOptions;
    };
    module.exports=archiveListCtrl;

})(angular.module("app"));