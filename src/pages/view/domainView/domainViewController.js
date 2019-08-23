(function(app){
    "use strict";

    app.controller("domainViewCtrl",domainViewCtrl);
    domainViewCtrl.$inject=["$scope","$http","$translate","$state","commonMethod","nodeService"];
    function domainViewCtrl($scope,$http,$translate,$state,commonMethod,nodeService){
        //初始化
        $scope.init=()=>{
            // 搜索字段
            $scope.searchOptions={
                nodeId:null,//节点id
                domainGroup:1,//域名类别
            };

            $scope.noData=true;

            //域名类别列表
            $scope.domainGroupList=[
                {id:1,name:$translate.instant("domainGroup_1")},
                {id:2,name:$translate.instant("domainGroup_2")},
                {id:3,name:$translate.instant("domainGroup_3")},
                {id:4,name:$translate.instant("domainGroup_4")},
                {id:5,name:$translate.instant("domainGroup_5")},
                {id:6,name:$translate.instant("domainGroup_6")},
            ];

            //CCS SNS节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            nodeService.getSCNodeList().then(list=>{
                $scope.nodeList=list;
            });

            //展示数据
            $scope.items=[   
                // {
                //     domainName: "list",  
                // }
                
            ];


            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {field:"domainName",title:$translate.instant("domainName"),align:"left",
                     templet:`<div><span title="{{d.domainName}}">{{d.domainName||"--"}}</span></div>`
                    },
                    // {field:"nodeId",title:$translate.instant("node"),align:"center",
                    //  templet:(d)=>{
                    //     for(let {nodeID,nodeName} of $scope.nodeList){
                    //         if(nodeID==d.nodeId)return nodeName
                    //     }
                    //     return "--"
                    //  }
                    // },
                    // {field:"domainName",title:$translate.instant("domainName"),align:"center",
                    //  templet:`<div><span title="{{d.domainName}}">{{d.domainName||"--"}}</span></div>`
                    // },
                    // {field:"domainRank",title:$translate.instant("domainRank"),sort:true,align:"center",
                    //  templet:`<div>{{d.domainRank||"--"}}</div>`
                    // },
                    // {field:"accessNumber",title:$translate.instant("accessNumber"),sort:true,align:"center",
                    //  templet:`<div>{{d.accessNumber||"--"}}</div>`
                    // },
                    // {field:"serviceTraffic",title:$translate.instant("serviceTraffic")+"(KB)",sort:true,align:"center",
                    //  templet:`<div>{{d.serviceTraffic}}</div>`
                    // },
                    // {field:"downTraffic",title:$translate.instant("downTraffic")+"(KB)",sort:true,align:"center",
                    //  templet:`<div>{{d.downTraffic}}</div>`
                    // },
                    // {field:"requestHitRate",title:$translate.instant("requestHitRate")+"(%)",sort:true,align:"center",
                    //  templet:`<div>{{d.requestHitRate.toFixed(2)}}</div>`
                    // },
                    // {field:"byteHitRate",title:$translate.instant("byteHitRate")+"(%)",sort:true,align:"center",
                    //  templet:`<div>{{d.byteHitRate.toFixed(2)}}</div>`
                    // },
                    // {field:"userAccessRate",title:$translate.instant("userAccessRate")+"(kbps)",align:"center",fixed:"right"},
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数
                   
            });
            
            // $scope.getPageData();
        };

        //分页
        $scope.getPageData=function(){
            let url=commonMethod.getServerUrl()+"/rest/view/domainView";
            let obj={
                nodeId:$scope.searchOptions.nodeId,
                domainGroup:$scope.searchOptions.domainGroup,
            }
            $http.post(url,obj).then(({data})=>{
                if(data.success&&data.data.length>0){
                    $scope.items=data.data.map(value=>{
                        return {domainName:value}
                    });
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
            $scope.getPageData();
        };

        $scope.init();
    };
    module.exports=domainViewCtrl;

})(angular.module("app"));