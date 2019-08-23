(function(app){
    "use strict";

    app.controller("cAnReportCtrl",cAnReportCtrl);
    cAnReportCtrl.$inject=["$scope","$http","$translate","$rootScope","commonMethod","cpService","nodeService","publicService","$filter"];
    function cAnReportCtrl($scope,$http,$translate,$rootScope,commonMethod,cpService,nodeService,publicService,$filter){
        const echarts = require('echarts');

        //初始化
        $scope.init=()=>{
            //tablist
            $scope.tabList=[
                {id:1,name:$rootScope.cAnReport.reportDetailName,isShow:$rootScope.cAnReport.reportDetailBtn},
                {id:2,name:$rootScope.cAnReport.reportTrendName,isShow:$rootScope.cAnReport.reportTrendBtn}
            ];
            //当前tab页
            $scope.currentTab=$filter('filter')($scope.tabList,{isShow:true})[0]?$filter('filter')($scope.tabList,{isShow:true})[0].id:0;

            //cpList
            $scope.cpList=[{cpId:null,name:$translate.instant("All")}];
            cpService.getCpList().then(function(list){
                $scope.cpList=list.map((value,index)=>{
                    if(index==0)value.name=$translate.instant("all");
                    return value
                })
            });

            //域名
            $scope.domainList=[];

            //省份
            $scope.provinceList=publicService.provinceList.mapp((value,i)=>{
                if(i==0)value={id:null,name:$translate.instant("all"),alias:null};
                return value;
            });

            //节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("all")}];
            $http.post(commonMethod.getServerUrl()+"/rest/v1/nodelist/province",{provinces:[],isAll:1},{headers:{noLoading:true}}).then(({data})=>{
                 if(data.success&&data.data&&data.data.length>0){
                     $scope.nodeList=data.data.map(value=>({nodeID:value.nodeID,nodeName:value.nodeName}));
                     $scope.nodeList.unshift({nodeID:null,nodeName:$translate.instant("all")});
                 }
             });

            //echart展示列表
            $scope.echartList=[
                {id:1,name:$translate.instant('accessTimes'),key:"accessTimes",unit:""},
                {id:2,name:$translate.instant('userFlow'),key:"userFlow",unit:"byte"},
                {id:3,name:$translate.instant('bandWidth'),key:"bandWidth",unit:"kbps"},
                {id:4,name:$translate.instant('sourceFlow'),key:"sourceFlow",unit:"byte"},
                {id:5,name:$translate.instant('sourceBandWidth'),key:"sourceBandWidth",unit:"kbps"},
                {id:6,name:$translate.instant('gainsRate'),key:"gainsRate",unit:""},
                {id:7,name:$translate.instant('hitCountPercent'),key:"hitCountPercent",unit:"%"},
                {id:8,name:$translate.instant('bigFileDownloadWidth'),key:"bigFileDownloadWidth",unit:"bps"},
                {id:9,name:$translate.instant('sourceSuccessRate'),key:"sourceSuccessRate",unit:"%"}     
            ];
            
            //排序字段
            $scope.sortTypeList=[
                {id:1,name:$translate.instant("pAn_sort.accessTimes")},
                {id:2,name:$translate.instant("pAn_sort.userFlow")},
                {id:3,name:$translate.instant("pAn_sort.sourceFlow")},
                {id:4,name:$translate.instant("pAn_sort.hitCountPercent")},
                {id:5,name:$translate.instant("pAn_sort.hitFlowPercent")},
                {id:6,name:$translate.instant("pAn_sort.bandWidth")},
                {id:7,name:$translate.instant("pAn_sort.peckBandWidth")},
                {id:8,name:$translate.instant("pAn_sort.sourceBandWidth")},
                {id:9,name:$translate.instant("pAn_sort.gainsRate")},
                {id:10,name:$translate.instant("pAn_sort.byteHit")},
                {id:11,name:$translate.instant("pAn_sort.hit")},
                {id:12,name:$translate.instant("pAn_sort.firstByteHitTime")},
                {id:13,name:$translate.instant("pAn_sort.requestSuccessRate")},
                {id:14,name:$translate.instant("pAn_sort.sourceRequestSuccessRate")},
            ];

            //时间粒度
            $scope.timesList=[
                {id:5,name:5+$translate.instant("minute")},
                {id:30,name:30+$translate.instant("minute")},
                {id:60,name:60+$translate.instant("minute")},
                {id:1440,name:$translate.instant("oneDay")}
            ];

            //结果类型
            $scope.resultTypeList=[
                {id:0,name:$translate.instant("cd_resultType0")},
                {id:1,name:$translate.instant("cd_resultType1")},
            ];

            //业务类型
            $scope.groupTypeList=nodeService.groupTypeList;

            $scope.initTab($scope.currentTab); 
        };

        //tab切换
        $scope.switchTab=(index)=>{
            if($scope.currentTab!=index){
                $scope.currentTab=index;
                $scope.initTab(index);
            }
        };

        //初始化tab
        $scope.initTab=(index)=>{
            //展示数据
            $scope.items=[];
            $scope.noData=true;

            switch(index){
                case 1://报表明细
                    //分页参数
                    $scope.pagingOptions={
                        pageSizes: [10, 20, 30, 50, 100],
                        pageSize: 10,
                        currentPage: 1,
                        total: 0,// 存放list总记录数
                        maxPages: 1,// 最大页数
                    };

                    // 搜索字段
                    
                    $scope.searchOptions={
                        groupType:null,//业务类型
                        cp:[],//cp
                        domain:[],//域名
                        provinces:[],//省份
                        nodeIds:[],//节点id
                        sortType:1,//排序
                        time:null,//时间
                        resultType:0//返回结果
                    };

                    //初始化渲染table
                    $scope.table=layui.table.render({
                        elem:"#tab",
                        cols:[[
                            {field:"groupType",title:$translate.instant("businessType"),align:"left",minWidth:150,
                             templet:d=>{
                               for(let {id,name} of nodeService.groupTypeList){
                                   if(id==d.groupType)return name;
                               }
                               return "--"
                             }
                            },
                            {field:"provinceId",title:$translate.instant("province"),align:"left",minWidth:120,
                             templet:d=>{
                               for(let {id,name} of $scope.provinceList){
                                   if(id==d.provinceId&&d.provinceId)return name;
                               }
                               return "--"
                             }
                            },
                           {field:"nodeId",title:$translate.instant("nodeID"),align:"left",minWidth:120,
                            templet:`<div>{{d.nodeId!=null?d.nodeId:"--"}}</div>`
                            },
                            {field:"cp",title:$translate.instant("CP"),align:"left",minWidth:120,
                             templet:d=>{
                                for(let {cpId,name} of $scope.cpList){
                                    if(d.cp==cpId&&d.cp) return name;
                                }
                                if(d.cp)return d.cp;
                                else return "--";
                             }
                            },
                            {field:"domain",title:$translate.instant("domainName"),align:"left",minWidth:160,
                            templet:`<div><span title="d.domain">{{d.domain||"--"}}</div>`
                            },                         
                            {field:"accessTimes",title:$translate.instant("accessTimes"),align:"left",minWidth:160,sort:true,
                            templet:`<div>{{d.accessTimes!=null?d.accessTimes:"--"}}</div>`
                            },
                            {field:"userFlow",title:$translate.instant("userFlow")+"(byte)",align:"left",minWidth:170,sort:true,
                            templet:`<div>{{d.userFlow!=null?d.userFlow:"--"}}</div>`
                            },
                            {field:"bandWidth",title:$translate.instant("bandWidth")+"(kbps)",align:"left",minWidth:180,sort:true,
                            templet:`<div>{{d.bandWidth!=null?d.bandWidth:"--"}}</div>`
                            }, 
                            {field:"sourceFlow",title:$translate.instant("sourceFlow")+"(byte)",align:"left",minWidth:180,sort:true,
                            templet:`<div>{{d.sourceFlow!=null?d.sourceFlow:"--"}}</div>`
                            }, 
                            {field:"sourceBandWidth",title:$translate.instant("sourceBandWidth")+"(kbps)",align:"left",minWidth:185,sort:true,
                            templet:`<div>{{d.sourceBandWidth!=null?d.sourceBandWidth:"--"}}</div>`
                            }, 
                            {field:"gainsRate",title:$translate.instant("gainsRate"),align:"left",minWidth:180,sort:true,
                            templet:`<div>{{d.gainsRate!=null?d.gainsRate:"--"}}</div>`
                            }, 
                            {field:"hitCountPercent",title:$translate.instant("hitCountPercent")+"(%)",align:"left",minWidth:180,sort:true,
                            templet:`<div>{{d.hitCountPercent!=null?d.hitCountPercent.toFixed(2):"--"}}</div>`
                            },
                            {field:"bigFileDownloadWidth",title:$translate.instant("bigFileDownloadWidth")+"(bps)",align:"left",minWidth:210,sort:true,
                            templet:`<div>{{d.bigFileDownloadWidth!=null?d.bigFileDownloadWidth:"--"}}</div>`
                            },   
                            {field:"sourceSuccessRate",title:$translate.instant("sourceSuccessRate")+"(%)",align:"left",minWidth:200,sort:true,
                            templet:`<div>{{d.sourceSuccessRate!=null?d.sourceSuccessRate.toFixed(2):"--"}}</div>`
                            },          
                        ]],
                        data:$scope.items,//数据
                        limit:$scope.items.length,//渲染显示的个数     
                        
                    });

                break;
                case 2://报表趋势
                    // 搜索字段
                    $scope.searchOptions={
                        groupType:null,//业务类型
                        cp:[],//cp
                        domain:[],//域名
                        provinces:[],//省份
                        nodeIds:[],//节点id
                        time:null,//时间
                        times:5,//时间粒度
                        resultType:0,//返回结果
                    };
                    //初始化dom
                    setTimeout($scope.initDom);
                break;
            }
            
            

            // $scope.getPageData();
        };

        //根据cp获取域名列表
        $scope.changeCp=cps=>{
            $scope.searchOptions.domain=[];
            if(cps.includes(null)||cps.length==0){
                $scope.searchOptions.cp=[];
                $scope.domainList=[{id:null,domainName:$translate.instant("all")}];
            }else{
                let url=commonMethod.getServerUrl()+"/rest/v1/dispatch/domainManagement/getDomainListByCpIdList";
                $http.get(url,{params:{cpIdList:cps},headers:{noLoading:true}}).then(({data})=>{
                    if(data.success&&data.data.list&&data.data.list.length>0){
                        $scope.domainList=data.data.list.map(value=>({id:value.id,domainName:value.domainName}));
                        $scope.domainList.unshift({id:null,domainName:$translate.instant("all")});
                    }else{
                        $scope.domainList=[{id:null,domainName:$translate.instant("all")}];
                    }
    
                });
            }
              
        };

        //改变域名
        $scope.changeDomain=domains=>{
            if(domains.indexOf($translate.instant("all"))!=-1)$scope.searchOptions.domain=[];
        };

        //改变省份
        $scope.changeProvince=provinces=>{
            if(!provinces)return
            //省份id转化为省份缩写
            provinces=provinces.map(function(value,index){
                for(let {id,alias} of $scope.provinceList){
                    if(value==id){value=alias;break;}
                }
                return value;
            });
            if(provinces.indexOf(null)!=-1){
                $scope.searchOptions.provinces=[];
                provinces=[];
            }

            $scope.searchOptions.nodeIds=[];
            let url=commonMethod.getServerUrl()+"/rest/v1/nodelist/province";
            let obj={
                provinces:provinces,
                isAll:1
            }
            if(provinces.length>0)obj.isAll=0;
            $http.post(url,obj,{headers:{noLoading:true}}).then(({data})=>{
                if(data.success&&data.data&&data.data.length>0){
                    $scope.nodeList=data.data.map(value=>({nodeID:value.nodeID,nodeName:value.nodeName}));
                    $scope.nodeList.unshift({nodeID:null,nodeName:$translate.instant("all")});
                }else{
                    $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("all")}];
                }

            });

            
        };

        //改变节点
        $scope.changeNode=nodes=>{
            if(nodes.indexOf(null)!=-1)$scope.searchOptions.nodeIds=[];
        };

        //改变返回类型
        $scope.changeResult=type=>{
            if(type==0){//全部
                $scope.searchOptions.domain=[];
            }
        };

        //分页
        $scope.getPageData=function(){
            if($scope.currentTab==1){

                if($scope.searchOptions.time&&$scope.searchOptions.groupType!=null){
                    let url=commonMethod.getServerUrl()+"/rest/statistics/daas/province/domain/cacheInfo";//省份明细
                    let obj={
                        groupType:$scope.searchOptions.groupType,
                        cp:$scope.searchOptions.cp,
                        domain:$scope.searchOptions.domain,
                        provinces:$scope.searchOptions.provinces,
                        sortType:$scope.searchOptions.sortType,
                        resultType:$scope.searchOptions.resultType,
                        startTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[0]:'',
                        endTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[1]:'',

                        start:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                        num:$scope.pagingOptions.pageSize
                    }
                    if($scope.searchOptions.nodeIds.length>0){//节点明细
                        url=commonMethod.getServerUrl()+"/rest/statistics/daas/node/domain/cacheInfo";
                        obj.nodeIds=$scope.searchOptions.nodeIds;
                        delete obj.provinces;
                    }
                
                    $http.post(url,obj).then(({data})=>{
                        if(data.success&&data.data.data.length>0){
                            $scope.pagingOptions.total=data.data.total;
                            $scope.pagingOptions.maxPages=Math.ceil($scope.pagingOptions.total/$scope.pagingOptions.pageSize);

                            $scope.items=data.data.data.map(function(value,index){
                                if(!value.hasOwnProperty("provinceId"))value.provinceId=null;
                                if(!value.hasOwnProperty("nodeId"))value.nodeId=null;

                                return value;
                            });
                            $scope.noData=false;

                            //重新加载表格
                            $scope.table.reload({
                                data:$scope.items,
                                limit:$scope.items.length
                            });
                            
                        }else{
                            $scope.pagingOptions.total=0;
                            $scope.pagingOptions.maxPages=1;

                            $scope.items=[];
                            $scope.noData=true;
                        }
                       
                        
                    }).catch((err)=>{ $scope.noData=true; });
                }
                
            }else{

                if($scope.searchOptions.time&&$scope.searchOptions.groupType!=null){
                    let url=commonMethod.getServerUrl()+"/rest/statistics/daas/province/domain/trend/cacheInfo";//省份趋势
                    let obj={
                        groupType:$scope.searchOptions.groupType,
                        cp:$scope.searchOptions.cp,
                        domain:$scope.searchOptions.domain,
                        provinces:$scope.searchOptions.provinces,
                        times:$scope.searchOptions.times,
                        resultType:$scope.searchOptions.resultType,
                        startTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[0]:null,
                        endTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[1]:null,

                        start:0,
                        num:10,
                    };
                    if($scope.searchOptions.nodeIds.length>0){//节点趋势
                        url=commonMethod.getServerUrl()+"/rest/statistics/daas/node/domain/trend/cacheInfo";
                        obj.nodeIds=$scope.searchOptions.nodeIds;
                        delete obj.provinces;
                    }

                    $http.post(url,obj).then(({data})=>{

                        if(data.success){
                            $scope.items=data.data.data;
                            if($scope.items&&$scope.items.length>0){
                                $scope.noData=false;
                                //填充$scope.echartList
                                $scope.echartList.map(function(sort,i){
                                    sort.legend=[];
                                    sort.series=[];  
                                    $scope.items.map(function(value,index){

                                        if($scope.searchOptions.resultType==0){//cp
                                            //生成legend
                                            sort.legend[index]=$translate.instant("CP")+"-"+value.cp;
                                            //生成series
                                            sort.series[index]={name:$translate.instant("CP")+"-"+value.cp,type:"line",};

                                        }else{//域名
                                            //生成legend
                                            sort.legend[index]=$translate.instant("domainName")+"-"+value.domain;
                                            //生成series
                                            sort.series[index]={name:$translate.instant("domainName")+"-"+value.domain,type:"line",};
                                        }
                                       
                                        if(value.data&&value.data.length>0){
                                            sort.series[index].data=[];
                                            value.data.sort((a,b)=>Date.parse(a.time)-Date.parse(b.time)).map(function(item,k){
                                                sort.series[index].data[k]=[item.time,item[sort.key]]
                                            });
                                        }

                                    });
                                      
                                });

                                //生成echart
                                $scope.makeEchart();

                            }else{
                                $scope.noData=true;
                                commonMethod.layuiTip($translate.instant("noData"),"notice");
                                //清除echart
                                // $scope.clearEchart();
                            }
                            
                        }else{
                            $scope.noData=true;
                            //清除echart
                            // $scope.clearEchart();
                        }
                       
    
                    }).catch((err)=>{ $scope.noData=true; });
    
                }
               
            }    

        };

        //查询
        $scope.search=()=>{
            let startTime=$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[0]:null;
            let endTime=$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[1]:null;
            if(startTime&&endTime){
                let time1=new Date(startTime.replace(/-/g,'/')).getTime();
                let time2=new Date(endTime.replace(/-/g,'/')).getTime();
                // 时间范围不超过一个月
                if(time2-time1<31*24*60*60*1000){
                    $scope.getPageData();

                }else{
                    commonMethod.layuiTip($translate.instant("timeOver"),"notice");
                }

            }  
        };

        //导出
        $scope.export=()=>{
            let url=commonMethod.getServerUrl()+"/rest/statistics/daas/province/domain/cacheInfo/excel";
            let obj={
                groupType:$scope.searchOptions.groupType||"",//省份
                cp:$scope.searchOptions.cp,
                domain:$scope.searchOptions.domain,
                provinces:$scope.searchOptions.provinces,
                sortType:$scope.searchOptions.sortType,
                resultType:$scope.searchOptions.resultType,
                startTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[0]:'',
                endTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[1]:'',
            };
            if($scope.searchOptions.nodeIds.length>0){//节点
                url=commonMethod.getServerUrl()+"/rest/statistics/daas/node/domain/cacheInfo/excel";
                obj.nodeIds=$scope.searchOptions.nodeIds;
                delete obj.provinces;
            }
            publicService.export(url,obj);
        };

        //初始化dom
        $scope.initDom=()=>{
            $scope.echartList.map(function(value){
                $scope["echart"+value.id]=echarts.init(document.getElementById('echart'+value.id));
            });
        };

        //清除echart
        $scope.clearEchart=()=>{
            $scope.echartList.map(function(value){
                if($scope["echart"+value.id]){
                    $scope["echart"+value.id].clear();
                }   
            });
        };

        //生成echart
        $scope.makeEchart=()=>{

            $scope.echartList.map(function(value){
                $scope["option"+value.id]={
                    // 默认色板
                    color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                        '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                        '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                        '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
                    ],
                    title: {//标题
                        text: value.name,
                        left:"center"
                        
                    },
                    tooltip: {//提示框组件
                        trigger: 'axis',
                        formatter: function(params) {
                            var res = '<div><p>' + params[0].value[0] + '</p></div>'
                            for (var i = 0; i < params.length; i++) {
                                res+=`
                                    <div>
                                        <span style="display: inline-block;width: 10px;height: 10px; border-radius:50%;margin-right: 6px;
                                            background:${params[i].color};"></span>
                                        <p style="display:inline-block">${params[i].seriesName}: ${params[i].data[1]!=null?params[i].data[1]:0}${value.unit?value.unit:''}</p>
                                    </div>
                                ` 
                            }
                            return res;
                        }
                    },
                    toolbox: {//工具栏
                        // feature: {//改变下载图片
                        //     saveAsImage: {}
                        // }
                    },
                    legend: {//图例，上面显示多少根线条
                        type:"scroll",
                        data:value.legend,
                        top:25,
                        padding:[5,5,5,60]
                    },
                    grid:{//直角坐标系内绘图网格
                        left:60,
                        top:80
                    },
                    xAxis:{//x轴
                        type:"time",
                        name:$translate.instant("time"),
                        axisLabel:{
                            formatter:value=>new Date(value).format("yyyy-MM-dd hh:mm:ss"),                    
                        }
                    },
                    yAxis: {//y轴
                        type:"value",
                        name: value.name+ (value.unit?"("+value.unit+")":""),
                        axisLabel: {
                            margin: 2,
                            formatter: function (value, index) {
                                if (value >= 10000 && value < 100000000) {
                                    value = value / 10000 + $translate.instant("units.wan");
                                } else if (value >= 100000000) {
                                    value = value / 100000000 + $translate.instant("units.yi");
                                }
                                return value;
                            }
                        },
                    },
                    //每条线的数据
                    series:value.series

                };
                $scope["echart"+value.id].clear();
                $scope["echart"+value.id].setOption($scope["option"+value.id]);
                setTimeout($scope["echart"+value.id].resize);
            });

        };

        //尺寸变换监听
        function resize(){
            $scope.echartList.map(function(value){
                if($scope["echart"+value.id]){
                    $scope["echart"+value.id].resize();
                }
            });
        }

        $scope.init();

        window.removeEventListener("resize",resize);
        window.addEventListener("resize",resize);
    };
    module.exports=cAnReportCtrl;

})(angular.module("app"));