angular.module('mean.bookings').controller('BookingController', ['$scope', '$routeParams', '$location', '$log', '$modal', 'Global', 'Bookings', 'BookingsByMonth', function ($scope, $routeParams, $location, $log, $modal, Global, Bookings, BookingsByMonth) {
    $scope.global = Global;

    $scope.toggleCell = function(booking) {
        if (booking.cellSelected === 'undefined') {
            booking.cellSelected = true;
        } else if (typeof booking.user === 'undefined') {
            booking.cellSelected = !booking.cellSelected;
        }

        if (booking.cellSelected && (typeof booking.user === 'undefined'
            || booking.user._id === $scope.global.user._id)) {
            var modalInstance = $modal.open({
                templateUrl: 'createArticle.html',
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
                    },
                    remove: function() {
                        return function($modalInstance) {
                            var oldBooking = new Bookings({
                                _id: booking._id
                            });
                            oldBooking.$remove(function(response) {
                                booking.cellSelected = false;
                                delete booking.user;
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
        } else if (booking.cellSelected) {
            var modalInstance = $modal.open({
                templateUrl: 'readArticle.html',
                controller: ModalReadOnlyCtrl,
                resolve: {
                    selectedItem: function() {
                        return booking;
                    }
                }
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

        var d=new Date();
        var month=new Array();
        month[0]="Januari";
        month[1]="Februari";
        month[2]="Mars";
        month[3]="April";
        month[4]="Maj";
        month[5]="Juni";
        month[6]="Juli";
        month[7]="Augusti";
        month[8]="September";
        month[9]="Oktober";
        month[10]="November";
        month[11]="December";
        $scope.currentMonth = month[d.getMonth()];
        $scope.currentMonthId = d.getMonth();

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

    $scope.prevMonth = function() {
        if ($scope.currentMonthId > 0) {
        BookingsByMonth.get({month:$scope.currentMonthId-1}, function(bookings) {
           for (var key in bookings) {
                if (bookings.hasOwnProperty(key)) {
                    var values = bookings[key];
                    for (var i = 0; i < values.length; i++) {
                        values[i].cellSelected = typeof values[i].user !== 'undefined';
                    }
                }
            } 
            $scope.bookings = bookings;
            $scope.currentMonthId = $scope.currentMonthId-1;
            var month=new Array();
            month[0]="Januari";
            month[1]="Februari";
            month[2]="Mars";
            month[3]="April";
            month[4]="Maj";
            month[5]="Juni";
            month[6]="Juli";
            month[7]="Augusti";
            month[8]="September";
            month[9]="Oktober";
            month[10]="November";
            month[11]="December";
            $scope.currentMonth = month[$scope.currentMonthId];
        });
    }
    };

    $scope.nextMonth = function() {
        if ($scope.currentMonthId < 11) {
        BookingsByMonth.get({month:$scope.currentMonthId+1}, function(bookings) {
           for (var key in bookings) {
                if (bookings.hasOwnProperty(key)) {
                    var values = bookings[key];
                    for (var i = 0; i < values.length; i++) {
                        values[i].cellSelected = typeof values[i].user !== 'undefined';
                    }
                }
            } 
            $scope.bookings = bookings;
            $scope.currentMonthId = $scope.currentMonthId+1;
            var month=new Array();
            month[0]="Januari";
            month[1]="Februari";
            month[2]="Mars";
            month[3]="April";
            month[4]="Maj";
            month[5]="Juni";
            month[6]="Juli";
            month[7]="Augusti";
            month[8]="September";
            month[9]="Oktober";
            month[10]="November";
            month[11]="December";
            $scope.currentMonth = month[$scope.currentMonthId];
        });
    }
    };

    $scope.findOne = function() {
        Bookings.get({
            bookingId: $routeParams.bookingId
        }, function(booking) {
            $scope.booking = booking;
        });
    };

}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, items, selectedItem, currentUser, save, remove) {

  $scope.items = items;
  $scope.selectedItem = selectedItem;
  $scope.user = currentUser;
  $scope.save = save;
  $scope.remove = remove;
  $scope.newBooking = typeof selectedItem.user === 'undefined';

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

  $scope.removeBooking = function() {
    $scope.remove($modalInstance);
  };

  $scope.cancel = function () {
    if ($scope.newBooking) {
        $scope.selectedItem.cellSelected = false; 
    }
    $modalInstance.dismiss('cancel');
  };
};

var ModalReadOnlyCtrl = function ($scope, $modalInstance, selectedItem) {

  $scope.selectedItem = selectedItem;
  $scope.bookedBy = selectedItem.user.name;
  $scope.ok = function () {
   
    $modalInstance.dismiss('cancel');

  };

};