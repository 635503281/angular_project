(function(Constant){
    "use strict";

    Constant.constant("menuConstant",{
        menu:[
            {//鉴权管理
                id:"001",name:"authenticationMmanagement",url:"index.authentication",icon:"layui-icon-theme",isShow:true,
                children:[
                    {id:"00101",parentId:"001",name:"authority",url:"index.authentication.authority",isShow:true},
                    {id:"00102",parentId:"001",name:"safeChain",url:"index.authentication.safeChain",isShow:true},
                    // {id:"00103",parentId:"001",name:"page1",url:"index.authentication.page1",isShow:true},
                ]
            },
            {//策略管理
                id:"002",name:"strategyManagement",url:"index.strategy",icon:"layui-icon-engine",isShow:true,
                children:[
                    {id:"00201",parentId:"002",name:"globalSchedulingS",url:"index.strategy.globalSchedulingS",isShow:true},
                    {id:"00202",parentId:"002",name:"globalSchedulingD",url:"index.strategy.globalSchedulingD",isShow:true},
                    {id:"00203",parentId:"002",name:"areaSchedulingS",url:"index.strategy.areaSchedulingS",isShow:true},
                    {id:"00204",parentId:"002",name:"localSchedulingS",url:"index.strategy.localSchedulingS",isShow:true},
                    {id:"00205",parentId:"002",name:"resourceStrategy",url:"index.strategy.resourceStrategy",isShow:true},
                    {id:"00206",parentId:"002",name:"cpdomainConfig",url:"index.strategy.domainManagement",isShow:true},
                    {id:"00207",parentId:"002",name:"ipDatabase",url:"index.strategy.ipDatabase",isShow:true},
                    {id:"00208",parentId:"002",name:"auxiliaryStrategy",url:"index.strategy.auxiliaryStrategy",isShow:true},
                    {id:"00209",parentId:"002",name:"blackWhiteList",url:"index.strategy.blackWhiteList",isShow:true},
                    // {id:"00210",parentId:"002",name:"configPolicy",url:"index.strategy.configPolicy",isShow:true},
                    // {id:"00211",parentId:"002",name:"cacheConfig",url:"index.strategy.cacheConfig",isShow:true},
                ]
            },
            {//缓存策略管理
                id:"009",name:"cacheStrategyManagement",url:"index.cacheStrategy",icon:"layui-icon-tabs",isShow:true
            },
            {//内容管理
                id:"003",name:"contentManagement",url:"index.content",icon:"layui-icon-form",isShow:true,
                children:[
                    {id:"00301",parentId:"003",name:"contentM",url:"index.content.contentM",isShow:true},
                    // {name:"contentOTT",url:"index.content.contentOTT",isShow:true},
                    {id:"00302",parentId:"003",name:"contentQuery",url:"index.content.contentQuery",isShow:true},
                    {id:"00303",parentId:"003",name:"badInfo",url:"index.content.badInfo",isShow:true},
                    {id:"00304",parentId:"003",name:"badDomain",url:"index.content.badDomain",isShow:true},
                    {id:"00305",parentId:"003",name:"policyConfig",url:"index.content.policyConfig",isShow:true},
                ]
            },
            {//视图管理
                id:"004",name:"viewManagement",url:"index.view",icon:"layui-icon-app",isShow:true,
                children:[
                    {id:"00401",parentId:"004",name:"domainView",url:"index.view.domainView",isShow:true},
                    {id:"00402",parentId:"004",name:"hotDomain",url:"index.view.hotDomain",isShow:true},
                    {id:"00403",parentId:"004",name:"singleDomain",url:"index.view.singleDomain",isShow:true},
                ]
            },
            {//统一日志报表
                id:"005",name:"logReport",url:"index.logReport",icon:"layui-icon-console",isShow:true,
                children:[
                    {id:"00501",parentId:"005",name:"pAnReport",url:"index.logReport.pAnReport",isShow:true},
                    {id:"00502",parentId:"005",name:"cAdReport",url:"index.logReport.cAdReport",isShow:true},
                    {id:"00503",parentId:"005",name:"cAnReport",url:"index.logReport.cAnReport",isShow:true},
                    {id:"00504",parentId:"005",name:"boc",url:"index.logReport.boc",isShow:true},
                    // {id:"00505",parentId:"005",name:"resource",url:"index.logReport.resource",isShow:true},
                    // {id:"00506",parentId:"005",name:"cacheContent",url:"index.logReport.cacheContent",isShow:true},
                ]
            },
            {//日志管理
                id:"006",name:"logManagement",url:"index.log",icon:"layui-icon-file",isShow:true,
                children:[
                    {id:"00601",parentId:"006",name:"sendConfig",url:"index.log.sendConfig",isShow:true},
                    {id:"00602",parentId:"006",name:"receiveConfig",url:"index.log.receiveConfig",isShow:true},
                    {id:"00603",parentId:"006",name:"operateLogQuery",url:"index.log.operateLogQuery",isShow:true},
                    {id:"00604",parentId:"006",name:"securityLog",url:"index.log.securityLog",isShow:true},
                ]
            },
            {//安全管理
                id:"007",name:"securityManagement",url:"index.security",icon:"layui-icon-vercode",isShow:true,
                children:[
                    {id:"00701",parentId:"007",name:"userM",url:"index.security.userM",isShow:true},
                    {id:"00702",parentId:"007",name:"onlineUser",url:"index.security.onlineUser",isShow:true},
                    {id:"00703",parentId:"007",name:"roleM",url:"index.security.roleM",isShow:true},
                ]
            },
            {//系统配置
                id:"008",name:"systemConfig",url:"index.system",icon:"layui-icon-set",isShow:true,
                children:[
                    {id:"00801",parentId:"008",name:"systemM",url:"index.system.systemM",isShow:true},
                    {id:"00802",parentId:"008",name:"archiveManagement",url:"index.system.archive",isShow:true},  
                ]
            }
        ]
    });

})(angular.module('Constant'));