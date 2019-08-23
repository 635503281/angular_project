
(function(app){
    "use strict";

    app.controller("indexCtrl",indexCtrl);
    indexCtrl.$inject=['$scope',"$rootScope",'$window','$translate','$http','$state','$filter','loginService','commonMethod','menuConstant','menuService'];
    function indexCtrl($scope,$rootScope,$window,$translate,$http,$state,$filter,loginService,commonMethod,menuConstant,menuService){
        // 设置菜单权限
        let treeMenu= menuService.changeMenuData(loginService.getMenu(),{menuIcon:"icon",menuLink:"url"});
        let newArr= menuService.treeTransArray(treeMenu,"children");
        let newFilterArr=angular.copy(newArr);//用作比较的数组
        let oldArr= menuService.treeTransArray(angular.copy(menuConstant.menu),"children");
        let restArr= oldArr.filter((old,i)=>{//处理menuConstant.menu中的各属性
            delete old.menuText;
            for(let ne of newFilterArr){
                if(!ne.isShow)ne.isShow=true;
                if(old.url!==ne.url)continue;
                else{
                    old.isShow=true;
                    oldArr[i]=Object.assign(ne,old);//合并菜单的各种属性
                    return false
                } 
            }
            old.isShow=false;
            return true
        });
        let filterArr=[];//过滤出按钮权限数组
        let btnNameArr=[];//按钮权限key
        newFilterArr.map((ne,i)=>{
            if(ne.url&&ne.url===newArr[i].url&&ne.url.split(".").length>=3&&newArr[i].children&&newArr[i].children.length>0){
                //给每个页面按钮添加权限（usermM:{addBtn:true,addName:"添加",modifyBtn:true,modifyName:"修改"}）
                $rootScope[ne.name]={};
                newArr[i].children.map(value=>{
                    if(!value.url&&value.menuCode){
                        value.parentId=ne.id;
                        $rootScope[ne.name][value.menuCode+"Btn"]=true;
                        $rootScope[ne.name][value.menuCode+"Name"]=value.menuText;
                        filterArr.push(value);
                        btnNameArr.push(ne.name);

                        //有tab切换页面的按钮权限
                        if(value.children&&value.children.length>0){
                            value.children.map(va=>{
                                if(va.menuCode){
                                    $rootScope[ne.name][value.menuCode+"_"+va.menuCode+"Btn"]=true;
                                    $rootScope[ne.name][value.menuCode+"_"+va.menuCode+"Name"]=va.menuText;
                                    filterArr.push(va);
                                }
                            })
                        }
                    }  
                });   
            }
            
        });
        menuConstant.menu=menuService.arrayTransTree([...oldArr,...filterArr],"parentId");

        //初始化
        $scope.init=function(){
            
            //是否在加载
            $rootScope.loading=false;

            //初始语言
            $rootScope.lang=sessionStorage.getItem('lang')||'zh-cn';

            //初始化语言列表
            $scope.langList=[];
            loginService.getLangList().then(function([list,lang]){ 
                $scope.langList=list; 
                if($translate.use()==lang&&$rootScope.lang==lang)return;     
                $rootScope.lang=lang;
                $translate.use($rootScope.lang);    
               
            }).catch(e=>{});

            //用户名
            $rootScope.userName=sessionStorage.getItem("userName");

            //菜单
            $scope.menu=$filter('filter')(menuConstant.menu,{isShow:true});//过滤出有权限的菜单
      
            //当前一级菜单
            $rootScope.currentFirstMenuUrl=sessionStorage.getItem("currentFirstMenuUrl")||$scope.menu[0].url ;
           
            //默认跳转（刷新时跳转）
            $state.go($rootScope.currentFirstMenuUrl);

            let protocol=window.location.protocol === 'https'?"wss://":"ws://";
            $scope.socket(protocol+window.location.hostname+":54405");
        };

        //websocket监听
        $scope.socket=(url)=>{
            if(window.WebSocket){
                let socket=new WebSocket(url);
                socket.onopen=function(event){
                    console.log("socket链接成功");
                };
                socket.onmessage=function(event){
                    let data=JSON.parse(event.data);
                    console.log("socket数据:");
                    console.log(data);
                    
                    switch(data.type){
                        case 1:break;
                        case 2://触发内容状态改变事件
                            $scope.$broadcast("contentMChange",data.value);
                        break;
                        case 3://触发OTT内容状态改变事件
                            $scope.$broadcast("contentOTTChange",data.value);
                        break;
                    }
                    
                    
                };
                socket.onerror=function(event){
                    console.log("socket链接错误");
                };
                socket.onclose=function(event){
                    console.log("socket断开链接")
                };

                function sendNew(text){
                    socket.send(text);
                };
            }else{
                console.log("您的浏览器不支持websocket");
            }
        };

        //切换语言
        $scope.changeLang=async function(lang){
            if(lang!=$rootScope.lang){
                //处理语言
                let newLang=lang.split("-")[0]+"_"+lang.split("-")[1].toUpperCase();
                let url=commonMethod.getServerUrl()+"/rest/v1/setLanguage?language="+newLang;
                let {data}=await $http.get(url,{headers:{noLoading:true}});
                if(data.success){
                    //设置新的menu
                    loginService.setMenu(data.data.children);

                    sessionStorage.removeItem("langList");
                    sessionStorage.setItem('lang',lang);
                    //重新加载页面
                    $window.location.reload();
                }
               
            }
            
        };

        //退出
        $scope.exit=async function(){
            await loginService.exit();
            //清除按钮权限
            btnNameArr.map(key=>{ delete $rootScope[key]});
        };

        //展开一级菜单
        $scope.openFirstMenu=()=>{
            $("#f-nav-menu").addClass("open");
        };

        //关闭一级菜单
        $scope.closeFirstMenu=()=>{
            $("#f-nav-menu").removeClass("open");
        };

        //点击一级菜单
        $scope.clickFirstMenu=(firstMenu)=>{
            $scope.closeFirstMenu();
            if(firstMenu.url!==$scope.currentFirstMenuUrl)$state.go(firstMenu.url);  
        };
         
        
        $scope.init();

        //监听键盘事件
        $(document).on("keydown",(event)=>{
            let e=event||window.event;
            let code=e.keyCode||e.which;
            if(code==13){//确定键
                $("#search:not(:disabled)").click();
            }

        });

        //全局设置table
        layui.table.set({
            text:{
                none:$translate.instant("noData")
            },
            skin:"line",//用于设定表格风格line--行边框,row--列边框,nob--无边框  
            even:false,  //奇数偶数行背景颜色不同
        });

    };
    module.exports=indexCtrl;


})(angular.module("app"));