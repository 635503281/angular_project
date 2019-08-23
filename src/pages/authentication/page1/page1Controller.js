
(function(app){
    "use strict";

    app.controller("networkPage1Ctrl",networkPage1Ctrl);
    networkPage1Ctrl.$inject=['$scope','$translate','$state','commonMethod'];
    function networkPage1Ctrl($scope,$translate,$state,commonMethod){
         //初始化
         $scope.init=function(){
            //分页参数
            $scope.pagingOptions={
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                currentPage: 1,
                total: 100,// 存放list总记录数
                maxPages: 10,// 最大页数
            };
            
            //时间
            $scope.time1="2018-08-09 00:00:00 - 2018-09-19 00:00:00";
            
            //展示数据
            $scope.items=[
                {name:"lisai",age:25,gao:182},
                {name:"lisai1",age:24,gao:182},
                {name:"lisai2",age:27,gao:182},
                {name:"lisai3",age:21,gao:182},
                {name:"lisai",age:25,gao:182},
                {name:"lisai1",age:24,gao:182},
                {name:"lisai2",age:27,gao:182},
                {name:"lisai3",age:21,gao:182},
                {name:"lisai",age:25,gao:182},
                {name:"lisai1",age:24,gao:182}
            ];

            //初始化渲染table
            $scope.table=layui.table.render({
                elem:"#tab",
                cols:[[
                    {type:"checkbox",fixed:"left"},
                    {field:"name",title:$translate.instant("姓名"),sort:true,align:"center",
                     templet:`<div><a class="layui-table-link blue" title="{{d.name}}">{{d.name}}</a></div>`
                    },
                    {field:"age",title:$translate.instant("年龄"),sort:true,align:"center"},
                    {field:"gao",title:$translate.instant("身高"),align:"center"},
                    {title:$translate.instant("操作"),width:200,fixed:"right",align:"center",toolbar: '#barTool',}
                ]],
                data:$scope.items,//数据
                limit:$scope.items.length,//渲染显示的个数        
                // skin:"nob",//显示方式是否要border
                // initSort: {//初始化化排序
                //     field: 'age' ,//排序字段，对应 cols 设定的各字段名
                //     type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                // }
                
            });

            //编辑及删除
            layui.table.on("tool(tab)",({data,event})=>{
                switch(event){
                    case "edit"://编辑
                        console.log(data);
                        $state.go("index.network.page2");
                    break;
                    case "del"://删除
                        commonMethod.layuiConfirm("是否删除").then(function(){
                            $scope.items.pop();
                            $scope.getPageData();
                        });
                      
                    break;
                }
            })
            //选中的
            layui.table.on('checkbox(tab)',function(obj){
                $scope.selectItems=layui.table.checkStatus('tab').data;
            })
        
            $scope.getPageData();

        };
        
        //分页
        $scope.getPageData=function(){
            // console.log($scope.pagingOptions.currentPage);
            //获取数据后重新加载table
            $scope.table.reload({
                data:$scope.items,
                limit:$scope.items.length
            })
    
        };

        //搜索
        $scope.search=function(){
            
        };
        $scope.init();  

    };
    module.exports=networkPage1Ctrl;


})(angular.module("app"));