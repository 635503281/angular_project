(function(app){
    "use strict";

    app.controller("operateLogQueryCtrl",operateLogQueryCtrl);
    operateLogQueryCtrl.$inject=["$scope","$http","$translate","publicService","commonMethod","ngDialog"];
    function operateLogQueryCtrl($scope,$http,$translate,publicService,commonMethod,ngDialog){
        //初始化
        $scope.init=()=>{
            //分页参数
            $scope.pagingOptions={
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                currentPage: 1,
                total: 0,// 存放list总记录数
                maxPages: 1,// 最大页数
            };

            //查询字段
            $scope.searchOptions={
                times:null,//时间
                operator:null,//操作人
                ip:null,//操作人ip
                objectKeyWord:null,//操作对象或内容关键字
                operationType:0,//操作类型 0-全部 2-增加 4-修改 8-删除
                serverType:2,//服务类型 1:OMS;2:CDNC
            };

            //操作类型
            $scope.operationTypeList=publicService.operationTypeList;

            //展示数据
            $scope.items=[];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"startTime",title:$translate.instant("startTime"),sort:true,align:"left",width:160,
                     templet:`<div>{{new Date(d.startTime).format("yyyy-MM-dd hh:mm:ss")}}</div>`
                    },
                    {field:"operationType",title:$translate.instant("operationType"),align:"left",minWidth:140,
                     templet:d=>{
                        for(let {id,name} of $scope.operationTypeList){
                            if(d.operationType==id)return name
                        }
                        return id||'--'
                     }
                    },
                    {field:"operator",title:$translate.instant("operator"),align:"left",minWidth:150,
                    templet:`<div>{{d.operator||"--"}}</div>`
                    },
                    {field:"ip",title:$translate.instant("IP"),align:"left",minWidth:180,
                    templet:`<div>{{d.ip||"--"}}</div>`
                    },
                    {field:"objectName",title:$translate.instant("objectName"),align:"left",minWidth:150,
                    templet:`<div>{{d.objectName||"--"}}</div>`
                    },
                    {field:"content",title:$translate.instant("operateContent"),align:"left",minWidth:150,
                     templet:`<div>{{d.content||"--"}}</div>`
                    },
                    {field:"result",title:$translate.instant("operateResult"),align:"left",minWidth:120,
                     templet:d=>{
                        switch(d.result){
                            case 1:case "1":return $translate.instant("success");break;
                            case 2:case "2":return $translate.instant("fail");break;
                        }
                        return "--"
                     }
                    },
                    {field:"errorMessage",title:$translate.instant("errorMessage"),align:"left",minWidth:150,width:"20%",
                     templet:`<div>{{d.errorMessage||"--"}}</div>` 
                    },
                    // {field:"costTime",title:$translate.instant("costTime")+"(ms)",align:"left",minWidth:150,
                    //  templet:`<div>{{d.costTime||"--"}}</div>` 
                    // },
                    {field:"comment",title:$translate.instant("comment"),align:"left",minWidth:150,
                     templet:`<div>{{d.comment||"--"}}</div>` 
                    },
                    {field:"details",title:$translate.instant("details"),align:"left",fixed:"right",width:80,
                    templet:d=>{
                       let id=JSON.stringify(d.id).replace(/\"/g,"'");
                       return `<span><a class="blue" onClick="angular.element(this).scope().watch(${id})">${$translate.instant("watch")}</a></span>` 
                    }   
                   },
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数
                
            });
          
            $scope.getPageData();
        };


        //分页
        $scope.getPageData=function(){
            let url=commonMethod.getServerUrl()+"/rest/operationLog/findOperationLogList";

            let obj={
                start:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                num:$scope.pagingOptions.pageSize,

                operator:$scope.searchOptions.operator,
                ip:$scope.searchOptions.ip,
                objectKeyWord:$scope.searchOptions.objectKeyWord,
                operationType:$scope.searchOptions.operationType,
                fromTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[0]:null,
                toTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[1]:null,
                serverType:$scope.searchOptions.serverType,
            }
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

        //查询
        $scope.search=()=>{
            $scope.pagingOptions.currentPage=1;
            $scope.getPageData();
        };

        //查看详情
        $scope.watch=async id=>{
            let url=commonMethod.getServerUrl()+"/rest/operationLog/findOperationLogDetailList?id="+id;
            let {data}=await $http.get(url);
            if(data.success&&data.data.length>0){
                if($(".layui-layer").length>0)layui.layer.closeAll();
                let arr=data.data;
                ngDialog.openConfirm({
                    plain:true,
                    scope:$scope,
                    appendClassName:"commonDialog",
                    closeByDocument: false,
                    template:`
                    <div class="commonDialog_box">
                        <h3>{{"details"|translate}}</h3>
                        <form name="edit_form">
                            <div class="commonDialog_main">
                                <div class="common_box" style="max-height:500px;">
                                    <table lay-filter="watchTab" ng-if="watchItems.length>0">
                                        <thead>
                                            <tr>
                                                <td lay-data="{field:'attrDescMain',align:'center'}">{{"attrDescMain"|translate}}</td>
                                                <td lay-data="{field:'operationType',align:'center'}">{{"operationType"|translate}}</td>
                                                <td lay-data="{field:'oldValue',align:'center'}">{{"oldValue"|translate}}</td>
                                                <td lay-data="{field:'newValue',align:'center'}">{{"newValue"|translate}}</td>
                                                <td lay-data="{field:'attrMsgMain',align:'center'}">{{"comment"|translate}}</td>
                                            </tr>      
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="item in watchItems" renderfinish="initTab()">
                                                <td>{{item.attrDescMain||"--"}}</td>
                                                <td>{{item.operationType||"--"}}</td>
                                                <td>{{(item.oldValue!=null&&item.oldValue!='null')?item.oldValue:"--"}}</td>
                                                <td>{{item.newValue||"--"}}</td>
                                                <td>{{item.attrMsgMain||"--"}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h4 class="text_center" ng-if="watchItems.length==0">{{"noData"|translate}}</h4>
                                </div>
                            </div>
                        </form>
                    </div>
                    `,
                    controller:["$scope","publicService",function($scope,publicService){
                        $scope.watchItems=arr.map(value=>{
                            for(let{id,name} of publicService.operationTypeList){
                                if(id==value.operationType){
                                    value.operationType=name;
                                    break;
                                }
                            }
                            return value
                        });
    
                        $scope.initTab=()=>{
                            setTimeout(function(){
                                var length=$scope.watchItems.length;
                                layui.table.init("watchTab",{
                                    height:length<10?"":500,
                                    limit:length,//渲染显示的个数  
                                });
                            },0);
                            
                        };
    
                    }],
                    width:"70%",
                }).catch(()=>{});
            }else{
                commonMethod.layuiTip($translate.instant("noDetails"),"notice");
            }

        };

        $scope.init();
    };
    module.exports=operateLogQueryCtrl;

})(angular.module("app"));