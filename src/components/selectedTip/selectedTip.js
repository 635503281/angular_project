(function(Components){
    "use strict";

    Components.directive("selectedTip",[function(){
        return{
            restrict:"E",
            replace:true,
            scope:{
                length:"=",
            },
            template:`<span class="pageBtn_bai36 selectedTip" >{{'selected'|translate}}<span>{{length}}</span>{{'bar'|translate}}。</span>`
        }
    }])

})(angular.module("Components"));