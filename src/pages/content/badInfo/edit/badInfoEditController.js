(function(app){
    "use strict";

    app.controller("badInfoEditCtrl",badInfoEditCtrl);
    badInfoEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod"];
    function badInfoEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //指令类型
            $scope.instructionList=[
                {id:null,name:$translate.instant("nothing")},
                {id:0,name:$translate.instant("instruction_0")},
                {id:1,name:$translate.instant("instruction_1")}
            ];

            if($scope.id==0){//添加

                $scope.item={
                    instruction:null,//指令类型
                    url:null,//违规的域名或URL
                    ipList:[]//{ipv4:null,ipv6:null}
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/blackAcl/get?id="+$scope.id;
                $http.get(url).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data;
                        if(!$scope.item.ipList)$scope.item.ipList=[];
                    }
                    
                }).catch((err)=>{});
            }

        };
        
        //添加ip
        $scope.addIp=()=>{
            $scope.item.ipList.push({ipv4:null,ipv6:null});
        };

        //删除ip
        $scope.delIp=(index,event)=>{
            commonMethod.listDelTip($translate.instant("isDeleteConfig"),event.target).then(function(){
                $scope.item.ipList.splice(index,1);
            });
        };

        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/blackAcl/add";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/blackAcl/edit";//修改

         
            $http.post(url,$scope.item).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.content.badInfo.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=badInfoEditCtrl;

})(angular.module("app"));