(function(app){
    'use strict';

    app.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.when("","login");
        $urlRouterProvider.otherwise('login');
        $stateProvider
        .state("login",{
            url:"/login",
            template:require('../pages/login/login.html'),
            controller:require("../pages/login/loginController")
        })
        .state("index",{
            url:"/index",
            template:require("../pages/index/index.html"),
            controller:require("../pages/index/indexController")
        })

        //鉴权管理
        .state("index.authentication",{
            url:"/authentication",
            template:require("../pages/authentication/authentication.html"),
            controller:require("../pages/authentication/authenticationController")
        })
            //鉴权策略
        .state("index.authentication.authority",{
            url:"/authority",
            template:require("../pages/authentication/authority/authority.html"),
            controller:require("../pages/authentication/authority/authorityController")
        })
                //list
        .state("index.authentication.authority.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/authentication/authority/list/authorityList.html"),
            controller:require("../pages/authentication/authority/list/authorityListController")
        })
                //edit
        .state("index.authentication.authority.edit",{
            url:"/edit/:id",
            template:require("../pages/authentication/authority/edit/authorityEdit.html"),
            controller:require("../pages/authentication/authority/edit/authorityEditController")
        })

            //防盗链策略
        .state("index.authentication.safeChain",{
            url:"/safeChain",
            template:require("../pages/authentication/safeChain/safeChain.html"),
            controller:require("../pages/authentication/safeChain/safeChainController")
        })
                //list
        .state("index.authentication.safeChain.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/authentication/safeChain/list/safeChainList.html"),
            controller:require("../pages/authentication/safeChain/list/safeChainListController")
        })
                //edit
        .state("index.authentication.safeChain.edit",{
            url:"/edit/:id",
            template:require("../pages/authentication/safeChain/edit/safeChainEdit.html"),
            controller:require("../pages/authentication/safeChain/edit/safeChainEditController")
        })

            //page1
        .state("index.authentication.page1",{
            url:"/page1",
            template:require("../pages/authentication/page1/page1.html"),
            controller:require("../pages/authentication/page1/page1Controller")
        })
        

        //策略管理
        .state("index.strategy",{
            url:"/strategy",
            template:require("../pages/strategy/strategy.html"),
            controller:require("../pages/strategy/strategyController")
        })
            //全局调度策略
        .state("index.strategy.globalSchedulingS",{
            url:"/globalSchedulingS",
            template:require("../pages/strategy/globalSchedulingS/globalSchedulingS.html"),
            controller:require("../pages/strategy/globalSchedulingS/globalSchedulingSController")
        })
                //list
        .state("index.strategy.globalSchedulingS.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/strategy/globalSchedulingS/list/globalSchedulingSList.html"),
            controller:require("../pages/strategy/globalSchedulingS/list/globalSchedulingSListController")
        })
                //edit
        .state("index.strategy.globalSchedulingS.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/globalSchedulingS/edit/globalSchedulingSEdit.html"),
            controller:require("../pages/strategy/globalSchedulingS/edit/globalSchedulingSEditController")
        })

            //全局调度域名
        .state("index.strategy.globalSchedulingD",{
            url:"/globalSchedulingD",
            template:require("../pages/strategy/globalSchedulingD/globalSchedulingD.html"),
            controller:require("../pages/strategy/globalSchedulingD/globalSchedulingDController")
        })
                //list
        .state("index.strategy.globalSchedulingD.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/strategy/globalSchedulingD/list/globalSchedulingDList.html"),
            controller:require("../pages/strategy/globalSchedulingD/list/globalSchedulingDListController")
        })
                //edit
        .state("index.strategy.globalSchedulingD.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/globalSchedulingD/edit/globalSchedulingDEdit.html"),
            controller:require("../pages/strategy/globalSchedulingD/edit/globalSchedulingDEditController")
        })

            //区域调度策略
        .state("index.strategy.areaSchedulingS",{
            url:"/areaSchedulingS",
            template:require("../pages/strategy/areaSchedulingS/areaSchedulingS.html"),
            controller:require("../pages/strategy/areaSchedulingS/areaSchedulingSController")
        })
                //list
        .state("index.strategy.areaSchedulingS.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/strategy/areaSchedulingS/list/areaSchedulingSList.html"),
            controller:require("../pages/strategy/areaSchedulingS/list/areaSchedulingSListController")
        })
                //edit
        .state("index.strategy.areaSchedulingS.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/areaSchedulingS/edit/areaSchedulingSEdit.html"),
            controller:require("../pages/strategy/areaSchedulingS/edit/areaSchedulingSEditController")
        })

           //本地调度策略
        .state("index.strategy.localSchedulingS",{
            url:"/localSchedulingS",
            template:require("../pages/strategy/localSchedulingS/localSchedulingS.html"),
            controller:require("../pages/strategy/localSchedulingS/localSchedulingSController")
        })
                //list
        .state("index.strategy.localSchedulingS.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/strategy/localSchedulingS/list/localSchedulingSList.html"),
            controller:require("../pages/strategy/localSchedulingS/list/localSchedulingSListController")
        })
                //edit
        .state("index.strategy.localSchedulingS.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/localSchedulingS/edit/localSchedulingSEdit.html"),
            controller:require("../pages/strategy/localSchedulingS/edit/localSchedulingSEditController")
        })

            //回源策略
        .state("index.strategy.resourceStrategy",{
            url:"/resourceStrategy",
            template:require("../pages/strategy/resourceStrategy/resourceStrategy.html"),
            controller:require("../pages/strategy/resourceStrategy/resourceStrategyController")
        })
                //list
        .state("index.strategy.resourceStrategy.list",{
            url:"/list",
            params:{currentTab:null},//tab切换页
            template:require("../pages/strategy/resourceStrategy/list/resourceStrategyList.html"),
            controller:require("../pages/strategy/resourceStrategy/list/resourceStrategyListController")
        })
                //edit
        .state("index.strategy.resourceStrategy.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/resourceStrategy/edit/resourceStrategyEdit.html"),
            controller:require("../pages/strategy/resourceStrategy/edit/resourceStrategyEditController")
        })

            //CP域名配置
        .state("index.strategy.domainManagement",{
            url:"/domainManagement",
            template:require("../pages/strategy/domainManagement/domainManagement.html"),
            controller:require("../pages/strategy/domainManagement/domainManagementController")
        })
                //list
        .state("index.strategy.domainManagement.list",{
            url:"/list",
            params:{currentTab:null,flag:0},//tab切换页,分页参数
            template:require("../pages/strategy/domainManagement/list/domainManagementList.html"),
            controller:require("../pages/strategy/domainManagement/list/domainManagementListController")
        })
             //edit
        .state("index.strategy.domainManagement.cpEdit",{
            url:"/cpEdit/:id",
            template:require("../pages/strategy/domainManagement/edit/cpEdit.html"),
            controller:require("../pages/strategy/domainManagement/edit/cpEditController")
        })
        .state("index.strategy.domainManagement.domainEdit",{
            url:"/domainEdit/:id",
            template:require("../pages/strategy/domainManagement/edit/domainEdit.html"),
            controller:require("../pages/strategy/domainManagement/edit/domainEditController")
        })

            //ip地址库
        .state("index.strategy.ipDatabase",{
            url:"/ipDatabase",
            template:require("../pages/strategy/ipDatabase/ipDatabase.html"),
            controller:require("../pages/strategy/ipDatabase/ipDatabaseController")
        })
                //list
        .state("index.strategy.ipDatabase.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/strategy/ipDatabase/list/ipDatabaseList.html"),
            controller:require("../pages/strategy/ipDatabase/list/ipDatabaseListController")
        })
                //edit
        .state("index.strategy.ipDatabase.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/ipDatabase/edit/ipDatabaseEdit.html"),
            controller:require("../pages/strategy/ipDatabase/edit/ipDatabaseEditController")
        })

             //辅助策略
        .state("index.strategy.auxiliaryStrategy",{
            url:"/auxiliaryStrategy",
            template:require("../pages/strategy/auxiliaryStrategy/auxiliaryStrategy.html"),
            controller:require("../pages/strategy/auxiliaryStrategy/auxiliaryStrategyController")
        })
                //list
        .state("index.strategy.auxiliaryStrategy.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/strategy/auxiliaryStrategy/list/auxiliaryStrategyList.html"),
            controller:require("../pages/strategy/auxiliaryStrategy/list/auxiliaryStrategyListController")
        })
                //edit
        .state("index.strategy.auxiliaryStrategy.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/auxiliaryStrategy/edit/auxiliaryStrategyEdit.html"),
            controller:require("../pages/strategy/auxiliaryStrategy/edit/auxiliaryStrategyEditController")
        })

            //黑白名单
        .state("index.strategy.blackWhiteList",{
            url:"/blackWhiteList",
            template:require("../pages/strategy/blackWhiteList/blackWhiteList.html"),
            controller:require("../pages/strategy/blackWhiteList/blackWhiteListController")
        })
                 //list
        .state("index.strategy.blackWhiteList.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/strategy/blackWhiteList/list/blackWhiteListList.html"),
            controller:require("../pages/strategy/blackWhiteList/list/blackWhiteListListController")
        })
                //edit
        .state("index.strategy.blackWhiteList.edit",{
            url:"/edit/:id",
            template:require("../pages/strategy/blackWhiteList/edit/blackWhiteListEdit.html"),
            controller:require("../pages/strategy/blackWhiteList/edit/blackWhiteListEditController")
        })

            //配置策略管理
        // .state("index.strategy.configPolicy",{
        //     url:"/configPolicy",
        //     template:`<my-iframe my-id="configPolicyIframe" url="/rest/sysConfig/getSysConfigValueByKey?key=FCRS_MANAGE_DNS_URL"></my-iframe>`
        // })

            //缓存集中配置
        // .state("index.strategy.cacheConfig",{
        //     url:"/cacheConfig",
        //     template:`<my-iframe my-id="cacheConfigIframe" url="/rest/sysConfig/getSysConfigValueByKey?key=FCRS_DOMAIN_MANAGE_URL"></my-iframe>`
        // })


        //缓存策略管理
        .state("index.cacheStrategy",{
            url:"/cacheStrategy",
            template:`<my-iframe my-id="cacheStrategyIframe" url="/rest/sysConfig/getSysConfigValueByKey?key=FCRS_CACHE_POLICY_MANAGEMENT_URL" link=true></my-iframe>`
        })


        //内容管理
        .state("index.content",{
            url:"/content",
            template:require("../pages/content/content.html"),
            controller:require("../pages/content/contentController")
        }) 
            //内容管理
        .state("index.content.contentM",{
            url:"/contentM",
            template:require("../pages/content/contentM/contentM.html"),
            controller:require("../pages/content/contentM/contentMController")
        })
                //list
        .state("index.content.contentM.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/content/contentM/list/contentMList.html"),
            controller:require("../pages/content/contentM/list/contentMListController")
        })
                 //注入
        .state("index.content.contentM.inject",{
            url:"/inject",
            template:require("../pages/content/contentM/inject/inject.html"),
            controller:require("../pages/content/contentM/inject/injectController")
        })
                //同步
        .state("index.content.contentM.synchro",{
            url:"/synchro",
            template:require("../pages/content/contentM/synchro/synchro.html"),
            controller:require("../pages/content/contentM/synchro/synchroController")
        })
                //分发
        .state("index.content.contentM.distribute",{
            url:"/distribute",
            template:require("../pages/content/contentM/distribute/distribute.html"),
            controller:require("../pages/content/contentM/distribute/distributeController")
        })
                //更新
        .state("index.content.contentM.update",{
            url:"/update",
            template:require("../pages/content/contentM/update/update.html"),
            controller:require("../pages/content/contentM/update/updateController")
        })
                //删除
        .state("index.content.contentM.delete",{
            url:"/delete",
            template:require("../pages/content/contentM/delete/delete.html"),
            controller:require("../pages/content/contentM/delete/deleteController")
        })

            //OTT内容管理
        .state("index.content.contentOTT",{
            url:"/contentOTT",
            template:require("../pages/content/contentOTT/contentOTT.html"),
            controller:require("../pages/content/contentOTT/contentOTTController")
        })

            //内容查询
        .state("index.content.contentQuery",{
            url:"/contentQuery",
            template:require("../pages/content/contentQuery/contentQuery.html"),
            controller:require("../pages/content/contentQuery/contentQueryController")
        })

            //不良信息
        .state("index.content.badInfo",{
            url:"/badInfo",
            template:require("../pages/content/badInfo/badInfo.html"),
            controller:require("../pages/content/badInfo/badInfoController")
        })
                //list
        .state("index.content.badInfo.list",{
            url:"/list",
            params:{flag:0},
            template:require("../pages/content/badInfo/list/badInfoList.html"),
            controller:require("../pages/content/badInfo/list/badInfoListController")
        })
                //edit
        .state("index.content.badInfo.edit",{
            url:"/edit/:id",
            template:require("../pages/content/badInfo/edit/badInfoEdit.html"),
            controller:require("../pages/content/badInfo/edit/badInfoEditController")
        })

           //恶意域名
        .state("index.content.badDomain",{
            url:"/badDomain",
            template:require("../pages/content/badDomain/badDomain.html"),
            controller:require("../pages/content/badDomain/badDomainController")
        })
                //list
        .state("index.content.badDomain.list",{
            url:"/list",
            params:{flag:0},
            template:require("../pages/content/badDomain/list/badDomainList.html"),
            controller:require("../pages/content/badDomain/list/badDomainListController")
        })
                //edit
        .state("index.content.badDomain.edit",{
            url:"/edit/:id",
            template:require("../pages/content/badDomain/edit/badDomainEdit.html"),
            controller:require("../pages/content/badDomain/edit/badDomainEditController")
        })

           //策略配置
        .state("index.content.policyConfig",{
            url:"/policyConfig",
            template:require("../pages/content/policyConfig/policyConfig.html"),
            controller:require("../pages/content/policyConfig/policyConfigController")
        })
                //list
        .state("index.content.policyConfig.list",{
            url:"/list",
            params:{flag:0},
            template:require("../pages/content/policyConfig/list/policyConfigList.html"),
            controller:require("../pages/content/policyConfig/list/policyConfigListController")
        })
                //edit
        .state("index.content.policyConfig.edit",{
            url:"/edit/:id/:type",
            template:require("../pages/content/policyConfig/edit/policyConfigEdit.html"),
            controller:require("../pages/content/policyConfig/edit/policyConfigEditController")
        })


        //视图管理
        .state("index.view",{
            url:"/view",
            template:require("../pages/view/view.html"),
            controller:require("../pages/view/viewController")
        })
            //域名视图查询
        .state("index.view.domainView",{
            url:"/domainView",
            template:require("../pages/view/domainView/domainView.html"),
            controller:require("../pages/view/domainView/domainViewController")
        })

            //热点域名查询
        .state("index.view.hotDomain",{
            url:"/hotDomain",
            template:require("../pages/view/hotDomain/hotDomain.html"),
            controller:require("../pages/view/hotDomain/hotDomainController")
        })

            //指定域名查询
        .state("index.view.singleDomain",{
            url:"/singleDomain",
            template:require("../pages/view/singleDomain/singleDomain.html"),
            controller:require("../pages/view/singleDomain/singleDomainController")
        })


        //统一日志报表
        .state("index.logReport",{
            url:"/logReport",
            template:require("../pages/logReport/logReport.html"),
            controller:require("../pages/logReport/logReportController")
        })
           //省份和节点统一报表
        .state("index.logReport.pAnReport",{
            url:"/pAnReport",
            template:require("../pages/logReport/pAnReport/pAnReport.html"),
            controller:require("../pages/logReport/pAnReport/pAnReportController")
        })
            //cp和域名统一报表
        .state("index.logReport.cAdReport",{
            url:"/cAdReport",
            template:require("../pages/logReport/cAdReport/cAdReport.html"),
            controller:require("../pages/logReport/cAdReport/cAdReportController")
        })
            //cp和节点统一报表
        .state("index.logReport.cAnReport",{
            url:"/cAnReport",
            template:require("../pages/logReport/cAnReport/cAnReport.html"),
            controller:require("../pages/logReport/cAnReport/cAnReportController")
        })

            //拨测
        .state("index.logReport.boc",{
            url:"/boc",
            template:`<my-iframe my-id="bocIframe" url="/rest/statistics/daas/boc/url"></my-iframe>`
        })
            //缓存回源
        // .state("index.logReport.resource",{
        //     url:"/resource",
        //     template:`<my-iframe my-id="resourceIframe" url="/rest/sysConfig/getSysConfigValueByKey?key=FCRS_SOURCE_FLOW_URL"></my-iframe>`
        // })
            //缓存内容信息
        // .state("index.logReport.cacheContent",{
        //     url:"/cacheContent",
        //     template:`<my-iframe my-id="cacheContentIframe" url="/rest/sysConfig/getSysConfigValueByKey?key=FCRS_CACHE_CONTENT_URL"></my-iframe>`
        // })


        //日志管理
        .state("index.log",{
            url:"/log",
            template:require("../pages/log/log.html"),
            controller:require("../pages/log/logController")
        })
           //发送配置
        .state("index.log.sendConfig",{
            url:"/sendConfig",
            template:require("../pages/log/configQuery/sendConfig.html"),
            controller:require("../pages/log/configQuery/sendConfigController")
        })
           //接收配置
        .state("index.log.receiveConfig",{
            url:"/receiveConfig",
            template:require("../pages/log/configQuery/receiveConfig.html"),
            controller:require("../pages/log/configQuery/receiveConfigController")
        })

           //操作日志查询
        .state("index.log.operateLogQuery",{
            url:"/operateLogQuery",
            template:require("../pages/log/operateLogQuery/operateLogQuery.html"),
            controller:require("../pages/log/operateLogQuery/operateLogQueryController")
        })

           //安全日志
        .state("index.log.securityLog",{
            url:"/securityLog",
            template:require("../pages/log/securityLog/securityLog.html"),
            controller:require("../pages/log/securityLog/securityLogController")
        })

        
        //安全管理
        .state("index.security",{
            url:"/security",
            template:require("../pages/security/security.html"),
            controller:require("../pages/security/securityController")
        })
            //用户管理
        .state("index.security.userM",{
            url:"/userM",
            template:require("../pages/security/userM/userM.html"),
            controller:require("../pages/security/userM/userMController")
        })
                //list
        .state("index.security.userM.list",{
            url:"/list",
            params:{flag:0},
            template:require("../pages/security/userM/list/userMList.html"),
            controller:require("../pages/security/userM/list/userMListController")
        })
                //edit
        .state("index.security.userM.edit",{
            url:"/edit/:id",
            template:require("../pages/security/userM/edit/userMEdit.html"),
            controller:require("../pages/security/userM/edit/userMEditController")
        })

            //角色管理
        .state("index.security.roleM",{
            url:"/roleM",
            template:require("../pages/security/roleM/roleM.html"),
            controller:require("../pages/security/roleM/roleMController")
        })
                //list
        .state("index.security.roleM.list",{
            url:"/list",
            params:{flag:0},
            template:require("../pages/security/roleM/list/roleMList.html"),
            controller:require("../pages/security/roleM/list/roleMListController")
        })
                //edit
        .state("index.security.roleM.edit",{
            url:"/edit/:id",
            template:require("../pages/security/roleM/edit/roleMEdit.html"),
            controller:require("../pages/security/roleM/edit/roleMEditController")
        })

        //修改密码
        .state("index.modifyPsd",{
            url:"/modifyPsd",
            template:require("../pages/security/modifyPsd/modifyPsd.html"),
            controller:require("../pages/security/modifyPsd/modifyPsdController")
        })

            //在线用户
        .state("index.security.onlineUser",{
            url:"/onlineUser",
            template:require("../pages/security/onlineUser/onlineUser.html"),
            controller:require("../pages/security/onlineUser/onlineUserController")
        })


        //系统配置
        .state("index.system",{
            url:"/system",
            template:require("../pages/system/system.html"),
            controller:require("../pages/system/systemController")
        })
            //归档管理
        .state("index.system.archive",{
            url:"/archive",
            template:require("../pages/system/archive/archive.html"),
            controller:require("../pages/system/archive/archiveController")
        })
                //list
        .state("index.system.archive.list",{
            url:"/list",
            params:{flag:0},//保存分页参数
            template:require("../pages/system/archive/list/archiveList.html"),
            controller:require("../pages/system/archive/list/archiveListController")
        })
                //edit
        .state("index.system.archive.edit",{
            url:"/edit/:id",
            template:require("../pages/system/archive/edit/archiveEdit.html"),
            controller:require("../pages/system/archive/edit/archiveEditController")
        })

           //系统配置
        .state("index.system.systemM",{
            url:"/systemM",
            template:require("../pages/system/systemM/systemM.html"),
            controller:require("../pages/system/systemM/systemMController")
        })
                //list
        .state("index.system.systemM.list",{
            url:"/list",
            params:{flag:0},
            template:require("../pages/system/systemM/list/systemMList.html"),
            controller:require("../pages/system/systemM/list/systemMListController")
        })
                //edit
        .state("index.system.systemM.edit",{
            url:"/edit/:id",
            template:require("../pages/system/systemM/edit/systemMEdit.html"),
            controller:require("../pages/system/systemM/edit/systemMEditController")
        })

    }]);

    //全局监听路由变化
    app.run(["$rootScope","$transitions","loginService","$state","menuConstant","menuService",function($rootScope,$transitions,loginService,$state,menuConstant,menuService){
        //不处理默认跳转错误
        $state.defaultErrorHandler(function(error) {if(error.type!=2)console.error(error)});   

        //路由监听
        $transitions.onStart({},function(transition){
            //没有登录跳到登录页面
            if(!loginService.isLogin()){
                if(transition.$to().name=="login")return;
                loginService.clear();
               
            }else{
                //关闭全局加载层
                $rootScope.loading=false;

                //跳转滚动条回到顶部
                if($("#main-right").scrollTop()>0)$("#main-right").scrollTop(0);

                //去掉外链样式
                $("#main").removeClass('link');

                //去掉layuiTip的弹框
                if($(".layui-layer").length>0)layui.layer.closeAll();

                //处理空白页面,重新加载
                setTimeout(function(){
                    var html=$("ui-view").eq($("ui-view").length-1).html();
                    if(!html)$state.reload(transition.$to().name);
                },0);

                //禁止跳转没有权限的菜单
                function noGoMenu(menuList){
                    for(let menu of menuList){
                        if(!menu.isShow&&transition.$to().name.includes(menu.url)){
                            $state.go("index");
                            return true
                        }
                    }
                    return false
                }

                if(transition.$to().path[2]){//缓存一级菜单url
                    //不让跳转一级菜单
                    if(noGoMenu(menuConstant.menu))return;

                    //菜单转换成list
                    let menuArr=menuService.treeTransArray(loginService.getMenu(),"children");

                    var currentFirstMenuUrl=transition.$to().path[2].name;
                    $rootScope.currentFirstMenuUrl=currentFirstMenuUrl;
                    //保存一级菜单的名字
                    for(let menu of menuArr){
                        if(menu.menuLink===currentFirstMenuUrl){
                            if($rootScope.firstMenuName!==menu.menuText)$rootScope.firstMenuName=menu.menuText;
                            break;
                        }
                    }
                    // 路由跳转了才存
                    if($rootScope.currentFirstMenuUrl!=sessionStorage.getItem("currentFirstMenuUrl")){
                        sessionStorage.setItem("currentFirstMenuUrl",currentFirstMenuUrl);
                    }  
                    
                    if(transition.$to().path[3]){//缓存二级菜单url
                        //不让跳转二级菜单
                        if(noGoMenu(menuService.getSecondMenuList(currentFirstMenuUrl)))return;

                        var currentSecondMenuUrl=transition.$to().path[3].name;
                        $rootScope.currentSecondMenuUrl=currentSecondMenuUrl;
                        //保存二级菜单的名字
                        for(let menu of menuArr){
                            if(menu.menuLink===currentSecondMenuUrl){
                                if($rootScope.secondMenuName!==menu.menuText)$rootScope.secondMenuName=menu.menuText;
                                break;
                            }
                        }
    
                        if($rootScope.currentSecondMenuUrl!=sessionStorage.getItem("currentSecondMenuUrl")){
                            sessionStorage.setItem("currentSecondMenuUrl",currentSecondMenuUrl);
                        } 

                        if(transition.$to().path[4]){//缓存三级菜单url
                            var currentThirdMenuUrl=transition.$to().path[4].name;
                            $rootScope.currentThirdMenuUrl=currentThirdMenuUrl;

                            if($rootScope.currentThirdMenuUrl!=sessionStorage.getItem("currentThirdMenuUrl")){
                                sessionStorage.setItem("currentThirdMenuUrl",currentThirdMenuUrl);
                            }

                        }else{
                            //没有三级菜单就跳转默认的url
                            sessionStorage.removeItem("currentThirdMenuUrl");
                        }
    
                    }
                    
                }
                
            }
                   
            
        })

    }]);

})(angular.module('app'));