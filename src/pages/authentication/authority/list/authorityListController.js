(function(app){
    "use strict";

    app.controller("authorityListCtrl",authorityListCtrl);
    authorityListCtrl.$inject=["$scope","$rootScope","$http","$translate","$state","$stateParams","commonMethod"];
    function authorityListCtrl($scope,$rootScope,$http,$translate,$state,$stateParams,commonMethod){
        //初始化
        $scope.init=()=>{
            //是否启动保存的分页参数
            if($stateParams.flag!=0&&$rootScope.authority_pagingOptions){
                $scope.pagingOptions=$rootScope.authority_pagingOptions;
                
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
                    {field:"cpid",title:$translate.instant("CPID"),sort:true,align:"left",minWidth:120,
                     templet:`<div>{{d.cpid||"--"}}</div>`
                    },
                    {field:"domain",title:$translate.instant("domain"),align:"left",minWidth:150,
                     templet:`<div><span title="{{d.domain}}">{{d.domain||"--"}}</span></div>`
                    },
                    {field:"authType",title:$translate.instant("authType"),align:"left",sort:true,minWidth:120,
                     templet:function(d){
                        switch(d.authType){
                            case 0:return $translate.instant("closeAuthority");break;
                            case 1:return $translate.instant("localAuthority");break;
                            case 2:return $translate.instant("secondAuthority");break;
                        }
                        return "--"
                     }
                    },
                    {field:"fileType",title:$translate.instant("fileType"),align:"left",minWidth:120,
                     templet:`<div>{{d.fileType||"--"}}</div>`
                    },
                    {field:"keyValue",title:$translate.instant("keyValue"),align:"left",minWidth:120,
                     templet:`<div>{{d.keyValue||"--"}}</div>`
                    },
                    {field:"keyVersion",title:$translate.instant("keyVersion"),align:"left",minWidth:120,
                     templet:`<div>{{d.keyVersion||"--"}}</div>`
                    },
                    {field:"keyEffectiveDate",title:$translate.instant("keyEffectiveDate"),align:"left",width:160,
                     templet:`<div>{{d.keyEffectiveDate?new Date(d.keyEffectiveDate).format('yyyy-MM-dd hh:mm:ss'):"--"}}</div>`
                    },
                    {title:$translate.instant("operation"),fixed:"right",align:"left",width:100,
                     toolbar:`<div><div class="operation_btn">
                        <button class="btn icon_modify {{${$rootScope.authority.modifyBtn}?'':'none'}}" lay-event="edit" title=${$rootScope.authority.modifyName}></button>
                        <button class="btn icon_delete {{${$rootScope.authority.deleteBtn}?'':'none'}}" lay-event="del"  title=${$rootScope.authority.deleteName}></button>
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
                        $rootScope.authority_pagingOptions=$scope.pagingOptions;//保存分页参数
                        $state.go("index.authentication.authority.edit",{id:data.id});
                    break;
                    case "del"://删除
                        commonMethod.commonTip({tip:$translate.instant('isDelete'),message:$translate.instant("authority_del_tip")}).then(function(){
                            let url=commonMethod.getServerUrl()+"/rest/auth/deleteAuthInfo?id="+data.id;
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
            let url=commonMethod.getServerUrl()+"/rest/auth/getAuthInfo";
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

        delete $rootScope.authority_pagingOptions;
    };
    module.exports=authorityListCtrl;

})(angular.module("app"));