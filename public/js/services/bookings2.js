angular.module('mean.bookings').factory("BookingsByMonth", ['$resource', function($resource) {
    return $resource('bookingsByMonth/:month', {
        month: '@_id'
    });
}]);