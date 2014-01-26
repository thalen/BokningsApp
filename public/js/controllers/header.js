angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Mina bokningar",
        "link": "myBookings"
    }, {
        "title": "Boka rum",
        "link": "bookings"
    }];
    
    $scope.isCollapsed = false;
}]);