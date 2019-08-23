
(function(){
    "use strict";

    angular.module("Filters",[])
    .filter("arrTostr",[function(){
        return function(arr,key){
            return arr.map(value=>value[key]);
        }
    }])
    

})();