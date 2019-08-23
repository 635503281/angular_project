(function(app){
    "use strict";

    app.controller("authorityEditCtrl",authorityEditCtrl);
    authorityEditCtrl.$inject=["$scope","$http","$state","$stateParams","$translate","commonMethod","cpService"];
    function authorityEditCtrl($scope,$http,$state,$stateParams,$translate,commonMethod,cpService){
        //初始化
        $scope.init=()=>{
            //传过来的id值
            $scope.id=parseInt($stateParams.id);

            //鉴权方式
            $scope.authTypeList=[
                {id:0,name:$translate.instant("closeAuthority")},
                {id:1,name:$translate.instant("localAuthority")},
                {id:2,name:$translate.instant("secondAuthority")}
            ];

            //获取cp列表
            $scope.cpList=[{cpId:null,name:$translate.instant("nothing")}];
            cpService.getCpList().then(list=>{
                $scope.cpList=list;
            });

            if($scope.id==0){//添加

                $scope.item={
                    cpid:null,//cpid
                    domain:null,//域名
                    authType:0,//鉴权方式
                    fileType:null,//文件类型
                    keyValue:null,//秘钥
                    keyVersion:null,//秘钥版本
                    keyEffectiveDate:null,//秘钥生效期
                }

            }else{//修改
                let url=commonMethod.getServerUrl()+"/rest/auth/getAuthInfo";
                $http.post(url,{id:$scope.id}).then(({data})=>{
                    if(data.success){
                        $scope.item=data.data.list[0];
                        //处理数据
                        if($scope.item.keyEffectiveDate)$scope.item.keyEffectiveDate=new Date($scope.item.keyEffectiveDate).format('yyyy-MM-dd hh:mm:ss');
                    }
                    
                }).catch((err)=>{});
            }

        };
        
        //保存
        $scope.save=()=>{
            let url=commonMethod.getServerUrl()+"/rest/auth/addAuthInfo";//添加
            if($scope.id!=0)url=commonMethod.getServerUrl()+"/rest/auth/modifyAuthInfo";//修改

            //处理参数
            let obj=angular.copy($scope.item);
            if(obj.authType!=1){
                obj.keyValue=null;
                obj.keyVersion=null;
                obj.keyEffectiveDate=null;
            }else{
                if(obj.keyEffectiveDate)obj.keyEffectiveDate=Date.parse(obj.keyEffectiveDate);
            }
            
            $http.post(url,obj).then(({data})=>{
                if(data.success){
                    let msg=$scope.id==0?"add_S":"modify_S";
                    commonMethod.layuiTip($translate.instant(msg)).then($scope.return);
           
                }
               
            }).catch((err)=>{});

        };

        //取消
        $scope.return=()=>{
            $state.go("index.authentication.authority.list",{flag:1});
        };

        $scope.init();

    };
    module.exports=authorityEditCtrl;

})(angular.module("app"));