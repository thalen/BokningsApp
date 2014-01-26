angular.module('mean.bookings').controller('BookingController', ['$scope', '$routeParams', '$location', '$log', '$modal', 'Global', 'Bookings', function ($scope, $routeParams, $location, $log, $modal, Global, Bookings) {
    $scope.global = Global;

    $scope.toggleCell = function(booking) {
        if (booking.cellSelected === 'undefined') {
            booking.cellSelected = true;
        } else {
            booking.cellSelected = !booking.cellSelected;
        }

        if (booking.cellSelected) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    items: function () {
                        return $scope.bookings;
                    },
                    selectedItem: function() {
                        return booking;
                    },
                    currentUser: function() {
                        return $scope.global.user.name;
                    },
                    save: function() {
                        return function($modalInstance) {
                            var newBooking = new Bookings({
                                year: booking.year,
                                month: booking.month,
                                day: booking.day, 
                                fullDate: booking.fullDate
                            });
                            newBooking.$save(function(response) {
                                $modalInstance.close(response);
                            });
                        } 
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                //$scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };

    $scope.create = function() {
        var booking = new Bookings({
            title: this.title,
            content: this.content
        });
        booking.$save(function(response) {
            $location.path("bookings/" + response._id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(booking) {
        booking.$remove();  

        for (var i in $scope.bookings) {
            if ($scope.bookings[i] == booking) {
                $scope.bookings.splice(i, 1);
            }
        }
    };

    $scope.update = function() {
        var booking = $scope.booking;
        if (!booking.updated) {
            booking.updated = [];
        }
        booking.updated.push(new Date().getTime());

        booking.$update(function() {
            $location.path('bookings/' + booking._id);
        });
    };

    $scope.find = function() {

        Bookings.get(function(bookings) {
            for (var key in bookings) {
                if (bookings.hasOwnProperty(key)) {
                    var values = bookings[key];
                    for (var i = 0; i < values.length; i++) {
                        values[i].cellSelected = typeof values[i].user !== 'undefined';
                    }
                }
            }
            
            $scope.bookings = bookings;
        });
    };

    $scope.findOne = function() {
        Bookings.get({
            bookingId: $routeParams.bookingId
        }, function(booking) {
            $scope.booking = booking;
        });
    };

}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, items, selectedItem, currentUser, save) {

  $scope.items = items;
  $scope.selectedItem = selectedItem;
  $scope.user = currentUser;
  $scope.save = save;

  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
   
    var booking = $scope.selectedItem;
    if (!booking.updated) {
        booking.updated = [];
    }
    booking.updated.push(new Date().getTime());
    $scope.save($modalInstance);

  };

  $scope.cancel = function () {
    $scope.selectedItem.cellSelected = false; 
    $modalInstance.dismiss('cancel');
  };
};