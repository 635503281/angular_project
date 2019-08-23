(function(app){
    "use strict";

    app.controller("archiveEditCtrl",archiveEditCtrl);
    archiveEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function archiveEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            if($scope.id==0){//添加

                $scope.item={
                    tableName:null,//归档名称
                    dateLimit:null,//时间限制(天)
                    countLimit:null,//总数限制(条)
                    elementName:null,//元素名称
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/dataClear/getDataClearConfigById?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                       
                    }
                    
                }).catch((err)=>{});
            }

        };
        
        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/dataClear/addDataClearConfig";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/dataClear/modifyDataClearConfig";//修改

            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.system.archive.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=archiveEditCtrl;

})(angular.module("app"));