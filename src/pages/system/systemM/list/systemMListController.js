(function(app){
    "use strict";

    app.controller("systemMListCtrl",systemMListCtrl);
    systemMListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function systemMListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.systemM_pagingOptions){
                $scope.pagingOptions=$rootScope.systemM_pagingOptions;
                
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
            
            //所有数据
            $scope.allItems=[];

            //展示数据
            $scope.items=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"name",title:$translate.instant("name"),align:"left",minWidth:200,
                     templet:d=>{
                         if($rootScope.lang=="zh-cn")return `<div><span title="${d.name}">${d.name||"--"}</span></div>`
                         else if($rootScope.lang=="en-us")return `<div><span title="${d.key}">${d.key||"--"}</span></div>`
                     }    
                    },
                    {field:"value",title:$translate.instant("value"),align:"left",minWidth:300,
                     templet:`<div><span title="{{d.value}}">{{d.value||"--"}}</span></div>`
                    },
                    {field:"defaultValue",title:$translate.instant("defaultValue"),align:"left",minWidth:300,
                     templet:`<div><span title="{{d.defaultValue}}">{{d.defaultValue||"--"}}</span></div>`
                    },
                    {field:"desc",title:$translate.instant("description"),align:"left",minWidth:200,
                     templet:`<div><span title="{{d.desc}}">{{d.desc||"--"}}</span></div>`
                    },
                    {field:"enable",title:$translate.instant("enable"),align:"left",minWidth:100,
                     templet:`<div>{{d.enable?'${$translate.instant("yes")}':'${$translate.instant("not")}'}}</div>`
                    },
                    {field:"updateTime",title:$translate.instant("updateTime"),align:"left",width:160,
                     templet:`<div>{{new Date(d.updateTime).format("yyyy-MM-dd hh:mm:ss")}}</div>`
                    },     
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.systemM.modifyBtn}?'':'none'}}" lay-event="edit" title="${$rootScope.systemM.modifyName}"></button>
                        <button class="btn icon_reset  {{${$rootScope.systemM.resetBtn}?'':'none'}}" lay-event="reset" title="${$rootScope.systemM.resetName}"></button>
                     </div></div>`
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数      
                   
            });
            
            //修改及重置
            layui.table.on("tool(tab)",function({data,event}){
          
                switch(event){
                    case "edit"://编辑
                        $rootScope.systemM_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.system.systemM.edit",{id:data.id});
                    break;
                
                    case "reset"://重置
                        commonMethod.commonTip({tip:$translate.instant('isReset')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/sysConfig/resetSysConfig";
                            $http.post(url,[data.id]).then(({data})=>{       
                                if(data.success){
                                    commonMethod.layuiTip($translate.instant("reset_S"));
                                    $scope.getAll(); 
                                }
                                                  
                            }).catch((err)=>{});

                        },()=>{});
                      
                    break;
                }

            });

            $scope.getAll();
            
        };

        //获取所有数据
        $scope.getAll=()=>{
            let url=commonMethod.getServerUrl()+"/rest/sysConfig/getList";
            $http.get(url).then(({data})=>{
                if(data.success&&data.data.length>0){
                    $scope.allItems=data.data;
                    $scope.noData=false;

                    $scope.getPageData();

                }else{
                    $scope.noData=true;
                }

            }).catch(err=>{ $scope.noData=true; });
        };

        //分页
        $scope.getPageData=()=>{
            $scope.pagingOptions.total=$scope.allItems.length;
            $scope.pagingOptions.maxPages=Math.ceil($scope.pagingOptions.total/$scope.pagingOptions.pageSize);
            $scope.items=$scope.allItems.slice(($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,$scope.pagingOptions.currentPage*$scope.pagingOptions.pageSize);
            //重新加载表格
            $scope.table.reload({
                data:$scope.items,
                limit:$scope.items.length
            });

        };

        $scope.init();

        delete $rootScope.systemM_pagingOptions;
    };
    module.exports=systemMListCtrl;

})(angular.module("app"));