(function(app){
    "use strict";

    app.controller("singleDomainCtrl",singleDomainCtrl);
    singleDomainCtrl.$inject=["$scope","$http","$translate","$state","commonMethod","nodeService"];
    function singleDomainCtrl($scope,$http,$translate,$state,commonMethod,nodeService){
        //初始化
        $scope.init=async ()=>{
            // 搜索字段
            $scope.searchOptions={
                times:null,//开始结束时间
                nodeId:null,//节点id
                domain:null,//域名
            };

            $scope.noData=true;

            //CCS SNS节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("nothing")}];
            await nodeService.getSCNodeList().then(list=>{
                $scope.nodeList=list;
            });

            //展示数据
            $scope.items=[
                // {   
                //     nodeId:"123456",//节点id
                //     domainRank:1,//域名排名
                //     domainName:"test",//域名
                //     accessNumber:15,//访问次数
                //     serviceTraffic:12312,//服务流量（KB）
                //     downTraffic:50,//回源流量（KB）
                //     requestHitRate:80,//请求命中率
                //     byteHitRate:80,//字节命中率
                //     userAccessRate:30,//用户访问速率(Kbps)
                // }
                
            ];


            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    // {field:"nodeId",title:$translate.instant("node"),align:"left",minWidth:130,
                    //  templet:(d)=>{
                    //     for(let {nodeID,nodeName} of $scope.nodeList){
                    //         if(nodeID==d.nodeId)return nodeName
                    //     }
                    //     return "--"
                    //  }
                    // },
                    {field:"domainName",title:$translate.instant("domainName"),align:"left",minWidth:180,
                     templet:`<div><span title="{{d.domainName}}">{{d.domainName||"--"}}</span></div>`
                    },
                    {field:"domainRank",title:$translate.instant("domainRank"),sort:true,align:"left",minWidth:130,
                     templet:`<div>{{d.domainRank!=null?d.domainRank:"--"}}</div>`
                    },
                    {field:"accessNumber",title:$translate.instant("accessNumber"),sort:true,align:"left",minWidth:130,
                     templet:`<div>{{d.accessNumber!=null?d.accessNumber:"--"}}</div>`
                    },
                    {field:"serviceTraffic",title:$translate.instant("serviceTraffic")+"(KB)",sort:true,align:"left",minWidth:150,
                     templet:`<div>{{d.serviceTraffic!=null?d.serviceTraffic:"--"}}</div>`
                    },
                    {field:"downTraffic",title:$translate.instant("downTraffic")+"(KB)",sort:true,align:"left",minWidth:130,
                     templet:`<div>{{d.downTraffic!=null?d.downTraffic:"--"}}</div>`
                    },  
                    {field:"requestHitRate",title:$translate.instant("requestHitRate")+"(%)",sort:true,align:"left",minWidth:150,
                     templet:`<div>{{d.requestHitRate!=null?d.requestHitRate.toFixed(2):"--"}}</div>`
                    },
                    {field:"byteHitRate",title:$translate.instant("byteHitRate")+"(%)",sort:true,align:"left",minWidth:130,
                     templet:`<div>{{d.byteHitRate!=null?d.byteHitRate.toFixed(2):"--"}}</div>`
                    },
                    {field:"userAccessRate",title:$translate.instant("userAccessRate")+"(kbps)",align:"left",minWidth:170,
                     templet:`<div>{{d.userAccessRate!=null?d.userAccessRate:"--"}}</div>`
                    }
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数 
                   
            });
            
            // $scope.getPageData();
        };

        //分页
        $scope.getPageData=function(){
            let url=commonMethod.getServerUrl()+"/rest/view/singleDomain";
            let obj={
                nodeId:$scope.searchOptions.nodeId,
                domain:$scope.searchOptions.domain,

                startTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[0]:null,
                endTime:$scope.searchOptions.times?$scope.searchOptions.times.split(" ~ ")[1]:null,
            }
            $http.post(url,obj).then(({data})=>{
                if(data.success&&data.data.length>0){
                    $scope.items=data.data;
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
    module.exports=singleDomainCtrl;

})(angular.module("app"));