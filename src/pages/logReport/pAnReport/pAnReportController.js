(function(app){
    "use strict";

    app.controller("pAnReportCtrl",pAnReportCtrl);
    pAnReportCtrl.$inject=["$scope","$http","$translate","$rootScope","commonMethod","nodeService","publicService","$filter"];
    function pAnReportCtrl($scope,$http,$translate,$rootScope,commonMethod,nodeService,publicService,$filter){
        const echarts = require('echarts');

        //初始化
        $scope.init=()=>{
            //tablist
            $scope.tabList=[
                {id:1,name:$rootScope.pAnReport.reportDetailName,isShow:$rootScope.pAnReport.reportDetailBtn},
                {id:2,name:$rootScope.pAnReport.reportTrendName,isShow:$rootScope.pAnReport.reportTrendBtn}
            ];
            //当前tab页
            $scope.currentTab=$filter('filter')($scope.tabList,{isShow:true})[0]?$filter('filter')($scope.tabList,{isShow:true})[0].id:0;

            //节点列表
            $scope.nodeList=[{nodeID:null,nodeName:$translate.instant("all")}];
            $http.post(commonMethod.getServerUrl()+"/rest/v1/nodelist/province",{provinces:[],isAll:1},{headers:{noLoading:true}}).then(({data})=>{
                if(data.success&&data.data&&data.data.length>0){
                    $scope.nodeList=data.data.map(value=>({nodeID:value.nodeID,nodeName:value.nodeName}));
                    $scope.nodeList.unshift({nodeID:null,nodeName:$translate.instant("all")});
                }
            });

            //省份
            $scope.provinceList=publicService.provinceList.mapp((value,i)=>{
                if(i==0)value={id:null,name:$translate.instant("all"),alias:null};
                return value;
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
                {id:0,name:$translate.instant("np_resultType0")},
                {id:1,name:$translate.instant("np_resultType1")},
            ];

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
                        provinces:[],//省份
                        nodeIds:[],//节点id
                        sortType:1,//排序
                        time:null,//时间
                    };

                    //初始化渲染table
                    $scope.table=layui.table.render({
                        elem:"#tab",
                        cols:[[
                            {field:"provinceId",title:$translate.instant("province"),align:"left",minWidth:120,
                            templet:d=>{
                                for(let {id,name} of $scope.provinceList){
                                    if(d.provinceId==id&&d.provinceId) return name;
                                }
                                return "--"
                            }
                            },
                            {field:"nodeId",title:$translate.instant("nodeID"),align:"left",minWidth:120,
                            templet:`<div>{{d.nodeId!=null?d.nodeId:"--"}}</div>`
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

        //根据省份获取节点列表
        $scope.changeProvince=provinces=>{
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
                $scope.searchOptions.nodeIds=[];
            }
        };

        //分页
        $scope.getPageData=function(){
            if($scope.currentTab==1){

                if($scope.searchOptions.time){
                    let url=commonMethod.getServerUrl()+"/rest/statistics/daas/province/cacheInfo";//省份
                    let obj={
                        provinces:$scope.searchOptions.provinces,
                        sortType:$scope.searchOptions.sortType,
                        startTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[0]:'',
                        endTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[1]:'',

                        start:($scope.pagingOptions.currentPage-1)*$scope.pagingOptions.pageSize,
                        num:$scope.pagingOptions.pageSize
                    }
                
                    if($scope.searchOptions.nodeIds.length>0){
                        url=commonMethod.getServerUrl()+"/rest/statistics/daas/node/cacheInfo";//节点
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
                            $scope.noData=true;
                        }
                       
                        
                    }).catch((err)=>{ $scope.noData=true; });
                }
                
            }else{

                if($scope.searchOptions.time){
                    let url=commonMethod.getServerUrl()+"/rest/statistics/daas/province/trend/cacheInfo";//省份
                    let obj={
                        provinces:$scope.searchOptions.provinces,
                        times:$scope.searchOptions.times,
                        resultType:$scope.searchOptions.resultType,
                        startTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[0]:null,
                        endTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[1]:null,

                        start:0,
                        num:10,
                    };
                    if($scope.searchOptions.nodeIds.length>0){
                        url=commonMethod.getServerUrl()+"/rest/statistics/daas/node/trend/cacheInfo";//节点
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

                                        if($scope.searchOptions.nodeIds.length>0){//生成节点的
                                            //生成legend
                                            sort.legend[index]=$translate.instant("node")+"-"+value.nodeId;
                                            //生成series
                                            sort.series[index]={name:$translate.instant("node")+"-"+value.nodeId,type:"line",};

                                        }else{//生成省份的

                                            //生成legend
                                            sort.legend[index]=$translate.instant("province")+"-"+value.provinceId;
                                            //生成series
                                            sort.series[index]={name:$translate.instant("province")+"-"+value.provinceId,type:"line",};
                                            //将省份id换成名称
                                            for(let{id,name} of $scope.provinceList){
                                                if(id==value.provinceId){
                                                    //生成legend
                                                    sort.legend[index]=$translate.instant("province")+"-"+name;
                                                    //生成series
                                                    sort.series[index]={name:$translate.instant("province")+"-"+name,type:"line",};
                                                    break;
                                                }
                                            } 
                                            
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
                       
    
                    }).catch((err)=>{});
    
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
                if(time2-time1<31*24*60*60*1000){
                    $scope.getPageData();

                }else{
                    commonMethod.layuiTip($translate.instant("timeOver"),"notice");
                }

            }  
        };

        //导出
        $scope.export=()=>{
            let url=commonMethod.getServerUrl()+"/rest/statistics/daas/province/cacheInfo/excel";//省份
            let obj={
                provinces:$scope.searchOptions.provinces,
                sortType:$scope.searchOptions.sortType,
                startTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[0]:'',
                endTime:$scope.searchOptions.time?$scope.searchOptions.time.split(" ~ ")[1]:'',
            }
            if($scope.searchOptions.nodeIds.length>0){
                url=commonMethod.getServerUrl()+"/rest/statistics/daas/node/cacheInfo/excel";//节点
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
                            var res = '<div><p>' + params[0].value[0]+ '</p></div>'
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
                    // $scope["echart"+value.id].setOption($scope["option"+value.id]);
                    $scope["echart"+value.id].resize();
                }
            });
        }

        $scope.init();

        window.removeEventListener("resize",resize);
        window.addEventListener("resize",resize);
    };
    module.exports=pAnReportCtrl;

})(angular.module("app"));