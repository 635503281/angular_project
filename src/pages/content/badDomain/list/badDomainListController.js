(function(app){
    "use strict";

    app.controller("badDomainListCtrl",badDomainListCtrl);
    badDomainListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function badDomainListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.badDomain_pagingOptions){
                $scope.pagingOptions=$rootScope.badDomain_pagingOptions;
                
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
                //     policyVersion:1,
                //     hostList:"test",
                //     redirectURL:"test",
                //     bypassUrlParam:"test",
                //     bypassRefererHost:"test"
                // }
            ];

           

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"policyVersion",title:$translate.instant("policyVersion"),sort:true,align:"left",minWidth:100,
                     templet:`<div>{{d.policyVersion||"--"}}</div>`
                    },
                    {field:"hostList",title:$translate.instant("hostList"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.hostList}}">{{d.hostList||"--"}}</span></div>`
                    },
                    {field:"redirectURL",title:$translate.instant("redirectURL"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.redirectURL}}">{{d.redirectURL||"--"}}</span></div>`
                    },
                    {field:"bypassUrlParam",title:$translate.instant("bypassUrlParam"),align:"left",minWidth:130,
                     templet:`<div>{{d.bypassUrlParam||"--"}}</div>`
                    },
                    {field:"bypassRefererHost",title:$translate.instant("bypassRefererHost"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.bypassRefererHost}}">{{d.bypassRefererHost||"--"}}</span></div>`
                    },     
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:120,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.badDomain.modifyBtn}?'':'none'}}"  lay-event="edit"   title=${$rootScope.badDomain.modifyName}></button>
                        <button class="btn icon_issued {{${$rootScope.badDomain.issuedBtn}?'':'none'}}"  lay-event="issued" title=${$rootScope.badDomain.issuedName}></button>
                        <button class="btn icon_delete {{${$rootScope.badDomain.deleteBtn}?'':'none'}}"  lay-event="del"    title=${$rootScope.badDomain.deleteName}></button>
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
                        $rootScope.badDomain_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.content.badDomain.edit",{id:data.id});
                    break;
                    case "issued"://下发
                        let url=commonMethod.getServerUrl()+"/rest/domainRedirect/apply?id="+data.id;
                        $http.get(url).then(({data})=>{        
                            if(data.success){
                                commonMethod.layuiTip($translate.instant("issued_S"));
                            }
                                                
                        }).catch((err)=>{});
    
                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete')}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/domainRedirect/delete?id="+data.id;
                            $http.delete(url).then(({data})=>{       
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
            let url=commonMethod.getServerUrl()+"/rest/domainRedirect/getList";
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

        $scope.init();

        delete $rootScope.badDomain_pagingOptions;
    };
    module.exports=badDomainListCtrl;

})(angular.module("app"));