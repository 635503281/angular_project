(function(app){
    "use strict";

    app.controller("safeChainListCtrl",safeChainListCtrl);
    safeChainListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function safeChainListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.safeChain_pagingOptions){
                $scope.pagingOptions=$rootScope.safeChain_pagingOptions;
                
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
                // {id:1,authID:10,authName:"test",templateID:10,templateName:"test",authSwitch:0}
            ];

            //防盗链算法
            $scope.templateIDList=[
                {id:"8000000101",name:$translate.instant("migu_AES")}
            ];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"authID",title:$translate.instant("authID"),sort:true,align:"left",minWidth:120,
                     templet:`<div>{{d.authID||"--"}}</div>`
                    },
                    {field:"authName",title:$translate.instant("authName"),align:"left",minWidth:120,
                     templet:`<div><span title="{{d.authName}}">{{d.authName||"--"}}</span></div>`
                    },
                    {field:"templateID",title:$translate.instant("templateID"),align:"left",sort:true,minWidth:120,
                     templet:`<div>{{d.templateID||"--"}}</div>`
                    },
                    {field:"templateName",title:$translate.instant("templateName"),align:"left",minWidth:150,
                     templet:d=>{
                        for(let {id,name} of $scope.templateIDList){
                            if(id==d.templateID)return name
                        }
                        return d.templateName||"--"
                     }
                    },
                    {field:"authSwitch",title:$translate.instant("authSwitch"),align:"left",minWidth:120,
                     templet:function(d){
                        switch(d.authSwitch){
                            case 0:return $translate.instant("close");break;
                            case 1:return $translate.instant("open");break;
                        }
                        return "--"
                     }
                    },          
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.safeChain.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.safeChain.modifyName}></button>
                        <button class="btn icon_delete {{${$rootScope.safeChain.deleteBtn}?'':'none'}}"  lay-event="del" title=${$rootScope.safeChain.deleteName}></button>
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
                        $rootScope.safeChain_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.authentication.safeChain.edit",{id:data.id});
                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete'),message:$translate.instant("authority_del_tip")}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/auth/deleteAntiTheftChain?id="+data.id;
                            $http.get(url).then(({data})=>{       
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
            let url=commonMethod.getServerUrl()+"/rest/auth/getAntiTheftChain";
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
                    })

                }else{
                    $scope.noData=true;
                }
                
            }).catch((err)=>{ $scope.noData=true; });

        };

        $scope.init();

        delete $rootScope.safeChain_pagingOptions;
    };
    module.exports=safeChainListCtrl;

})(angular.module("app"));