var arbGetter = angular.module('arbGetter', []);

function mainController($scope, $http) {
    $scope.arbs = [];

    $http.get('/arbs')
        .success(function(data) {
            $scope.arbs = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
        
    $scope.formatNumber = function(i) {
        return i.toFixed(4);
    }

}